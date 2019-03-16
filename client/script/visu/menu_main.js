function MenuMain() {
    this.type = VISU_TYPE.MAIN;
    this.container = null;
    this.initialized = false;
    this.updated = false;
    this.b1 = null;
    this.b2 = null;
    this.b3 = null;
    this.b4 = null;
    this.b5 = null;
    this.b6 = null;
    this.init = function () {
        try {
            this.container = cvis();
            this.b2 = new NavigationButton(vmenu_log, "client/image/history.png");
            this.b4 = new NavigationButton(vequipment, "client/image/equipment.png");
            this.b5 = new NavigationButton(vmenu_alert, "client/image/alert.png");
            this.b6 = new NavigationButton(vhelp_logic, "f_js/image/help.png");
            cla([this.b1, this.b2, this.b3, this.b4, this.b5, this.b6], ["h15m", "ug1", "f2"]);
            a(this.container, [this.b1, this.b2, this.b3, this.b4, this.b5, this.b6]);
            this.initialized = true;
        } catch (e) {
            alert("menu_main: init: " + e.message);
        }
    };
    this.getName = function () {
		return trans.get(401);
    };
    this.updateStr = function () {
        try {
            this.b1.updateStr();
            this.b2.updateStr();
            this.b3.updateStr();
            this.b4.updateStr();
            this.b5.updateStr();
            this.b6.updateStr();
        } catch (e) {
            alert("menu_main: updateStr: " + e.message);
        }
    };
    this.show = function () {
        try {
            if (!this.updated) {
                this.updated = true;
            }
            clr(this.container, 'hdn');
            document.title = trans.get(401);
        } catch (e) {
            alert("menu_main: show: " + e.message);
        }
    };
    this.hide = function () {
        try {
            cla(this.container, 'hdn');
        } catch (e) {
            alert("menu_main: hide: " + e.message);
        }
    };
}
var vmenu_main = new MenuMain();
visu.push(vmenu_main);
