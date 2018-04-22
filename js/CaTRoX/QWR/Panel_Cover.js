// ==PREPROCESSOR==
// @name 'Cover Panel'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

g_script_list.push('Panel_Cover.js');

g_properties.add_properties(
    {
        panel_pad: ['user.panel.pad',   5]
    }
);

var mouse_move_suppress = new qwr_utils.MouseMoveSuppress();
var key_down_suppress = new qwr_utils.KeyModifiersSuppress();
var artModule = new ArtModule({border:true, thumbs:true, auto_cycle:true});

var ww;
var wh;

function on_paint(gr) {
    gr.FillSolidRect(0, 0, ww, wh, g_theme.colors.panel_back);
    artModule.paint(gr);
}

function on_size() {
    ww = window.Width;
    wh = window.Height;

    if (ww <= 0 || wh <= 0 ) {
        return;
    }

    artModule.on_size(g_properties.panel_pad, g_properties.panel_pad, ww - 2 * g_properties.panel_pad, wh - 2 * g_properties.panel_pad);
    artModule.get_album_art();
}

function on_get_album_art_done(metadb, art_id, image, image_path) {
    artModule.get_album_art_done(metadb, art_id, image, image_path);
}

function on_playlist_switch() {
    artModule.playlist_switch();
}

function on_playback_stop(reason) {
    artModule.playback_stop(reason);
}

function on_playback_new_track(metadb) {
    artModule.playback_new_track();
}

function on_item_focus_change(playlist_arg, from, to) {
    artModule.item_focus_change();
}

function on_mouse_move(x, y, m) {
    if (mouse_move_suppress.is_supressed(x,y,m)) {
        return;
    }

    artModule.mouse_move(x, y, m);
}

function on_mouse_lbtn_down(x, y, m) {
    artModule.mouse_lbtn_down(x, y, m);
}

function on_mouse_lbtn_dblclk() {
    artModule.mouse_lbtn_dblclk();
}

function on_mouse_lbtn_up(x, y, m) {
    artModule.mouse_lbtn_up(x, y, m);
}

function on_mouse_wheel(delta) {
    artModule.mouse_wheel(delta);
}

function on_mouse_leave() {
    artModule.mouse_leave();
}

function on_key_down(vkey) {
    if (key_down_suppress.is_supressed(vkey)) {
        return;
    }

    switch (vkey) {
        case VK_UP: {
            artModule.mouse_wheel(-1);
            break;
        }
        case VK_DOWN: {
            artModule.mouse_wheel(1);
            break;
        }
        case VK_F5: {
            artModule.reload_art();
            break;
        }
    }
}

function on_mouse_rbtn_up(x, y) {
    var cmm = new Context.MainMenu();

    artModule.append_menu_to(cmm);

    if (utils.IsKeyPressed(VK_SHIFT)) {
        qwr_utils.append_default_context_menu_to(cmm);
    }

    cmm.execute(x,y);
    cmm.dispose();

    return true;
}
