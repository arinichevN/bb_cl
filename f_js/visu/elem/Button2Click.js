function Button2Click(mark_style, delay, slave, func_ondclick){
	this.container = cb("");	
	this.mark_style=mark_style;
	this.delay=delay;
	this.marked=false;
	this.sclick=false;
	this.func=func_ondclick;
	this.slave=slave;
	this.updateStr = function(str){
		this.container.innerHTML = str;
	};
	this.stopUnmark = function(){
		window.clearTimeout(this.tmrm);
	};


	this.mark = function (){
		this.marked = true;
		cla(this.container, [this.mark_style]);
	};
	this.unmark = function (){
		this.marked = false;
		this.sclick = false;
		clr(this.container, [this.mark_style]);
	};
	var self = this;
	this.delayUnmark = function(){
		var self = this;
		this.tmrm = window.setTimeout(function () {
            self.unmark();
        }, this.delay);
	};
    this.container.onmousedown = function(){
		if(self.marked){
			self.stopUnmark();
			self.sclick = true;
		}else{
			self.mark();
		}
	};
    this.container.onmouseup = function(){
		if(self.sclick){
			self.func(self.slave);
		}
		self.delayUnmark();
	};
}
