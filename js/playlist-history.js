const PlaylistMutation = {
    Added: 'added',
    Removed: 'removed',
    Reordered: 'reordered',
    Switch: 'switch',
}

class PlaylistHistory {
    constructor(maxStates = 10) {
        this.maxStates = maxStates;
        /** @private */ this.history = [];
        /** @private */ this.stateIndex = 0;
        /** @private */ this.updatingPlaylist = false;

        this.playlistAltered();
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
        this.playlistAltered();
    }

    setPlaylistState() {
        this.updatingPlaylist = true;
        const activeState = this.history[this.stateIndex];
        plman.ActivePlaylist = activeState.playlistId;
        if (!activeState.locked) {
            plman.ClearPlaylist(plman.ActivePlaylist);
            plman.InsertPlaylistItems(plman.ActivePlaylist, 0, activeState.playlistEntries);
        }
        setTimeout(() => {
            this.updatingPlaylist = false;
        }, 1); // wait for callbacks to be called
    }

    playlistAltered(mutationType) {
        // ignore playlist alterations when changing states
        // console.log(mutationType);
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
                debugLog('stateIndex:', this.stateIndex, ' new items count:', plItems.Count, this.stateIndex);
            }
        }
    }

    /**
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

class PlaylistState {
    constructor(playlistId, plItems) {
        this.playlistId = playlistId;
        this.locked = plman.IsPlaylistLocked(playlistId);
        if (!this.locked) {
            // don't need to save items if playlist is locked, we'll just switch to it
            this.playlistEntries = plItems;
        }
    }
}