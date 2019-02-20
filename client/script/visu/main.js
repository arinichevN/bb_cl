function VMain() {
    this.type = VISU_TYPE.MAIN;
    this.container = null;
    this.navCont = null;
    this.cntCont = null;
    this.activeCnt = null;
    this.KIND={GROUP: 1, ONE: 2};
	this.peer = [
        {id: 'bb_1', address: '127.0.0.1', port: 49192, timeout: 3},
        //{id: 'lgr_2', address: '127.0.0.1', port: 49172, timeout: 3, name: "регистратор 2"},
        //{id: 'lgr_3', address: '127.0.0.1', port: 49179, timeout: 3, name: "регистратор 3"}
	];
    this.data = {
        name: "АО Зеленые овощи",
		kind: this.KIND.GROUP, 
		elem: null,
		style: "cmn_nav_firm",
	    items:[
		        {
					name: "теплица 1",
					kind: this.KIND.GROUP, 
					elem: null,
					style: "cmn_nav_block",
					items: [
						{
							name: "стойка 1",
							kind: this.KIND.GROUP, 
							elem: null,
							style: "cmn_nav_rack",
							items: [
								{name:"улей 1", kind:this.KIND.ONE, elem:null, style: "cmn_nav_hive", peer_id:"bb_1", channel_id:1},
								{name:"улей 2", kind:this.KIND.ONE, elem:null, style: "cmn_nav_hive", peer_id:"bb_1", channel_id:2},
								{name:"улей 3", kind:this.KIND.ONE, elem:null, style: "cmn_nav_hive", peer_id:"bb_1", channel_id:3},
							]
						}
					]
				}
		]
    };
    


    this.tmrs = null;
    this.delay_sleep = 300000;
    this.delay_item = 3000;
    this.sleep = false;
    this.CATCH = {
        REGB: 1,
        EDIT: 2,
        PAGE_BLOCKER: 3
    };
    this.initialized = false;
    this.update = true; //editor will make it false
    this.visible = false;
	this.init = function () {
        try {
            this.container = cvis();
            this.navCont=cd();
            this.cntCont=cd();
            cla(this.navCont, "cmn_nav");
            cla(this.cntCont, "cmn_cnt");
            a(this.container, [this.navCont, this.cntCont]);
            this.makeData();
            this.initialized = true;
            var self = this;
            this.container.onmousemove = function () {
                //self.wakeUp();
            };
          //  page_blocker.prep(1, 1, this, this.CATCH.PAGE_BLOCKER);
            this.redraw();
        } catch (e) {
            console.log(e.message);
        }
    };
	this.getPeerById = function (id) {
		for (var i = 0; i < this.peer.length; i++) {
			if (this.peer[i].id === id) {
				return this.peer[i];
			}
		}
		return null;
    };
    this.setPeer = function(data){
		try{
		if(data.kind === this.KIND.ONE){
			data.peer = this.getPeerById(data.peer_id);
		} else if(data.kind === this.KIND.GROUP){
			for (var i = 0; i < data.items.length; i++) {
				this.setPeer(data.items[i]);
			}
		}
	}catch (e){
		console.log(e);
	}
	};
	this.makeData = function () {
        this.setPeer(this.data);
    };
    this.getName = function () {
        return trans.get(400);
    };
	this.updateStrData = function(data){
		if(data.elem !== null){
			data.elem.updateStr();
		}
		if(data.kind === this.KIND.GROUP){
			for (var i = 0; i < data.items.length; i++) {
				this.updateStrData(data.items[i]);
			}
		}
	};
    this.updateStr = function () {
		document.title = this.getName();
		this.updateStrData(this.data);
    };
    this.catchEdit = function (d, kind, apply) {
        try {
            switch (kind) {
                case this.CATCH.PAGE_BLOCKER:
                    this.wakeUp();
                    break;
                default:
                    console.log("catchEdit: bad k");
                    break;
            }
        } catch (e) {
            console.log(e.message);
        }
    };
    this.wakeUp = function () {
        //this.delaySleep();
        if (this.sleep) {
            this.sleep = false;
			this.enableElements();
        }
    };
    this.delaySleep = function () {
        try {
            if (this.visible) {
                window.clearTimeout(this.tmrs);
                var self = this;
                this.tmrs = window.setTimeout(function () {
                    self.sleep = true;
                    page_blocker.enable();
                }, this.delay_sleep);
            }
        } catch (e) {
            console.log(e.message);
        }
    };
    this.addElem = function(parent_elem, parent, data, cnt_cont){
		try{
		data.elem = null;
		switch (data.kind){
			case  this.KIND.ONE:
				data.elem = new HiveElement(data.name, data.style, data.peer, data.channel_id, this.delay_item, cnt_cont, this);
				data.elem.enable();
				if(parent_elem !== null){
					parent_elem.items.push(data.elem);
				}
				a(parent, [data.elem.navCont]);
				break;
			case this.KIND.GROUP:
				data.elem = new GroupElement(data.name, data.style, this.delay_item, cnt_cont, this);
				data.elem.enable();
				if(parent_elem !== null){
					parent_elem.items.push(data.elem);
				}
				a(parent, [data.elem.navCont]);
				for (var i = 0; i < data.items.length; i++) {
					this.addElem(data.elem, data.elem.itemCont, data.items[i], cnt_cont);
				}
				break;
		}
	}catch (e){
		console.log(e);
	}
	};
	this.dataClear = function(data){
		if(data.kind === this.KIND.GROUP){
			for (var i = 0; i < data.items.length; i++) {
				this.dataClear(data.items[i]);
			}
			if(data.elem !== null){
				clearCont(data.elem.itemCont);
			}
		}
	};
	this.showElem=function(elem){
		if(this.activeCnt !== null){
			cla(this.activeCnt, "hdn");
		}
		clr(elem, "hdn");
		this.activeCnt = elem;
	};
    this.redraw = function(){
        try {
			this.dataClear(this.data);
			clearCont(this.cntCont);
            this.addElem(null, this.navCont, this.data, this.cntCont);
        } catch (e) {
            console.log(e.message);
        }	
	};
    this.show = function () {
        try {
            document.title = this.getName();
            clr(this.container, "hdn");
            this.visible = true;
           // this.delaySleep();
        } catch (e) {
            console.log(e.message);
        }
    };
    this.hide = function () {
        try {
            cla(this.container, "hdn");
            window.clearTimeout(this.tmrs);
            this.visible = false;
        } catch (e) {
           console.log(e.message);
        }
    };
}
var vmain = new VMain();
visu.push(vmain);
