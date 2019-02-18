function GroupElement(descr, delay_send_usec) {
    
    this.kind="group";
    this.delay_send_usec=delay_send_usec;
    this.descr = descr;
    this.goal = 0;
    this.delta = 0;
    this.CATCH={
		SETTINGS:1
	};
    this.data = {
		openCount:  {value: 0, ok: false, elem:null},
		closeCount: {value: 0, ok: false, elem:null},
		tempMin: {value: INT32_MAX, ok: false, elem:null},
	    tempAvr: {value: 0, ok: false, elem:null},
	    tempMax: {value: INT32_MIN, ok: false, elem:null},
	    humMin: {value: INT32_MAX, ok: false, elem:null},
	    humAvr: {value: 0, ok: false, elem:null},
	    humMax: {value: INT32_MIN, ok: false, elem:null},
	    flyMin: {value: INT32_MAX, ok: false, elem:null},
	    flyAvr: {value: 0, ok: false, elem:null},
	    flyMax: {value: INT32_MIN, ok: false, elem:null},
	};
	this.data_err = false;
	this.expanded = false;
	this.no_data_str = "&empty;";
	this.items = [];
    this.descrE = cd();

    
    this.minE = cd();
    this.avrE = cd();
    this.maxE = cd();
    
    this.data.tempMin.elem = cd();
    this.data.tempAvr.elem = cd();
    this.data.tempMax.elem = cd();
    
    this.data.humMin.elem = cd();
    this.data.humAvr.elem = cd();
    this.data.humMax.elem = cd();
    
    this.data.flyMin.elem = cd();
    this.data.flyAvr.elem = cd();
    this.data.flyMax.elem = cd();
    
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
		if(me.expanded){
			cla(me.itemCont, "hdn");
			me.expanded = false;
		}else{
			clr(me.itemCont, "hdn");
			me.expanded = true;
		}
		
	};
	this.resetData = function(){
		this.data.tempMin.value =  this.data.humMin.value =  this.data.flyMin.value =INT32_MAX;
		this.data.openCount.value  = this.data.closeCount.value = this.data.tempAvr.value = this.data.humAvr.value =   this.data.flyAvr.value =0;
	    this.data.tempMax.value =  this.data.humMax.value  = this.data.flyMax.value = INT32_MIN;
		this.data.tempMin.ok =  this.data.humMin.ok =  this.data.flyMin.ok =  this.data.openCount.ok  = this.data.closeCount.ok = this.data.tempAvr.ok = this.data.humAvr.ok =   this.data.flyAvr.ok =  this.data.tempMax.ok =  this.data.humMax.ok  = this.data.flyMax.ok = 0;
	};
	this.sendRequest = function () {
		this.resetData();
		var fly_count =0;
		var temp_count = 0;
		var hum_count = 0;
	    for(var i=0;i<this.items.length;i++){
			if(this.items[i].kind === "group"){
				if(this.items[i].data.tempMin.ok){
					if(this.data.tempMin.value > this.items[i].data.tempMin.value){
						this.data.tempMin.value = this.items[i].data.tempMin.value;
					}
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.humMin.ok){
					if(this.data.humMin.value > this.items[i].data.humMin.value){
						this.data.humMin.value = this.items[i].data.humMin.value;
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
				if(this.items[i].data.tempMax.ok){
					if(this.data.tempMax.value < this.items[i].data.tempMax.value){
						this.data.tempMax.value = this.items[i].data.tempMax.value;
					}
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.humMax.ok){
					if(this.data.humMax.value < this.items[i].data.humMax.value){
						this.data.humMax.value = this.items[i].data.humMax.value;
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
				if(this.items[i].data.tempAvr.ok){
					this.data.tempAvr.value += this.items[i].data.tempAvr.value;
					temp_count++;
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.humAvr.ok){
					this.data.humAvr.value += this.items[i].data.humAvr.value;
					hum_count++;
				}else{
					this.data_err = true;
				}
				if(this.items[i].data.flyAvr.ok){
					this.data.flyAvr.value += this.items[i].data.flyAvr.value;
					fly_count++;
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
				if(this.items[i].data.hum.ok){
					if(this.data.humMax.value < this.items[i].data.hum.value){
						this.data.humMax.value = this.items[i].data.hum.value;
					}
					this.data.humAvr.value += this.items[i].data.hum.value;
					hum_count++;	
					if(this.data.humMin.value > this.items[i].data.hum.value){
						this.data.humMin.value = this.items[i].data.hum.value;
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
			}
		}
		if(temp_count > 0){
			this.data.tempAvr.value = this.data.tempAvr.value / temp_count;
		}
		if(hum_count > 0){
			this.data.humAvr.value = this.data.humAvr.value / hum_count;
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
		
		if(this.data.humMax.ok){
			clr(  this.data.humMax.elem, ["cmn_dis"]);
			this.data.humMax.elem.innerHTML = this.data.humMax.value.toString();
		}else{
			cla(  this.data.humMax.elem, ["cmn_dis"]);
			this.data.humMax.elem.innerHTML = this.no_data_str;
		}
		if(this.data.humAvr.ok){
			clr( this.data.humAvr.elem , ["cmn_dis"]);
			this.data.humAvr.elem.innerHTML = this.data.humAvr.value.toString();
		}else{
			cla(  this.data.humAvr.elem, ["cmn_dis"]);
			this.data.humAvr.elem.innerHTML = this.no_data_str;
		}
		if(this.data.humMin.ok){
			clr(  this.data.humMin.elem, ["cmn_dis"]);
			this.data.humMin.elem.innerHTML = this.data.humMin.value.toString();
		}else{
			cla(  this.data.humMin.elem, ["cmn_dis"]);
			this.data.humMin.elem.innerHTML = this.no_data_str;
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
 	this.container = cd();
	this.selfCont = cd();
	this.itemCont = cd();
	var vcont = new DivDClick("cmn_selected", 3000, this, this.dclick, this.selfCont);
	var humImg = c("img");
    s(humImg, "src", "client/image/hum.png");
    var tempImg = c("img");
    s(tempImg, "src", "client/image/temp.png");
    var flyImg = c("img");
    s(flyImg, "src", "client/image/inout.png");
    
	var tbl =c("table");
	
	var tr1 = c("tr");
	var td11 = c("td");
	var td12 = c("td");a(td12, tempImg);
	var td13 = c("td");a(td13, humImg);
	var td14 = c("td");a(td14, flyImg);
	a(tr1, [td11,td12,td13,td14]);
	
	var tr2 = c("tr");
	var td21 = c("td");
	var td22 = c("td");
	var td23 = c("td");
	var td24 = c("td");
	a(td21, this.maxE);
	a(td22, this.data.tempMax.elem);
	a(td23, this.data.humMax.elem);
	a(td24, this.data.flyMax.elem);
	a(tr2, [td21,td22,td23,td24]);
	
	var tr3 = c("tr");
	var td31 = c("td");
	var td32 = c("td");
	var td33 = c("td");
	var td34 = c("td");
	a(td31, this.avrE);
	a(td32, this.data.tempAvr.elem);
	a(td33, this.data.humAvr.elem);
	a(td34, this.data.flyAvr.elem);
	a(tr3, [td31,td32,td33,td34]);
	
	var tr4 = c("tr");
	var td41 = c("td");
	var td42 = c("td");
	var td43 = c("td");
	var td44 = c("td");
	a(td41, this.minE);
	a(td42, this.data.tempMin.elem);
	a(td43, this.data.humMin.elem);
	a(td44, this.data.flyMin.elem);
	a(tr4, [td41,td42,td43,td44]);
	a(tbl, [tr1, tr2, tr3, tr4]);
	
	a(vcont, [tbl]);
    var bcont = cd();
    a(bcont, [this.data.openCount.elem, this.data.closeCount.elem, this.settingsB]);
    a(this.selfCont, [this.descrE, vcont, bcont]);
    a(this.container, [this.selfCont, this.itemCont]);
   
   cla(tbl, ["cmn_tbl"]);
    cla([this.data.openCount.elem, this.data.closeCount.elem, this.settingsB], ["cmn_btn"]);
    cla([tempImg, humImg, flyImg], ["cmn_img"]);
    cla(bcont, ["cmn_bcont"]);
    cla(vcont, ["group_vcont"]);
    cla(this.descrE, ["cmn_descr"]);
    cla(this.itemCont, ["group_itemcont", "hdn"]);
    cla(this.selfCont, ["group_selfcont", "cmn_interactive"]);
    cla(this.container, ["cmn_cont"]);
    
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

}
