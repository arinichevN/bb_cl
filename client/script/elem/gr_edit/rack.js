function RackElementEdit(data, slave) {
    this.data.id = data.id;
    this.header_str = header;
    this.slave = slave;
    this.tmr = null;
    this.state=null;
    this.active=false;
    this.updateStr = function () {
;
    };
    this.catchEdit = function (d, k) {
		this.data.id = d;
		this.slave.rackIdChanged(this.data.id);
    };
    this.enable=function(){
		this.active=true;
	};
	this.disable=function(){
		this.active=false;
		window.clearInterval(this.tmr);
	};
 	this.container = cd();
	this.header = cd();
    this.container.draggable = true;
   // s(this.container, "draggable", "true");
    a(this.container, [this.header]);

    cla(this.container, ["cmn_nav_item"]);
	var self = this;
	
	this.container.onclick = function(){
		self.slave.selectRack(self.data);
	};
	this.container.ondragstart = function(evt){
		evt.dataTransfer.setData("text", self.data.id);
	};
	this.container.ondragover = function(evt){
		evt.preventDefault();
	};
	this.container.ondrop = function(evt){
		evt.preventDefault();
	};
	this.container.ondblclick = function(){
		vstring_edit_smp.prep(self.data.name, 16, self, 1, 64);
		showV(vstring_edit_smp);
	};
	this.container.onmousedown = function(){console.log(self.selfCont);
		cla(self.selfCont, ["cmn_cont_click"]);
	};
	this.container.onmouseup = function(){
		console.log(self.selfCont);
		clr(self.selfCont, ["cmn_cont_click"]);
	};
}
