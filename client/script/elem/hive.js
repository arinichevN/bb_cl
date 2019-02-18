function HiveElement(descr, peer, channel_id, delay_send_usec) {
    
    this.peer=peer;
    this.delay_send_usec=delay_send_usec;
    this.channel_id = channel_id;
	this.kind = "one";
	this.no_data_str = "&empty;";
	this.goal = 0;
	this.delta = 0;
	this.data = {
		openCount:  {value: 0, ok: false, elem:null},
		closeCount: {value: 0, ok: false, elem:null},
		temp: {value: 0, ok: false, elem:null},
	    hum: {value: 0, ok: false, elem:null},
	    fly: {value: 0, ok: false, elem:null}
	};
	
    this.descr = descr;
    
    this.tmr = null;
    this.state=null;
    this.active=false;
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
        cla(this.container, style);
        var self = this;
        var tmr = window.setTimeout(function () {
            self.unmark(style);
        }, 300);
    };
    this.unmark = function (style) {
        clr(this.container, style);
    };
    this.dclick=function(me){
		
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
		this.data.hum.ok = false;
		this.data.fly.ok = false;
		this.data.closeCount.ok = false;
		this.data.openCount.ok = false;
	};
	this.allDataFailed = function(){
		this.data.temp.elem.innerHTML = this.no_data_str;
		cla(this.data.temp.elem, ["cmn_dis"]);
		this.data.temp.ok = false;
		
		this.data.hum.elem.innerHTML = this.no_data_str;
		cla(this.data.hum.elem, ["cmn_dis"]);
		this.data.hum.ok = false;
		
		this.data.fly.elem.innerHTML = this.no_data_str;
		cla(this.data.fly.elem, ["cmn_dis"]);
		this.data.fly.ok = false;
		
		cla(this.data.closeCount.elem, ["cmn_dis"]);
		cla(this.data.openCount.elem, ["cmn_dis"]);
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
					var hum = parseFloat(d[0].hum);
					var fly = parseInt(d[0].fly);
					var closed = parseInt(d[0].closed);
					var goal = parseFloat(d[0].goal);
					var delta = parseFloat(d[0].delta);
					
					var temp_ok = parseInt(d[0].temp_ok);
					var hum_ok = parseInt(d[0].hum_ok);
					var fly_ok = parseInt(d[0].fly_ok);
					var closed_ok = parseInt(d[0].closed_ok);
					var goal_ok = parseInt(d[0].goal_ok);
					var delta_ok = parseInt(d[0].delta_ok);
					
				    if(!( isNaN(temp) || isNaN(hum) || isNaN(fly) || isNaN(closed) || isNaN(goal) || isNaN(delta) || isNaN(temp_ok) || isNaN(hum_ok) || isNaN(fly_ok) || isNaN(closed_ok) || isNaN(goal_ok) || isNaN(delta_ok))){
						if(temp_ok){
							this.data.temp.elem.innerHTML = temp.toString();
							clr(this.data.temp.elem, ["cmn_dis"]);
						}else{
							this.data.temp.elem.innerHTML = this.no_data_str;
							cla(this.data.temp.elem, ["cmn_dis"]);
						}
						if(hum_ok){
							this.data.hum.elem.innerHTML = hum.toString();
							clr(this.data.hum.elem, ["cmn_dis"]);
						}else{
							this.data.hum.elem.innerHTML = this.no_data_str;
							cla(this.data.hum.elem, ["cmn_dis"]);
						}
						if(fly_ok){
							this.data.fly.elem.innerHTML = fly.toString();
							clr(this.data.fly.elem, ["cmn_dis"]);
						}else{
							this.data.fly.elem.innerHTML = this.no_data_str;
							cla(this.data.fly.elem, ["cmn_dis"]);
						}
						if(closed_ok){
							this.data.closeCount.ok = true;
							this.data.openCount.ok = true;
							if(closed){
								this.data.closeCount = 1;
								this.data.openCount = 0;
								cla(this.data.closeCount.elem, ["cmn_dis"]);
								clr(this.data.openCount.elem, ["cmn_dis"]);
							}else{
								this.data.closeCount = 0;
								this.data.openCount = 1;
								clr(this.data.closeCount.elem, ["cmn_dis"]);
								cla(this.data.openCount.elem, ["cmn_dis"]);
							}
							this.data.temp.elem.innerHTML = temp.toString();
							clr(this.data.temp.elem, ["cmn_dis"]);
						}else{
							cla(this.data.closeCount.elem, ["cmn_dis"]);
							cla(this.data.openCount.elem, ["cmn_dis"]);
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
	this.container = cd();
	this.data.temp.elem = cd();
	this.data.hum.elem = cd();
	this.data.fly.elem = cd();
	this.data.openCount.elem = cb("");
	this.data.closeCount.elem = cb("");
	this.settingsB = cb("");
	this.descrE = cd();
	this.descrE.innerHTML = descr;
    var humImg = c("img");
    s(humImg, "src", "client/image/hum.png");
    var tempImg = c("img");
    s(tempImg, "src", "client/image/temp.png");
    var flyImg = c("img");
    s(flyImg, "src", "client/image/inout.png");
    var tbl = c("table");
    var tr1 = c("tr");
    var td11 = c("td");
    var td12 = c("td");
    var td13 = c("td");
    a(td11, [tempImg]);
    a(td12, [humImg]);
    a(td13, [flyImg]);
    a(tr1, [td11, td12, td13]);
    
    var tr2 = c("tr");
    var td21 = c("td");
    var td22 = c("td");
    var td23 = c("td");
    a(td21, [this.data.temp.elem]);
    a(td22, [this.data.hum.elem]);
    a(td23, [this.data.fly.elem]);
    a(tr2, [td21, td22, td23]);
    a(tbl, [tr1, tr2]);
	var vcont = cd();
	a(vcont, [tbl]);
	var bcont = cd();
	a(bcont, [this.data.openCount.elem, this.data.closeCount.elem, this.settingsB]);
	var vi = cd();
	a(vi, [vcont, bcont]);
	a(this.container, [this.descrE, vi]);
	cla(tbl, ["cmn_tbl"]);
	cla([this.data.openCount.elem, this.data.closeCount.elem, this.settingsB], ["cmn_btn"]);
	cla([this.data.temp.elem,this.data.hum.elem,this.data.fly.elem ],["hive_val"]);
	cla([humImg, tempImg, flyImg],["cmn_img"]);
	cla([this.data.openCount.elem, this.data.closeCount.elem], ["hive_ocb"]);
	cla(vcont, ["hive_vcont"]);
	cla(bcont, ["cmn_bcont"]);
	cla(this.descrE, ["cmn_descr"]);
	cla(vi, ["hive_vi"]);
    cla(this.container, ["cmn_cont"]);
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
}
