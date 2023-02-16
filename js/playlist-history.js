const PlaylistMutation = {
    Added: 'added',
    Init: 'initializing playlist history',
    Removed: 'removed',
    Reordered: 'reordered',
    Switch: 'switch',
}

class PlaylistHistory {
    constructor(maxStates = 10) {
        this.maxStates = maxStates;
        /** @private PlaylistState[] */ this.history = [];
        /** @private */ this.stateIndex = 0;
        /** @private */ this.updatingPlaylist = false;

        this.playlistAltered(PlaylistMutation.Init);
    }

    get length() {
        return this.history.length;
    }

    canBack() {
        return this.stateIndex > 0;
    }

    canForward() {
        return this.stateIndex < this.length - 1;
    }

    /**
     * Sets whether the history should ignore upcoming mutations and changes to the playlist.
     *
     * Playlist updates are synchronous, but notifications are async. If setting to false, we
     * update that value async as well to hopefully happen after all callbacks have called, and
     * and then manually call playlistAltered in case the playlist state has changed.
     * @param {boolean} ignore
     */
    set ignorePlaylistMutations(ignore) {
        if (!ignore) {
            setTimeout(() => {
                this.updatingPlaylist = false;
                this.playlistAltered(PlaylistMutation.Switch);
            }, 1);
        } else {
            this.updatingPlaylist = true;
        }
    }

    back() {
        this.stateIndex--;
        if (this.stateIndex <= 0) {
            this.stateIndex = 0;
        }
        debugLog('playlistHistory back =>', this.stateIndex);
        this.setPlaylistState();
    }

    forward() {
        this.stateIndex++;
        if (this.stateIndex >= this.length) {
            this.stateIndex = this.length - 1;
        }
        debugLog('playlistHistory forward =>', this.stateIndex);
        this.setPlaylistState();
    }

    /**
     * Call this to clear the history. Should always be called from on_playlists_changed
     * because all saved playlistIds have been invalidated.
     */
    reset() {
        this.history = [];
        this.playlistAltered(PlaylistMutation.Init);
    }

    /** @private */
    setPlaylistState() {
        this.updatingPlaylist = true;
        /** @type PlaylistState */ const activeState = this.history[this.stateIndex];
        const pbQueue = plman.GetPlaybackQueueContents();
        const plIndex = activeState.playlistId
        plman.UndoBackup(plIndex);
        plman.ActivePlaylist = plIndex;
        if (!activeState.locked) {
            const playingItem = plman.GetPlayingItemLocation();
            if (!playingItem.IsValid || playingItem.PlaylistIndex !== plIndex) {
                plman.ClearPlaylist(plIndex);
                plman.InsertPlaylistItems(plIndex, 0, activeState.playlistEntries);
            } else {
                const handles = plman.GetPlaylistItems(plIndex);
                const index = handles.Find(fb.GetNowPlaying());
                const stateHandles = activeState.playlistEntries.Clone();
                const stateIndex = stateHandles.Find(fb.GetNowPlaying());
                const stateHandlesClone = stateHandles.Clone();
                console.log('>>> now playing index:', index);
                // remove everything in playlist except currently playing song
                plman.ClearPlaylistSelection(plIndex);
                plman.SetPlaylistSelection(plIndex, [playingItem.PlaylistItemIndex], true);
                plman.RemovePlaylistSelection(plIndex, true);
                plman.ClearPlaylistSelection(plIndex);
                try {
                    stateHandles.RemoveById(stateIndex);
                } catch (e) {
                    plman.InsertPlaylistItems(plIndex, plman.PlaylistItemCount(plIndex), stateHandlesClone);
                }
                if (stateIndex > 0) {
                    stateHandles.RemoveRange(stateIndex, stateHandles.Count);
                    plman.InsertPlaylistItems(plIndex, 0, stateHandles);
                }
                if (stateIndex < stateHandlesClone.Count) {
                    stateHandlesClone.RemoveRange(0, stateIndex);
                    plman.InsertPlaylistItems(plIndex, plman.PlaylistItemCount(plIndex), stateHandlesClone);
                }
            }
        }
        this.restorePlaybackQueue(pbQueue);
        setTimeout(() => {
            this.updatingPlaylist = false;
        }, 1); // wait for callbacks to be called
    }

    /**
     * @private Attempts to re-mark playbackQueue items after setting playlist state
     * @param {FbPlaybackQueueItem[]} pbQueue
     */
    restorePlaybackQueue(pbQueue) {
        plman.FlushPlaybackQueue();
        pbQueue.forEach((queueItem) => {
            const itemPlaylist = queueItem.PlaylistIndex;
            const itemIndex = queueItem.PlaylistItemIndex;
            if (itemPlaylist !== -1 && itemIndex !== -1) {
                const plContents = {};
                if (!plContents[itemPlaylist]) {
                    plContents[itemPlaylist] = plman.GetPlaylistItems(itemPlaylist);
                }
                /** FbMetadbHandleList */ const playlistHandles = plContents[itemPlaylist];
                if (playlistHandles && playlistHandles[itemIndex] && playlistHandles[itemIndex].Path === queueItem.Handle.Path) {
                    plman.AddPlaylistItemToPlaybackQueue(itemPlaylist, itemIndex);
                } else {
                    const index = plContents[itemPlaylist].Find(queueItem.Handle);
                    if (index >= 0) {
                        plman.AddPlaylistItemToPlaybackQueue(itemPlaylist, index);
                    } else {
                        plman.AddItemToPlaybackQueue(queueItem.Handle);
                    }
                }
            } else {
                plman.AddItemToPlaybackQueue(queueItem.Handle);
            }
        });
    }

    /**
     * Notify the PlaylistHistory that a playlist was altered.
     * @param {string} mutationType
     */
    playlistAltered(mutationType) {
        // ignore playlist alterations when changing states
        console.log(mutationType);
        if (!this.updatingPlaylist && plman.ActivePlaylist >= 0) {
            const plItems = plman.GetPlaylistItems(plman.ActivePlaylist);
            if (this.shouldAddState(plman.ActivePlaylist, plItems, mutationType)) {
                if (this.stateIndex < this.length - 1) {
                    this.history = this.history.slice(0, this.stateIndex + 1);
                }
                if (this.length >= this.maxStates) {
                    this.history.shift();
                }
                this.history.push(new PlaylistState(plman.ActivePlaylist, plItems));
                this.stateIndex = this.length - 1;
                if (btns.back) {
                    btns.back.repaint();
                    btns.forward.repaint();
                }
                debugLog('stateIndex:', this.stateIndex, ' new items count:', plItems.Count, this.stateIndex);
            }
        }
    }

    /**
     * @private Determine if a new state should be added to the playlistHistory
     * @param {number} playlistId
     * @param {FbMetadbHandleList} newItems List of handles of playlist items
     * @param {string} mutationType currently unused
     * @returns {boolean}
     */
    shouldAddState(playlistId, newItems, mutationType) {
        const start = Date.now();
        const currState = this.history[this.stateIndex];
        if (!currState) {
            // init'ing playlist history
            return true
        }

        // if playlist ID is unchanged, and playlist is locked, don't save
        if (playlistId === currState.playlistId && plman.IsPlaylistLocked(playlistId)) {
            return false;
        }
        if (playlistId !== currState.playlistId ||
            currState.locked || plman.IsPlaylistLocked(playlistId) ||
            newItems.Count !== currState.playlistEntries.Count) {
            return true;
        }
        for (let i = 0; i < newItems.Count; i++) {
            if (newItems[i].RawPath !== currState.playlistEntries[i].RawPath) {
                // console.log(newItems[i].RawPath, currState.playlistEntries[i].RawPath);
                return true;
            }
        }
        debugLog(`Checking for duplicate playlist states took: ${Date.now() - start}ms`);
        return false;
    }
}

/**
 * @class
 * @constructor
 * @public
 */
class PlaylistState {
    /**
     * @param {number} playlistId
     * @param {FbMetadbHandleList} plItems
     */
    constructor(playlistId, plItems) {
        /**
         * @type {number}
         * @public
         */
        this.playlistId = playlistId;
        /**
         * @type {boolean}
         * @public
         */
        this.locked = plman.IsPlaylistLocked(playlistId);
        if (!this.locked) {
            // don't need to save items if playlist is locked, we'll just switch to it
            /** @type {FbMetadbHandleList} */ this.playlistEntries = plItems;
        }
    }
}