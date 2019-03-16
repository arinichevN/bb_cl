function VUserAction() {
    this.type = VISU_TYPE.TOP;
    this.container = {};
    this.data = [];//[name, password, kind]
    this.initialized = false;
    this.t1 = null;
    this.addB = null;
    this.delB = null;
    this.saveB = null;
    this.getB = null;
    this.bb = null;
    this.update = true;//editor will make it false
    this.last_sr = -1;
    this.last_sc = -1;
    this.del_block = false;//to deal with delete button and table click collision
    this.ROW = {NAME: 0, PASSWORD: 1, KIND:2};
    this.ACTION = {
        GET: 1,
        SAVE: 2
    };
    this.KIND = {ADMIN:0, ACTOR:1, VIEWER:2};
    this.PHONE_SIZE=12;
    this.visible = false;
    this.init = function () {
        try {
            var self = this;
            this.container = cvis();
            this.t1 = new Table(self, 1, trans, [[311, "30%"], [64, "30%"], [312, "30%"]]);
            this.t1.m_style = "copy_cell";
            this.t1.cellClickControl([true, true]);
            this.t1.enable();
            this.addB = cb("");
            this.delB = cb("");
            this.saveB = cb("");
            this.getB = cb("");
            this.bb = new BackButton();
            this.addB.onclick = function () {
                self.add();
            };
            this.delB.onclick = function () {
                self.delete();
            };
            this.saveB.onclick = function () {
                self.save();
            };
            this.getB.onclick = function () {
                self.getData();
            };
            var rcont = cd();
            a(rcont, [this.addB, this.delB, this.getB, this.saveB, this.bb]);
            a(this.container, [this.t1, rcont]);
            cla([this.t1], ["w70m", "lg1"]);
            cla([rcont], ["w30m", "lg1"]);
            cla([this.addB, this.delB, this.saveB, this.getB, this.bb], ["h20m", "ug1", "f1"]);
            this.initialized = true;
        } catch (e) {
            console.log(e.message);
        }
    };
    this.getName = function () {
		return trans.get(407);
    };
    this.updateStr = function () {
		this.t1.updateHeader();
		this.updateStrTblR();
		this.addB.innerHTML = trans.get(50);
		this.delB.innerHTML = trans.get(51);
		this.saveB.innerHTML = trans.get(1);
		this.getB.innerHTML = trans.get(57);
		this.bb.updateStr();
    };
    this.updateStrTblR=function(){
		for(var i=0;i<this.data.length;i++){
			this.t1.updateCell(i, 2, this.getKindStr(this.data[i].kind));
		}
	};
    this.getKindStr = function(kind){
		if(kind === this.KIND.ADMIN){
			return trans.get(308);
		}else if(kind === this.KIND.ACTOR){
			return trans.get(309);
		}else if(kind === this.KIND.VIEWER){
			return trans.get(310);
		}
		return "";
	};
    this.cellChanged = function (id) {
        try {
            if (this.del_block) {
                this.del_block = false;
                return;
            }
            if (this.last_sc === this.t1.sc && this.last_sr === this.t1.sr) {
                switch (this.t1.sc) {
                    case this.ROW.NAME:
                        var self = this;
                        vstring_edit_smp.prep(this.data[this.t1.sr].name, 16, INT32_MAX, self, this.t1.sc, 311);
                        showV(vstring_edit_smp);
                        break;
                    case this.ROW.PASSWORD:
                        var self = this;
                        vstring_edit_smp.prep(this.data[this.t1.sr].password, 16, INT32_MAX, self, this.t1.sc, 64);
                        showV(vstring_edit_smp);
                        break;
                    case this.ROW.KIND:
                        if(this.data[this.t1.sr].kind = this.KIND.ADMIN){
							this.data[this.t1.sr].kind = this.KIND.ACTOR;
						}else if(this.data[this.t1.sr].kind = this.KIND.ACTOR){
							this.data[this.t1.sr].kind = this.KIND.VIEWER;
						}else if(this.data[this.t1.sr].kind = this.KIND.VIEWER){
							this.data[this.t1.sr].kind = this.KIND.ADMIN;
						}
						this.t1.updateCell(this.t1.sr, this.t1.sc, this.getKindStr(this.data[this.t1.sr].kind));
                        break;
                }
            }
            this.last_sc = this.t1.sc;
            this.last_sr = this.t1.sr;
            this.btnCntDel();
            this.btnCntAdd();
        } catch (e) {
            alert("pid: cellChanged: " + e.message);
        }
    };
    this.catchEdit = function (d, k) {
        try {
            switch (k) {
                case this.ROW.NAME:
                    this.data[this.t1.sr].name = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].name);
                    break;
                case this.ROW.PASSWORD:
                    this.data[this.t1.sr].password = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].password);
                    break;
                default:
                    console.log("main: catchEdit: bad k");
                    break;
            }
        } catch (e) {
            alert("main: catchEdit: " + e.message);
        }
    };
    this.btnCntDel = function () {
        try {
            if (this.data.length && this.t1.sr >= 0) {
                this.delB.disabled = false;
                return;
            }
            this.delB.disabled = true;
        } catch (e) {
            alert("main: btnCntDel: " + e.message);
        }
    };
    this.btnCntAdd = function () {
        try {
            this.addB.disabled = false;
        } catch (e) {
            alert("main: btnCntAdd: " + e.message);
        }
    };
    this.add = function () {
		this.data.push({name: "", password: "", kind:this.KIND.VIEWER});
		this.t1.appendRow([this.data[this.data.length - 1].name, this.data[this.data.length - 1].password, this.getKindStr(this.data[this.data.length - 1].kind)]);
    };
    this.delete = function () {
		this.del_block = true;
		this.data.splice(this.t1.sr, 1);
		this.t1.deleteSelectedRow();
		this.btnCntDel();
		this.btnCntAdd();
    };
    this.getData = function () {
        var data = [
            {
                action: ["user", "geta"]
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, "json_db");
    };
    this.save = function () {
        var data = [
            {
                action: ['user', 'save'],
                param: this.data
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.SAVE, "json_db");
    };
    this.confirm = function (action, d, n) {
        try {
            switch (action) {
                case this.ACTION.GET:
                    cleara(this.data);
                    var i = 0;
                    for (i = 0; i < d.length; i++) {
                        this.data.push({
                            name: d[i].name,
                            password: d[i].password,
                            kind:d[i].kind
                        });
                    }
                    this.redrawTbl();
                    break;
                case this.ACTION.SAVE:

                    break;
                default:
                    console.log("confirm: unknown action");
                    break;
            }
            cursor_blocker.disable();
        } catch (e) {
            alert("main: confirm: " + e.message);
        }
    };
    this.abort = function (action, m, n) {
        try {
            switch (action) {
                case this.ACTION.GET:
                    logger.err(254);
                    break;
                case this.ACTION.SAVE:
                    logger.err(255);
                    break;
                default:
                    console.log("abort: unknown action");
                    break;
            }
            cursor_blocker.disable();
        } catch (e) {
            alert("main: abort: " + e.message);
        }
    };
    this.redrawTbl = function () {
        try {
            this.last_sc = -1;
            this.last_sr = -1;
            this.t1.clear();
            for (var i = 0; i < this.data.length; i++) {
                this.t1.appendRow([this.data[i].group_id, this.data[i].value]);
            }
            this.btnCntDel();
            this.btnCntAdd();
        } catch (e) {
            alert("main: redrawTbl: " + e.message);
        }
    };
    this.show = function () {
        try {
            clr(this.container, "hdn");
            document.title = this.getName();
            if (this.update) {
                this.getData();
            }
            this.visible = true;
        } catch (e) {
            alert("main: show: " + e.message);
        }
    };
    this.hide = function () {
        try {
            cla(this.container, 'hdn');
            this.visible = false;
        } catch (e) {
            alert("main: hide: " + e.message);
        }
    };
}
var vuser_action = new VUserAction();
visu.push(vuser_action);
