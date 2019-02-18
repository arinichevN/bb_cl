function VSettings() {
    this.type = VISU_TYPE.DIAL;
    this.container = null;
    this.header = null;
    this.goalH = null;
    this.goalB = null;
    this.deltaH = null;
    this.deltaB = null;
    this.signB = null;
    this.incB = null;
    this.applyB = null;
    this.canceB = null;
    this.saveB = null;
    this.slave = null;
    this.kind = null;
    this.initialized = false;
    this.current_row = null;
    this.minv = INT32_MIN;
    this.maxv = INT32_MAX;
    this.mode = null;
    this.inc = 1;
    this.sign = 1;
    this.value = {goal: null, delta: null};
    this.MODE = {
        DELTA: 1,
        GOAL: 2
    };
    this.FLOAT_PRES = 2;
    this.init = function () {
        try{
        var self = this;
        this.container = cvis();
        this.header = cd();
        this.goalH = cd();
        this.goalB = cb("");
        this.deltaH = cd();
        this.deltaB = cb("");
        this.signB = cb("");
        this.incB = cb("");
        this.cancelB = new CancelButton(self, 1);
        this.applyB = new ApplyButton(self, 1);
		this.goalB.onmousedown = function () {
            self.mode = self.MODE.GOAL;
            inc.down(self);
        };
        this.deltaB.onmousedown = function () {
            self.mode = self.MODE.DELTA;
            inc.down(self);
        };
        this.updSign();
        this.signB.onclick = function () {
            self.chSign();
        };
        this.incB.innerHTML = this.inc;
        this.incB.onclick = function () {
            self.updInc();
        };
        this.cancelB.onclick = function () {
            self.cancel();
        };
        var c1 = cd();
        var c2 = cd();
        var c3 = cd();
        var c4 = cd();
        var c5 = cd();
        var c6 = cd();
        a(c1, [this.goalH, this.goalB]);
        a(c2, [this.deltaH, this.deltaB]);
        a(c3, [this.signB]);
        a(c4, [this.incB]);
        a(c5, [this.applyB]);
        a(c6, [this.cancelB]);
        a(this.container, [this.header, c1, c2, c3, c4, c5, c6]);
        cla([this.header], "pre_header");
        cla([c1, c2, c3, c4, c5, c6], "pre_cell4");
        cla([this.signB, this.incB, this.applyB, this.cancelB], "pre_icell");
        cla([this.goalB, this.deltaB], "pre_hbtn");
        cla([this.goalH, this.deltaH], "pre_btnH");
        cla([this.signB, this.incB, this.deltaB], "pre_interactive");
        cla([this.goalB, this.deltaB, this.cancelB, this.applyB, this.signB, this.incB], ["pre_btn"]);
        this.initialized = true;
        } catch (e) {
            console.log(e.message);
        }
    };
    this.getName = function () {
        return trans.get(401);
    };
    this.incCB = function () {
        switch (this.mode) {
			case this.MODE.GOAL:
                var r = this.value.goal + this.inc * this.sign;
                if (r >= this.minv && r <= this.maxv) {
                    this.value.goal = this.value.goal + (this.inc * this.sign);
                    this.goalB.innerHTML = this.value.goal.toFixed(this.FLOAT_PRES);
                }
                break;
            case this.MODE.DELTA:
                var r = this.value.delta + this.inc * this.sign;
                if (r >= this.minv && r <= this.maxv) {
                    this.value.delta = this.value.delta + (this.inc * this.sign);
                    this.deltaB.innerHTML = this.value.delta.toFixed(this.FLOAT_PRES);
                }
                break;
        }
    };
    this.chSign = function () {
        this.sign *= -1;
        this.updSign();
    };
    this.updSign = function () {
        if (this.sign > 0) {
            this.signB.innerHTML = "+";
        } else {
            this.signB.innerHTML = "-";
        }
    };
    this.updInc = function () {
        switch (this.inc) {
            case 0.01:
                this.inc = 0.1;
                break;
            case 0.1:
                this.inc = 1;
                break;
            case 1:
                this.inc = 10;
                break;
            case 10:
                this.inc = 100;
                break;
            case 100:
                this.inc = 0.01;
                break;
        }
        this.incB.innerHTML = this.inc;
    };
    this.cancel = function (id) {
        this.slave.catchEdit(this.value, this.kind, 0);
        goBack();
    };
    this.apply = function (id) {
        this.slave.catchEdit(this.value, this.kind, 1);
        goBack();
    };
    this.getHeader = function(){
		return trans.get(302);
	};
    this.updateStr = function () {
		this.header.innerHTML = this.getHeader();
		this.goalH.innerHTML = trans.get(300) + ":";
        this.deltaH.innerHTML = trans.get(301)+ ":";
        this.cancelB.innerHTML = trans.get(5);
        this.applyB.innerHTML = trans.get(2);
    };
    this.prep = function (goal, delta, slave, kind) {
        try {
            this.slave = slave;
            this.kind = kind;
            this.value.goal = goal;
            this.value.delta = delta;
            this.header.innerHTML = this.slave.header + ": " + this.getHeader();
            var v = null;
            this.deltaB.disabled = false;
            if (this.value.delta === null) {
                v = "";
                this.deltaB.disabled = true;
            } else {
                v = this.value.delta.toFixed(this.FLOAT_PRES);
            }
            this.deltaB.innerHTML = v;
            
            this.goalB.disabled = false;
            if (this.value.goal === null) {
                v = "";
                this.goalB.disabled = true;
            } else {
                v = this.value.goal.toFixed(this.FLOAT_PRES);
            }
            this.goalB.innerHTML = v;


            this.slave.update = false;
            this.updateStr();
        } catch (e) {
            console.log(e.message);
        }
    };
    this.show = function () {
        clr(this.container, "hdn");
    };
    this.hide = function () {
        cla(this.container, "hdn");
    };
}
var vsettings = new VSettings();
visu.push(vsettings);
