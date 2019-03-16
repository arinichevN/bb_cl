function GroupElement(id, descr, style, delay_send_usec, expanded, cnt_cont, slave) {
	this.id = id;
    this.kind="group";
    this.delay_send_usec=delay_send_usec;
    this.descr = descr;
    this.slave = slave;
    this.goal = 0;
    this.delta = 0;
    this.expanded = expanded;
    this.CATCH={
		SETTINGS:1
	};
	this.ACTION={
		GET_TEMPR:0,
		GET_FLY:1,
		GET_LTM:2,
		GET_FLYTE:3,
		SET_FLYTE:4,
		SET_GOAL:5
	};
    this.data = {
		openCount:  {value: 0, ok: false, elem:null},
		closeCount: {value: 0, ok: false, elem:null},
		tempMin: {value: INT32_MAX, ok: false, elem:null},
	    tempAvr: {value: 0, ok: false, elem:null},
	    tempMax: {value: INT32_MIN, ok: false, elem:null},
	    flyMin: {value: INT32_MAX, ok: false, elem:null},
	    flyAvr: {value: 0, ok: false, elem:null},
	    flyMax: {value: INT32_MIN, ok: false, elem:null},
	    ltmMin: {value: INT32_MAX, ok: false, elem:null},
	    ltmAvr: {value: 0, ok: false, elem:null},
	    ltmMax: {value: INT32_MIN, ok: false, elem:null}
	};
	this.data_err = false;
	this.cnt_visible = false;
	this.no_data_str = "&empty;";
	this.items = [];
    this.descrE = cd();

    
    this.minE = cd();
    this.avrE = cd();
    this.maxE = cd();
    
    this.data.tempMin.elem = cd();
    this.data.tempAvr.elem = cd();
    this.data.tempMax.elem = cd();
    
    this.data.flyMin.elem = cd();
    this.data.flyAvr.elem = cd();
    this.data.flyMax.elem = cd();
    
	this.data.ltmMin.elem = cd();
    this.data.ltmAvr.elem = cd();
    this.data.ltmMax.elem = cd();
    
    this.data.openCount.elem = cb();
    this.data.closeCount.elem = cb();
    this.settingsB = cb();

    
    this.descrE.innerHTML = descr;
    this.tmr = null;
    this.state=null;
    this.active=false;
    this.ACTION =
            {
                GET_INFO: 1
            };
    this.updateStr = function () {
		this.minE.innerHTML = trans.get(305);
		this.avrE.innerHTML = trans.get(306);
		this.maxE.innerHTML = trans.get(307);
		this.settingsB.innerHTML = trans.get(61);
		this.updateStrOB();
		this.updateStrCB();
    };
    this.updateStrOB = function(){
		if(this.data.openCount.value >= 0){
			this.data.openCount.elem.innerHTML = trans.get(62) + " (" + this.data.openCount.value.toString() + ")";
		}else{
			this.data.openCount.elem.innerHTML = trans.get(62) ;
		}
	};
	this.updateStrCB = function(){
		if(this.data.closeCount.value >= 0){
			this.data.closeCount.elem.innerHTML = trans.get(63) + " (" + this.data.closeCount.value.toString() + ")";
		}else{
			this.data.closeCount.elem.innerHTML = trans.get(63) ;
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
	this.resetData = function(){
		this.data.tempMin.value =  this.data.flyMin.value = this.data.ltmMin.value = INT32_MAX;
		this.data.openCount.value  = this.data.closeCount.value = this.data.tempAvr.value =  this.data.flyAvr.value =0;
	    this.data.tempMax.value = this.data.flyMax.value = INT32_MIN;
		this.data.tempMin.ok =  this.data.flyMin.ok =  this.data.openCount.ok  = this.data.closeCount.ok = this.data.tempAvr.ok =  this.data.flyAvr.ok = this.data.ltmAvr.ok = this.data.tempMax.ok =  this.data.ltmMax.ok  = this.data.flyMax.ok = 0;
	};
	this.createTbl = function(data){
		var tbl = c("table");
		var th = c("tr");
		var td = c("td");
		a(th, td);
		for(var i=0;i<data.header.length;i++){
			var himg = c("img");
			s(himg, "src", data.header[i]);
			var td = c("td");
			a(td, himg);
			a(th, td);
			cla(himg, ["cmn_img"]);
		}
		a(tbl, th);
		for(var i=0;i<data.row.length;i++){
			var tr = c("tr");
			for(var j=0;j<data.row[i].length;j++){
				var td = c("td");
				a(td, data.row[i][j]);
				a(tr, td);
			}
			a(tbl, tr);
		}
		cla(tbl, ["cmn_tbl"]);
		return tbl;
	};
	this.sendRequest = function () {
		this.resetData();
		var fly_count =0;
		var temp_count = 0;
		var ltm_count = 0;
	    for(var i=0;i<this.items.length;i++){
			if(this.items[i].kind === "group"){
				if(this.items[i].data.tempMin.ok){
					if(this.data.tempMin.value > this.items[i].data.tempMin.value){
						this.data.tempMin.value = this.items[i].data.tempMin.value;
					}
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.flyMin.ok){
					if(this.data.flyMin.value > this.items[i].data.flyMin.value){
						this.data.flyMin.value = this.items[i].data.flyMin.value;
					}
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.ltmMin.ok){
					if(this.data.ltmMin.value > this.items[i].data.ltmMin.value){
						this.data.ltmMin.value = this.items[i].data.ltmMin.value;
					}
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.tempMax.ok){
					if(this.data.tempMax.value < this.items[i].data.tempMax.value){
						this.data.tempMax.value = this.items[i].data.tempMax.value;
					}
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.flyMax.ok){
					if(this.data.flyMax.value < this.items[i].data.flyMax.value){
						this.data.flyMax.value = this.items[i].data.flyMax.value;
					}
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.ltmMax.ok){
					if(this.data.ltmMax.value < this.items[i].data.ltmMax.value){
						this.data.ltmMax.value = this.items[i].data.ltmMax.value;
					}
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.tempAvr.ok){
					this.data.tempAvr.value += this.items[i].data.tempAvr.value;
					temp_count++;
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.flyAvr.ok){
					this.data.flyAvr.value += this.items[i].data.flyAvr.value;
					fly_count++;
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.ltmAvr.ok){
					this.data.ltmAvr.value += this.items[i].data.ltmAvr.value;
					ltm_count++;
				}else{
					this.data_err = true;
				}
			}
			if(this.items[i].kind === "one"){
				if(this.items[i].data.openCount.ok){
					this.data.openCount +=this.items[i].data.openCount.value;			
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.closeCount.ok){
					this.data.closeCount.value += this.items[i].data.closeCount.value;			
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.temp.ok){
					if(this.data.tempMax.value < this.items[i].data.temp.value){
						this.data.tempMax.value = this.items[i].data.temp.value;
					}
					this.data.tempAvr.value += this.items[i].data.temp.value;
					temp_count++;	
					if(this.data.tempMin.value > this.items[i].data.temp.value){
						this.data.tempMin.value = this.items[i].data.temp.value;
					}
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.fly.ok){
					if(this.data.flyMax.value < this.items[i].data.fly.value){
						this.data.flyMax.value = this.items[i].data.fly.value;
					}
					this.data.flyAvr.value += this.items[i].data.fly.value;
					fly_count++;	
					if(this.data.flyMin.value > this.items[i].data.fly.value){
						this.data.flyMin.value = this.items[i].data.fly.value;
					}
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.ltm.ok){
					if(this.data.ltmMax.value < this.items[i].data.ltm.value){
						this.data.ltmMax.value = this.items[i].data.ltm.value;
					}
					this.data.ltmAvr.value += this.items[i].data.ltm.value;
					ltm_count++;	
					if(this.data.ltmMin.value > this.items[i].data.ltm.value){
						this.data.ltmMin.value = this.items[i].data.ltm.value;
					}
				}else{
					this.data_err = true;
				}
			}
		}
		if(temp_count > 0){
			this.data.tempAvr.value = this.data.tempAvr.value / temp_count;
		}
		if(fly_count > 0){
			this.data.flyAvr.value = this.data.flyAvr.value / fly_count;
		}
		
		if(this.data.tempMax.ok){
			clr( this.data.tempMax.elem , ["cmn_dis"]);
			this.data.tempMax.elem.innerHTML = this.data.tempMax.value.toString();
		}else{
			cla(this.data.tempMax.elem  , ["cmn_dis"]);
			this.data.tempMax.elem.innerHTML = this.no_data_str;
		}
		if(this.data.tempAvr.ok){
			clr( this.data.tempAvr.elem , ["cmn_dis"]);
			this.data.tempAvr.elem.innerHTML = this.data.tempAvr.value.toString();
		}else{
			cla(this.data.tempAvr.elem  , ["cmn_dis"]);
			this.data.tempAvr.elem.innerHTML = this.no_data_str;
		}
		if(this.data.tempMin.ok){
			clr( this.data.tempMin.elem , ["cmn_dis"]);
			this.data.tempMin.elem.innerHTML = this.data.tempMin.value.toString();
		}else{
			cla( this.data.tempMin.elem , ["cmn_dis"]);
			this.data.tempMin.elem.innerHTML = this.no_data_str;
		}
		
		if(this.data.flyMax.ok){
			clr(  this.data.flyMax.elem, ["cmn_dis"]);
			this.data.flyMax.elem.innerHTML = this.data.flyMax.value.toString();
		}else{
			cla(  this.data.flyMax.elem, ["cmn_dis"]);
			this.data.flyMax.elem.innerHTML = this.no_data_str;
		}
		if(this.data.flyAvr.ok){
			clr(  this.data.flyAvr.elem, ["cmn_dis"]);
			this.data.flyAvr.elem.innerHTML = this.data.flyAvr.value.toString();
		}else{
			cla(  this.data.flyAvr.elem, ["cmn_dis"]);
			this.data.flyAvr.elem.innerHTML = this.no_data_str;
		}
		if(this.data.flyMin.ok){
			clr(  this.data.flyMin.elem, ["cmn_dis"]);
			this.data.flyMin.elem.innerHTML = this.data.flyMin.value.toString();
		}else{
			cla(  this.data.flyMin.elem, ["cmn_dis"]);
			this.data.flyMin.elem.innerHTML = this.no_data_str;
		}
		
		if(this.data.ltmMax.ok){
			clr(  this.data.ltmMax.elem, ["cmn_dis"]);
			this.data.ltmMax.elem.innerHTML = this.data.ltmMax.value.toString();
		}else{
			cla(  this.data.ltmMax.elem, ["cmn_dis"]);
			this.data.ltmMax.elem.innerHTML = this.no_data_str;
		}
		if(this.data.ltmAvr.ok){
			clr(  this.data.ltmAvr.elem, ["cmn_dis"]);
			this.data.ltmAvr.elem.innerHTML = this.data.ltmAvr.value.toString();
		}else{
			cla(  this.data.ltmAvr.elem, ["cmn_dis"]);
			this.data.ltmAvr.elem.innerHTML = this.no_data_str;
		}
		if(this.data.ltmMin.ok){
			clr(  this.data.ltmMin.elem, ["cmn_dis"]);
			this.data.ltmMin.elem.innerHTML = this.data.ltmMin.value.toString();
		}else{
			cla(  this.data.ltmMin.elem, ["cmn_dis"]);
			this.data.ltmMin.elem.innerHTML = this.no_data_str;
		}
    };
	this.getTemprData = function(){
		var data = [
            {
                action: ['group', 'get_tempr'],
                param: {address: this.peer.address, port: this.peer.port, item: [this.id]}
            }
        ];
        sendTo(this, data, this.ACTION.GET_TEMPR, 'json_udp_acp');
	};
	this.getFlyData = function(){
		var data = [
            {
                action: ['group', 'get_fly'],
                param: {address: this.peer.address, port: this.peer.port, item: [this.id]}
            }
        ];
        sendTo(this, data, this.ACTION.GET_FLY, 'json_udp_acp');
	};
	this.getBusyTimeData = function(){
		var data = [
            {
                action: ['group', 'get_busy_time'],
                param: {address: this.peer.address, port: this.peer.port, item: [this.id]}
            }
        ];
        sendTo(this, data, this.ACTION.GET_LTM, 'json_udp_acp');
	};
	this.getFlyteData = function(){
		var data = [
            {
                action: ['group', 'get_flyte'],
                param: {address: this.peer.address, port: this.peer.port, item: [this.id]}
            }
        ];
        sendTo(this, data, this.ACTION.GET_FLYTE, 'json_udp_acp');
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
	this.sendOpen = function(){
		for(var i=0;i<this.items.length;i++){
			this.items[i].sendOpen();
		}
	};
	this.sendClose = function(){
		for(var i=0;i<this.items.length;i++){
			this.items[i].sendClose();
		}
	};
	this.sendSettings = function (goal, delta){
		for(var i=0;i<this.items.length;i++){
			this.items[i].sendSettings(this.goal, this.delta);
		}
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
	this.confirm = function (action, d, dt_diff) {
		switch (action) {
			case this.ACTION.GET_FLY:
			case this.ACTION.GET_LTM:
			case this.ACTION.GET_TEMPR:
				var min_elem = null;
				var avr_elem = null;
				var max_elem = null;
				switch(action){
					case this.ACTION.GET_FLY:
						min_elem = this.data.flyMin.elem;
						avr_elem = this.data.flyAvr.elem;
						max_elem = this.data.flyMax.elem;
						break;
					case this.ACTION.GET_LTM:
						min_elem = this.data.ltmMin.elem;
						avr_elem = this.data.ltmAvr.elem;
						max_elem = this.data.ltmMax.elem;
						break;
					case this.ACTION.GET_TEMPR:
						min_elem = this.data.tempMin.elem;
						avr_elem = this.data.tempAvr.elem;
						max_elem = this.data.tempMax.elem;
						break;
				}
				var success = true;
				if (typeof d[0] !== 'undefined') {
					var id=parseInt(d[0].id);
					if(this.data.id === id){
						var min = parseFloat(d[0].min);
						var avr = parseInt(d[0].avr);
						var max = parseInt(d[0].max);
						if(!( isNaN(min) || isNaN(avr) || isNaN(max))){
							min_elem.innerHTML = min.toString();
							avr_elem.innerHTML = avr.toString();
							max_elem.innerHTML = max.toString();
							
						}else{
							console.log("confirm(): bad data", min, avr, max);
							success = false;
						}
					}else{
						console.log("unexpected group id");
						success = false;
					}
					
				}else{
					console.log("no data:", d[0]);
					success = false;
				}
				if(success){
					clr(min_elem, ["cmn_dis"]);
					clr(avr_elem, ["cmn_dis"]);
					clr(max_elem, ["cmn_dis"]);
				}else{
					cla(min_elem, ["cmn_dis"]);
					cla(avr_elem, ["cmn_dis"]);
					cla(max_elem, ["cmn_dis"]);
					min_elem.innerHTML = this.no_data_str;
					avr_elem.innerHTML = this.no_data_str;
					max_elem.innerHTML = this.no_data_str;
				}
				break;
			case this.ACTION.GET_FLYTE:
				var success = true;
				if (typeof d[0] !== 'undefined') {
					var id=parseInt(d[0].id);
					if(this.data.id === id){
						var open = parseFloat(d[0].min);
						var close = parseInt(d[0].avr);
						if(!( isNaN(open) || isNaN(close))){
							this.data.openCount.elem.innerHTML = open.toString();
							this.data.closeCount.elem.innerHTML = close.toString();
						}else{
							console.log("confirm(): bad data", min, avr, max);
							success = false;
						}
					}else{
						console.log("unexpected group id");
						success = false;
					}
					
				}else{
					console.log("no data:", d[0]);
					success = false;
				}
				if(success){
					clr(this.data.openCount.elem, ["cmn_dis"]);
					clr(this.data.closeCount.elem, ["cmn_dis"]);
				}else{
					cla(this.data.openCount.elem, ["cmn_dis"]);
					cla(this.data.closeCount.elem, ["cmn_dis"]);
					this.data.openCount.elem.innerHTML = this.no_data_str;
					this.data.closeCount.elem.innerHTML = this.no_data_str;
				}
				break;
			case this.ACTION.SET_FLYTE:
				break;
			case this.ACTION.SET_GOAL:
				break;
			default:
				console.log("confirm: unknown action: ", action);
				break;
         }
	};
	this.abort = function (action, m, n) {
		switch (action) {
			case this.ACTION.GET_TEMPR:
				cla([this.data.tempMin.elem,this.data.tempAvr.elem,this.data.tempMax.elem], "cmn_old_data");
				break;
			case this.ACTION.GET_FLY:
				cla([this.data.flyMin.elem,this.data.flyAvr.elem,this.data.flyMax.elem], "cmn_old_data");
				break;
			case this.ACTION.GET_LTM:
				cla([this.data.ltmMin.elem,this.data.ltmAvr.elem,this.data.ltmMax.elem], "cmn_old_data");
				break;
			case this.ACTION.SET_FLYTE:
				this.data.openCount = -1;
				this.data.closeCount = -1;
				break;
			case this.ACTION.SET_GOAL:
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
	};
 	this.navCont = cd();
	this.selfCont = cd();
	this.itemCont = cd();
	this.cntCont = cd();
	this.periodB = new ToggleButtonArray([["сутки", true],["неделя", false],["месяц", false]], "период", "header_style", "cmn_dis", "elem_enabled_style", "elem_cont_style", "cont_style", "item_style") ;
	//var vcont = new DivDClick("cmn_selected", 3000, this, this.dclick, this.selfCont);
	var vcont = cd();
	var tbl = this.createTbl(
	{
		header:["client/image/temp.png","client/image/inout.png","client/image/lifetime.png"],
		row:[
			[this.maxE, this.data.tempMax.elem,this.data.flyMax.elem,this.data.ltmMax.elem],
			[this.avrE, this.data.tempAvr.elem,this.data.flyAvr.elem,this.data.ltmAvr.elem],
			[this.minE, this.data.tempMin.elem,this.data.flyMin.elem,this.data.ltmMin.elem],
		]
	}
	);
	a(vcont, [this.periodB, tbl]);
    var bcont = cd();
    a(bcont, [this.data.openCount.elem, this.data.closeCount.elem, this.settingsB]);
    this.expImg = c("img");
    a(this.selfCont, [this.expImg, this.descrE]);
    var cntdescr = cd();
    cntdescr.innerHTML = this.descr;
    a(this.cntCont, [cntdescr, vcont, bcont]);
    a(this.navCont, [this.selfCont, this.itemCont]);
	a(cnt_cont, this.cntCont);
    cla([this.data.openCount.elem, this.data.closeCount.elem, this.settingsB], ["cmn_btn"]);
    cla(cntdescr, ["cmn_cntdescr"]);
    cla(bcont, ["cmn_bcont"]);
    cla(vcont, ["group_vcont"]);
    cla(this.expImg, ["cmn_expimg"]);
    cla(this.descrE, ["cmn_descr"]);
    cla(this.itemCont, ["group_itemcont"]);
    cla(this.cntCont, ["cmn_cnt_item", "hdn"]);
    cla(this.selfCont, ["group_selfcont", "cmn_interactive"]);
    cla(this.navCont, ["cmn_nav_item", style]);
    if(this.expanded){
		this.expand();
	}else{
		this.collapse();
	}
    
	var self = this;
	this.data.openCount.elem.onclick = function(){
		self.sendOpen();
	};
    this.data.closeCount.elem.onclick = function(){
		self.sendClose();
	};
	this.settingsB.onclick = function(){
		vsettings.prep(self.goal, self.delta, self, self.CATCH.SETTINGS);
		showV(vsettings);
	};
	this.selfCont.onclick = function(){
		self.getTemprData();
		self.getFlyData();
		self.getBusyTimeData();
		self.getFlyteData();
		self.slave.showElem(self.cntCont);
	};
	this.expImg.onclick = function(){
		self.colexp();
	};
	this.selfCont.onmousedown = function(){console.log(self.selfCont);
		cla(self.selfCont, ["cmn_cont_click"]);
	};
	this.selfCont.onmouseup = function(){
		console.log(self.selfCont);
		clr(self.selfCont, ["cmn_cont_click"]);console.log("up");
	};
	
}
