function GroupElementEdit(data, slave) {
    this.kind=kind;
    this.data.id = data.id;
    this.data.name = data.name;
    this.header_str = header;
    this.slave = slave;
	this.cnt_visible = false;
	this.items = [];

    this.tmr = null;
    this.state=null;
    this.active=false;
    this.updateStr = function () {
;
    };
    this.catchEdit = function (d, k) {
		this.data.name = d;
		this.slave.groupNameChanged(this.data.id, this.data.name);
    };
    this.enable=function(){
		this.active=true;
	};
	this.disable=function(){
		this.active=false;
		window.clearInterval(this.tmr);
	};
	this.expand = function(){
		s(this.expImg,  "src", "client/image/zoom_out.svg");
		clr(this.itemCont, "hdn");
	};
	this.collapse = function(){
		s(this.expImg,  "src", "client/image/zoom_in.svg");
		cla(this.itemCont, "hdn");
	};
	this.colexp = function(){
		if(clc(this.itemCont, "hdn")){
			this.expand();
		}else{
			this.collapse();
		}
	};
 	this.container = cd();
	this.selfCont = cd();
	this.itemCont = cd();
    this.descrE = cd();
    this.selfCont.draggable = true;
   // s(this.selfCont, "draggable", "true");
    this.descrE.innerHTML = this.data.name;
	//var vcont = new DivDClick("cmn_selected", 3000, this, this.dclick, this.selfCont);
    this.expImg = c("img");
    a(this.selfCont, [this.expImg, this.descrE]);
    a(this.container, [this.selfCont, this.itemCont]);
    cla(this.expImg, ["cmn_expimg"]);
    cla(this.descrE, ["cmn_descr"]);
    cla(this.itemCont, ["groupe_itemcont"]);
    cla(this.selfCont, ["groupe_selfcont", "cmn_interactive"]);
    cla(this.container, ["cmn_nav_item"]);
    this.collapse();
	var self = this;
	this.container.onclick = function(){
		self.slave.selectGroup(self.data);
	};
	this.selfCont.ondragstart = function(evt){
		evt.dataTransfer.setData("text", self.data.id);
	};
	this.selfCont.ondragover = function(evt){
		evt.preventDefault();
	};
	this.selfCont.ondrop = function(evt){
		evt.preventDefault();
		var child_id = evt.dataTransfer.getData("text");
		self.slave.hChanged(self.data.id, child_id);
	};
	this.selfCont.ondblclick = function(){
		vstring_edit_smp.prep(self.data.name, 16, self, 1, 64);
		showV(vstring_edit_smp);
	};
	this.expImg.onclick = function(){
		self.colexp();
	};
	this.selfCont.onmousedown = function(){console.log(self.selfCont);
		cla(self.selfCont, ["cmn_cont_click"]);
	};
	this.selfCont.onmouseup = function(){
		console.log(self.selfCont);
		clr(self.selfCont, ["cmn_cont_click"]);
	};
}
