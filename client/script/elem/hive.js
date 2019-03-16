function HiveElement(descr, style, peer, channel_id, delay_send_usec, cnt_cont, slave) {
    this.peer=peer;
    this.delay_send_usec=delay_send_usec;
    this.channel_id = channel_id;
    this.slave = slave;
	this.kind = "one";
	this.no_data_str = "&empty;";
	this.goal = 0;
	this.delta = 0;
	this.data = {
		openCount:  {value: 0, ok: false, elem:null},
		closeCount: {value: 0, ok: false, elem:null},
		temp: {value: 0, ok: false, elem:null},
	    fly: {value: 0, ok: false, elem:null},
	    ltm: {value: 0, ok: false, elem:null}
	};
	
    this.descr = descr;
    
    this.tmr = null;
    this.state=null;
    this.active=false;
    this.cnt_visible=false;
    this.ACTION = {
		GET_INFO: 1,
		OPEN: 2,
		CLOSE: 3,
		SET_GOAL:4,
		SET_DELTA:5
	};
	this.CATCH={
		SETTINGS:1
	};
    this.updateStr = function () {
		this.data.openCount.elem.innerHTML = trans.get(62);
		this.data.closeCount.elem.innerHTML = trans.get(63);
		this.settingsB.innerHTML = trans.get(61);
    };
    this.blink = function (style) {
        cla(this.navCont, style);
        var self = this;
        var tmr = window.setTimeout(function () {
            self.unmark(style);
        }, 300);
    };
    this.unmark = function (style) {
        clr(this.navCont, style);
    };
    this.dclick=function(me){
		if(me.cnt_visible){
			cla(me.cntCont, "hdn");
			me.cnt_visible = false;
		}else{
			clr(me.cntCont, "hdn");
			me.cnt_visible = true;
		}
		
	};
	this.catchEdit = function (d, kind, apply) {
        try {
            switch (kind) {
                case this.CATCH.SETTINGS:
	                if(apply){
	                   this.goal = d.goal;
	                   this.delta = d.delta;
					   this.sendSettings(this.goal, this.delta);
					}
                    break;
                default:
                    console.log("catchEdit: bad k");
                    break;
            }
        } catch (e) {
            console.log(e.message);
        }
    };
	this.sendRequest = function () {
        var data = [
            {
                action: ['channel', 'get_info'],
                param: {address: this.peer.address, port: this.peer.port, item: [this.channel_id]}
            }
        ];
        sendTo(this, data, this.ACTION.GET_INFO, 'json_udp_acp');
    };
    this.sendOpen = function () {
        var data = [
            {
                action: ['channel', 'open'],
                param: {address: this.peer.address, port: this.peer.port, item: [this.channel_id]}
            }
        ];
        sendTo(this, data, this.ACTION.OPEN, 'json_udp_acp');
    };
	this.sendClose = function () {
        var data = [
            {
                action: ['channel', 'close'],
                param: {address: this.peer.address, port: this.peer.port, item: [this.channel_id]}
            }
        ];
        sendTo(this, data, this.ACTION.CLOSE, 'json_udp_acp');
    };
	this.sendSettings = function (goal, delta){
		var data1 = [
            {
                action: ['channel', 'set_goal'],
                param: {address: this.peer.address, port: this.peer.port, item: [{p0: this.channel_id, p1: goal}]}
            }
        ];
        sendTo(this, data1, this.ACTION.SET_GOAL, 'json_udp_acp');
		var data2 = [
            {
                action: ['channel', 'set_delta'],
                param: {address: this.peer.address, port: this.peer.port, item: [{p0: this.channel_id, p1: delta}]}
            }
        ];
        sendTo(this, data2, this.ACTION.SET_DELTA, 'json_udp_acp');
	};
	this.startSendingRequest = function () {
		var self = this;
		this.tmr = window.setInterval(function () {
			self.sendRequest();
		}, this.delay_send_usec);
    };
    this.enable=function(){
		this.active=true;
		this.startSendingRequest();
	};
	this.disable=function(){
		this.active=false;
		window.clearInterval(this.tmr);
	};
	this.resetData = function(){
		this.data.temp.ok = false;
		this.data.fly.ok = false;
		this.data.ltm.ok = false;
		this.data.closeCount.ok = false;
		this.data.openCount.ok = false;
	};
	this.allDataFailed = function(){
		this.data.temp.elem.innerHTML = this.no_data_str;
		cla(this.data.temp.elem, ["cmn_dis"]);
		this.data.temp.ok = false;
		
		this.data.fly.elem.innerHTML = this.no_data_str;
		cla(this.data.fly.elem, ["cmn_dis"]);
		this.data.fly.ok = false;
		
		this.data.ltm.elem.innerHTML = this.no_data_str;
		cla(this.data.ltm.elem, ["cmn_dis"]);
		this.data.ltm.ok = false;
		
		cla(this.data.closeCount.elem, ["cmn_dis"]);
		cla(this.data.openCount.elem, ["cmn_dis"]);
		this.data.openCount.elem.disabled = true;
		this.data.closeCount.elem.disabled = true;
		this.data.closeCount.ok = false;
		this.data.openCount.ok = false;
		this.goal = 0;
		this.delta = 0;
	};
    this.confirm = function (action, d, dt_diff) {
		switch (action) {
			case this.ACTION.OPEN:
			case this.ACTION.CLOSE:
				cursor_blocker.disable();
				break;
			case this.ACTION.GET_INFO:
				if (typeof d[0] !== 'undefined') {
					var channel_id=parseInt(d[0].id);
					if(this.data.channel_id!==channel_id){
						console.log("bad channel_id");
						return;
					}
					this.resetData();
					var temp = parseFloat(d[0].temp);
					var fly = parseInt(d[0].fly);
					var ltm = parseInt(d[0].ltm);
					var closed = parseInt(d[0].closed);
					var goal = parseFloat(d[0].goal);
					var delta = parseFloat(d[0].delta);
					
					var temp_ok = parseInt(d[0].temp_ok);
					var fly_ok = parseInt(d[0].fly_ok);
					var ltm_ok = parseInt(d[0].ltm_ok);
					var closed_ok = parseInt(d[0].closed_ok);
					var goal_ok = parseInt(d[0].goal_ok);
					var delta_ok = parseInt(d[0].delta_ok);
					
				    if(!( isNaN(temp) || isNaN(fly) || isNaN(closed) || isNaN(goal) || isNaN(delta) || isNaN(temp_ok) || isNaN(fly_ok) || isNaN(ltm_ok) || isNaN(closed_ok) || isNaN(goal_ok) || isNaN(delta_ok))){
						if(temp_ok){
							this.data.temp.elem.innerHTML = temp.toString();
							clr(this.data.temp.elem, ["cmn_dis"]);
						}else{
							this.data.temp.elem.innerHTML = this.no_data_str;
							cla(this.data.temp.elem, ["cmn_dis"]);
						}
						if(fly_ok){
							this.data.fly.elem.innerHTML = fly.toString();
							clr(this.data.fly.elem, ["cmn_dis"]);
						}else{
							this.data.fly.elem.innerHTML = this.no_data_str;
							cla(this.data.fly.elem, ["cmn_dis"]);
						}
						if(ltm_ok){
							this.data.ltm.elem.innerHTML = ltm.toString();
							clr(this.data.ltm.elem, ["cmn_dis"]);
						}else{
							this.data.ltm.elem.innerHTML = this.no_data_str;
							cla(this.data.ltm.elem, ["cmn_dis"]);
						}
						if(closed_ok){
							this.data.closeCount.ok = true;
							this.data.openCount.ok = true;
							if(closed){
								this.data.closeCount = 1;
								this.data.openCount = 0;
								cla(this.data.closeCount.elem, ["cmn_dis"]);
								clr(this.data.openCount.elem, ["cmn_dis"]);
								this.data.openCount.elem.disabled = false;
								this.data.closeCount.elem.disabled = true;
							}else{
								this.data.closeCount = 0;
								this.data.openCount = 1;
								clr(this.data.closeCount.elem, ["cmn_dis"]);
								cla(this.data.openCount.elem, ["cmn_dis"]);
								this.data.openCount.elem.disabled = true;
								this.data.closeCount.elem.disabled = false;
							}
							this.data.temp.elem.innerHTML = temp.toString();
							clr(this.data.temp.elem, ["cmn_dis"]);
						}else{
							cla(this.data.closeCount.elem, ["cmn_dis"]);
							cla(this.data.openCount.elem, ["cmn_dis"]);
							this.data.openCount.elem.disabled = true;
							this.data.closeCount.elem.disabled = true;
						}
						if(goal_ok){
							this.goal = goal;
						}else{
							this.goal = 0;
						}
						if(delta_ok){
							this.delta = delta;
						}else{
							this.delta = 0;
						}
					}else{
						console.log("confirm(): get_next: bad data", mark, value, state);
						this.allDataFailed();
						return;
					}
				}
				cursor_blocker.disable();
				break;
			case this.ACTION.SET_GOAL:
			case this.ACTION.SET_DELTA:
				cursor_blocker.disable();
				break;
			default:
				console.log("confirm: unknown action: ", action);
				break;
         }
	};
	this.abort = function (action, m, n) {
		switch (action) {
			case this.ACTION.GET_INFO:
				this.allDataFailed();
				break;
			case this.ACTION.OPEN:
			case this.ACTION.CLOSE:
			case this.ACTION.SET_GOAL:
			case this.ACTION.SET_DELTA:
				cursor_blocker.disable();
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
	};
    this.descrE = cd();
	this.descrE.innerHTML = descr;
	//this.navCont = new DivDClick("cmn_selected", 3000, this, this.dclick, this.descrE);
	this.navCont = cd();
	this.cntCont = cd();
	this.data.temp.elem = cd();
	this.data.fly.elem = cd();
	this.data.ltm.elem = cd();
	this.data.openCount.elem = cb("");
	this.data.closeCount.elem = cb("");
	this.settingsB = cb("");

    var tempImg = c("img");
    s(tempImg, "src", "client/image/temp.png");
    var flyImg = c("img");
    s(flyImg, "src", "client/image/inout.png");
    var ltmImg = c("img");
    s(ltmImg, "src", "client/image/lifetime.png");
    var tbl = c("table");
    var tr1 = c("tr");
    var td11 = c("td");
    var td12 = c("td");
    var td13 = c("td");
    a(td11, [tempImg]);
    a(td12, [flyImg]);
    a(td13, [ltmImg]);
    a(tr1, [td11, td12, td13, td13]);
    
    var tr2 = c("tr");
    var td21 = c("td");
    var td22 = c("td");
    var td23 = c("td");
    a(td21, [this.data.temp.elem]);
    a(td22, [this.data.fly.elem]);
    a(td23, [this.data.ltm.elem]);
    a(tr2, [td21, td22, td23]);
    a(tbl, [tr1, tr2]);
	var vcont = cd();
	a(vcont, [tbl]);
	var bcont = cd();
	a(bcont, [this.data.openCount.elem, this.data.closeCount.elem, this.settingsB]);
	var cntdescr = cd();
    cntdescr.innerHTML = this.descr;
	a(this.cntCont, [cntdescr, vcont, bcont]);
	a(this.navCont, [this.descrE]);
	a(cnt_cont, this.cntCont);
	cla(cntdescr, ["cmn_cntdescr"]);
	cla(tbl, ["cmn_tbl"]);
	cla([this.data.openCount.elem, this.data.closeCount.elem, this.settingsB], ["cmn_btn"]);
	cla([this.data.temp.elem,this.data.fly.elem,this.data.ltm.elem ],["hive_val"]);
	cla([ tempImg, flyImg, ltmImg],["cmn_img"]);
	cla([this.data.openCount.elem, this.data.closeCount.elem], ["hive_ocb"]);
	cla(vcont, ["hive_vcont"]);
	cla(bcont, ["cmn_bcont"]);
	cla(this.descrE, ["cmn_descr"]);
	cla(this.cntCont, ["cmn_cnt_item", "hdn"]);
    cla(this.navCont, ["cmn_nav_item", "cmn_cont","cmn_interactive", style]);
	this.data.openCount.elem.disabled = true;
	this.data.closeCount.elem.disabled = true;
	var self = this;
	this.data.openCount.elem.onclick = function(){
		cursor_blocker.enable();
		self.sendOpen();
	};
	this.data.closeCount.elem.onclick = function(){
		cursor_blocker.enable();
		self.sendClose();
	};
	this.settingsB.onclick = function(){
		vsettings.prep(self.goal, self.delta, self, self.CATCH.SETTINGS);
		showV(vsettings);
	};
	this.navCont.onmousedown = function(){
		cla(self.navCont, ["cmn_cont_click"]);console.log("down");
	};
	this.navCont.onmouseup = function(){
		clr(self.navCont, ["cmn_cont_click"]);console.log("up");
	};
	this.navCont.onclick = function(){
		self.slave.showElem(self.cntCont);
	};
}
