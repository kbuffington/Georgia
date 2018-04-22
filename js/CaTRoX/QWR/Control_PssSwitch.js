// ==PREPROCESSOR==
// @name 'PSS Switch Control'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

g_script_list.push('Control_PssSwitch.js');

var pss_switch = new function() {

    /**
     * @constructor
     */
    function StateObject(name_arg, states_list_arg, default_state_arg) {

        // public:

        Object.defineProperty(this, "state", {

            /**
             * @return {string}
             */
            get : function () {
                return cur_state;
            },

            /**
             * @param {string} val
             */
            set : function (val) {
                cur_state = val;
                write_state(val);
            }
        });

        this.refresh = function() {
            write_state(cur_state);
        };

        // private:
        function initialize() {
            cur_state = read_state(name);
        }

        function read_state() {
            var pathToState = settings_path + '\\' + name.toUpperCase() + '_';

            var state = null;
            _.forEach(states_list, function (item, i) {
                if (fso.FileExists(pathToState + i)) {
                    state = item;
                    return false;
                }
            });
            if (state !== null) {
                return state;
            }

            var default_idx = states_list.indexOf(default_state);
            fso.CreateTextFile(pathToState + default_idx, true);
            return default_state;
        }

        function write_state(new_state) {
            var pathToState = settings_path + '\\' + name.toUpperCase() + '_';

            var index_new = states_list.indexOf(new_state);

            if (index_new === -1) {
                throw Error('Argument Error:\nUnknown state ' + new_state);
            }

            states_list.forEach(function(item,i) {
                _.deleteFile(pathToState + i);
            });
            if (!fso.FileExists(pathToState + index_new)) {
                fso.CreateTextFile(pathToState + index_new, true);
            }

            window.NotifyOthers(name + '_state', new_state);
            refresh_pss();
        }

        // private:
        var name = name_arg;
        var default_state = default_state_arg;
        var states_list = states_list_arg;

        var cur_state;

        initialize();
    }

    function refresh_pss() {
        if (fb.IsPlaying || fb.IsPaused) {
            fb.RunMainMenuCommand('Playback/Play or Pause');
            fb.RunMainMenuCommand('Playback/Play or Pause');
        }
        else {
            fb.RunMainMenuCommand('Playback/Play');
            fb.RunMainMenuCommand('Playback/Stop');
        }
    }

    // private:
    var settings_path = fb.ProfilePath + 'theme_settings\\' + g_theme.folder_name;
    _.createFolder(fb.ProfilePath + 'theme_settings');
    _.createFolder(settings_path);

    /** @type {StateObject} */
    this.minimode = new StateObject('minimode', ['Full', 'Mini', 'UltraMini'], 'Full');

    /** @type {StateObject} */
    this.spectrum = new StateObject('spectrum', ['Hide', 'Show'], 'Show');
};

// Example of use in a PSS :
// The first line set a panel stack global variable according to the panel current state, the second line switch the visibility of a panel named library, it show the panel when the current state is 3
// $set_ps_global(MAIN_PANEL_SWITCH,$right($findfile(themes/eole/Settings/MAINPANEL_*),1))
// $showpanel_c(library,$ifequal(%MAIN_PANEL_SWITCH%,3,1,0))