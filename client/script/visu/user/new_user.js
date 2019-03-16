function VNewUser() {
    this.type = VISU_TYPE.DIAL;
    this.container = null;
    this.header = null;
    this.nameI = null;
    this.pswdI = null;
    this.kindI = null;
    this.applyB = null;
    this.canceB = null;
    this.slave = null;
    this.ACTION={ADD:1};
    this.kind = ['admin','actor','viewer'];
    this.kind_s = null;
    this.init = function () {
        try{
        var self = this;
        this.container = cvis();
        this.header = cd();
        this.nameI = new InputText();
        this.pswdI = new InputText();
        this.kindI = new SelectButton(app.USER_KIND.DICT, 2);
        this.cancelB = new CancelButton(self, 1);
        this.applyB = new ApplyButton(self, 1);
        this.cancelB.onclick = function () {
            self.cancel();
        };
        var c1 = cd();
        var c2 = cd();
        var c3 = cd();
        var c4 = cd();
        a(c1, [this.nameI]);
        a(c2, [this.pswdI]);
        a(c3, [this.kindI]);
        a(c4, [this.applyB, this.cancelB]);
        a(this.container, [this.header, c1, c2, c3, c4]);
        cla(this.container, ["login_cont"]);
        cla([this.header], "login_header");
        cla([c1, c2, c3, c4], "login_cell4");
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
                action: ['user', 'add'],
                param: {name: this.nameI.value, pswd: this.pswdI.value, kind: app.USER_KIND.STR[this.kindI.getSelectedIndex()]}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.ADD, "json_dss");
    };
    this.getHeader = function(){
		return trans.get(65);
	};
    this.updateStr = function () {
		this.header.innerHTML = this.getHeader();
		this.nameI.updateStr(trans.get(311), trans.get(311));
		this.pswdI.updateStr(trans.get(64), trans.get(64));
		this.kindI.updateStr();
        this.cancelB.innerHTML = trans.get(5);
        this.applyB.innerHTML = trans.get(2);
    };
    this.prep = function(slave, kind){
		this.slave = slave;
		this.kind_s = kind;
	};
    this.confirm = function (action, d, n) {
		switch (action) {
			case this.ACTION.ADD:
				var data = {success: true, item:{name: this.nameI.value, password: this.pswdI.value, kind: this.kind[this.kindI.getSelectedIndex()]}};
				this.slave.catchEdit(data, this.kind_s);
				goBack();
				break;
			default:
				console.log("confirm: unknown action");
				break;
		}
		cursor_blocker.disable();
    };
    this.abort = function (action, m, n) {
		switch (action) {
			case this.ACTION.ADD:
				logger.err(256);
				break;
			default:
				console.log("abort: unknown action");
				break;
		}
		cursor_blocker.disable();
    };
    this.show = function () {
        clr(this.container, "hdn");
    };
    this.hide = function () {
        cla(this.container, "hdn");
    };
}
var vnewuser = new VNewUser();
visu.push(vnewuser);
