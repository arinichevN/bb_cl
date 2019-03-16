function VLogin() {
    this.type = VISU_TYPE.DIAL;
    this.container = null;
    this.header = null;
    this.nameI = null;
    this.pswdI = null;
    this.applyB = null;
    this.canceB = null;
    this.ACTION={LOGIN:1};
    this.init = function () {
        try{
        var self = this;
        this.container = cvis();
        this.header = cd();
        this.nameI = cd();
        this.pswdI = cb("");
        this.cancelB = new CancelButton(self, 1);
        this.applyB = new ApplyButton(self, 1);
		this.goalB.onmousedown = function () {
            self.mode = self.MODE.GOAL;
            inc.down(self);
        };
        this.deltaB.onmousedown = function () {
            self.mode = self.MODE.DELTA;
            inc.down(self);
        };
        this.updSign();
        this.signB.onclick = function () {
            self.chSign();
        };
        this.incB.innerHTML = this.inc;
        this.incB.onclick = function () {
            self.updInc();
        };
        this.cancelB.onclick = function () {
            self.cancel();
        };
        var c1 = cd();
        var c2 = cd();
        var c3 = cd();
        a(c1, [this.nameI]);
        a(c2, [this.pswdI]);
        a(c3, [this.applyB, this.cancelB]);
        a(this.container, [this.header, c1, c2, c3]);
        cla(this.container, ["login_cont"]);
        cla([this.header], "login_header");
        cla([c1, c2, c3], "login_cell4");
        cla([this.signB, this.incB, this.applyB, this.cancelB], "login_icell");
        cla([this.cancelB, this.applyB], ["login_btn"]);
        this.initialized = true;
        } catch (e) {
            console.log(e.message);
        }
    };
    this.getName = function () {
        return trans.get(65);
    };
    this.cancel = function (id) {
        goBack();
    };
    this.apply = function (id) {
        var data = [
            {
                action: ['user', 'login'],
                param: {name: this.nameI.value, pswd: this.pswdI.value}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.LOGIN, "json_dss");
    };
    this.getHeader = function(){
		return trans.get(65);
	};
    this.updateStr = function () {
		this.header.innerHTML = this.getHeader();
        this.cancelB.innerHTML = trans.get(5);
        this.applyB.innerHTML = trans.get(2);
    };
    this.confirm = function (action, d, n) {
		cursor_blocker.disable();
		switch (action) {
			case this.ACTION.LOGIN:
				goBack();
				break;
			default:
				console.log("confirm: unknown action");
				break;
		}
    };
    this.abort = function (action, m, n) {
		cursor_blocker.disable();
		switch (action) {
			case this.ACTION.LOGIN:
				logger.err(254);
				break;
			default:
				console.log("abort: unknown action");
				break;
		}
    };
    this.show = function () {
        clr(this.container, "hdn");
    };
    this.hide = function () {
        cla(this.container, "hdn");
    };
}
var vlogin = new VLogin();
visu.push(vlogin);
