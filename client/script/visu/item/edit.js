function VItemEdit() {
    this.type = VISU_TYPE.TOP;
    this.container = {};
    this.group = [];//[{id, name}]
    this.rack = [];//[{id}]
    this.group_group = [];//[{parent_id, child_id}]
    this.group_rack = [];//[{group_id, rack_name}]
    this.group_elems = [];
    this.rack_elems = [];
    this.data_cont = null;
    this.initialized = false;
    this.selected_elem = null;
    this.t1 = null;
    this.rackIdI = null;
    this.groupNameI = null;
	this.rackInfoE = null;
    this.groupInfoE = null;
    this.addGB = null;
    this.addRB = null;
    this.delB = null;
    this.saveB = null;
    this.getB = null;
    this.bb = null;
    this.update = true;//editor will make it false
    this.last_sr = -1;
    this.last_sc = -1;
    this.del_block = false;//to deal with delete button and table click collision
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
			this.data_cont = cd();
		    this.rackIdI = ci();
		    this.groupNameI = ci();
			this.rackInfoE = cd();
		    this.groupInfoE = cd();
			this.addGB = cb("");
            this.addRB = cb("");
            this.delB = cb("");
            this.saveB = cb("");
            this.getB = cb("");
            this.bb = new BackButton();
            this.addRB.onclick = function () {
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
            var rackcont = cd();
            var groupcont = cd();
            a(rackcont, [this.rackIdI, this.addRB, this.rackInfoE]);
            a(groupcont, [this.groupIdI, this.addRB, this.groupInfoE]);
            var rcont = cd();
            a(rcont, [ this.delB, this.getB, this.saveB, this.bb]);
            a(this.container, [this.data_cont, rackcont, groupcont, rcont]);
            cla([this.t1], ["w70m", "lg1"]);
            cla([rcont], ["w30m", "lg1"]);
            cla([this.addRB, this.delB, this.saveB, this.getB, this.bb], ["h20m", "ug1", "f1"]);
            this.initialized = true;
        } catch (e) {
            console.log(e.message);
        }
    };
    this.getName = function () {
		return trans.get(407);
    };
    this.updateStr = function () {
		this.addRB.innerHTML = trans.get(50);
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
                        vstring_edit_smp.prep(this.data[this.t1.sr].name, 16, self, this.t1.sc, 311);
                        showV(vstring_edit_smp);
                        break;
                    case this.ROW.PASSWORD:
                        var self = this;
                        vstring_edit_smp.prep(this.data[this.t1.sr].password, 16, self, this.t1.sc, 64);
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
    this.getGroupById=function(id){
		for(var i=0;i<this.group.length;i++){
			if(this.group[i].id === id){
				return this.group[i];
			}
		}
		return null;
	};
    this.getRackById=function(id){
		for(var i=0;i<this.rack.length;i++){
			if(this.rack[i].id === id){
				return this.rack[i];
			}
		}
		return null;
	};
    this.getGroupElemById=function(id){
		for(var i=0;i<this.group_elems.length;i++){
			if(this.group_elems[i].data.id === id){
				return this.group_elems[i];
			}
		}
		return null;
	};
    this.getRackElemById=function(id){
		for(var i=0;i<this.rack_elems.length;i++){
			if(this.rack_elems[i].data.id === id){
				return this.rack_elems[i];
			}
		}
		return null;
	};
	this.putGroupInGroup = function(p_id, c_id){
		var p = this.getGroupById(p_id);
		var c = this.getGroupById(c_id);
		if(p!==null && c!==null){
			a(p.itemCont, c.container);
		}else{
			console.log("null found", p,c);
		}
	};
	this.putRackInGroup = function(g_id, r_id){
		var p = this.getGroupById(g_id);
		var c = this.getRackById(r_id);
		if(p!==null && c!==null){
			a(p.itemCont, c.container);
		}else{
			console.log("null found", p,c);
		}
	};
	this.markElem=function(elem){
		cla(elem, [this.selected_style]);
	};
	this.unmarkElem=function(elem){
		clr(elem, [this.selected_style]);
	};
	this.selectGroup = function(id){
		var elem = this.getGroupElemById(id);
		if(elem !== null){
			this.unmarkElem(this.selected_elem);
			this.selected_elem = elem;
			this.markElem(this.selected_elem);
		}
	};
	this.selectRack = function(id){
		var elem = this.getRackElemById(id);
		if(elem !== null){
			this.unmarkElem(this.selected_elem);
			this.selected_elem = elem;
			this.markElem(this.selected_elem);
		}
	};
	this.dropGroup=function(item_id, new_parent_id){
		for(int i = 0;i<this.group_group.length;i++){
			if(this.group_group[i].child_id === item_id && this.group_group[i].parent_id !== new_parent_id){
				this.group_group.splice(i,1);
				this.group_group.push({parent_id:new_parent_id, child_id: item_id});
				this.putGroupInGroup(new_parent_id, item_id);
			}
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
            this.addRB.disabled = false;
        } catch (e) {
            alert("main: btnCntAdd: " + e.message);
        }
    };
    this.add = function () {
		this.data.push({name: "", password: "", kind:this.KIND.VIEWER});
		this.t1.appendRow([this.data[this.data.length - 1].name, this.data[this.data.length - 1].password, this.getKindStr(this.data[this.data.length - 1].kind)]);
		this.btnCntDel();
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
                action: ["elem_edit", "geta"]
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, "json_db");
    };
    this.save = function () {
        var data = [
            {
                action: ['elem_edit', 'save'],
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
        } catch (e) {console.log(e.message);}
    };
    this.redrawTbl = function () {
        clearCont(this.data_cont);
        cleara(this.group_elems);
        cleara(this.rack_elems);
        try {
        for(var i = 0; i<this.group.length;i++){
			var item = new GroupElementEdit(this.group[i], this);
			this.group_elems.push(item);
		}
		} catch (e) {console.log(e.message);}
		try {
        for(var i = 0; i<this.rack.length;i++){
			var item = new RackElementEdit(this.rack[i], this);
			this.rack_elems.push(item);
		}
		} catch (e) {console.log(e.message);}
		
        for(var i = 0; i<this.group_group.length;i++){
			this.putGroupInGroup(this.group_group[i].parent_id, this.group_group[i].child_id);
		}
		
        for(var i = 0; i<this.group_rack.length;i++){
			this.putRackInGroup(this.group_rack[i].group_id, this.group_rack[i].rack_id);
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
var vitem_edit = new VItemEdit();
visu.push(vitem_edit);
