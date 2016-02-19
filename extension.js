
const St = imports.gi.St;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Tweener = imports.ui.tweener;
const Gio = imports.gi.Gio;


let text, button;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello() {

  let url =
      Gio.file_new_for_uri('http://www.google.com/finance/info?q=STO:FING-B');

  let j = {}
    let str = String(url.load_contents(null)[1])
    j = JSON.parse(str.slice(6, -2));

    if (!text) {
        //text = new St.Label({ style_class: 'helloworld-label', text: "Kurs:":j['l'] });
        text = new St.Label({ style_class: 'helloworld-label', text: "Kurs: "+j['l']+" Diff: "+j['c']+" Procentvis: "+j['cp']});        
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
                      monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 4,
                       delay: 5,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    let gicon=Gio.icon_new_for_string(Me.path + "/icons/coin-money-4.png");
    let icon = new St.Icon({ gicon: gicon});
    /*let icon = new St.Icon({ icon_name: 'system-run-symbolic',
                             style_class: 'system-status-icon' });*/

    button.set_child(icon);
    button.connect('button-press-event', _showHello);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
