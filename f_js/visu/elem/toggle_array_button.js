function ToggleButtonArray(data, header_str, header_style, elem_disabled_style, elem_enabled_style, elem_cont_style, cont_style, item_style) {//data: [[name, selected],]
    this.data = [];
    this.container = cd();
    this.headerE = cd();
    this.elem_cont = cd();
    this.en_style = elem_enabled_style;
    this.dis_style = elem_disabled_style;
    this.item_style = item_style;
    this.headerE.innerHTML = header_str;
    cla(this.container, cont_style);
    cla(this.elem_cont, elem_cont_style);
    cla(this.headerE, header_style);
    a(this.container, this.headerE);
    a(this.container, this.elem_cont);
    this.toggle = function (ind) {
        //select this
        for (var i = 0; i < this.data.length; i++) {
            if (i === ind) {
                if (this.data[i].selected) {
                    return;
                } else {
                    cla(this.data[i].elem, this.en_style);
                    clr(this.data[i].elem, this.dis_style);
                    this.data[i].selected = true;
                }
                break;
            }
        }
        //deselect others
        for (var i = 0; i < this.data.length; i++) {
            if (i !== ind) {
                clr(this.data[i].elem, this.en_style);
                cla(this.data[i].elem, this.dis_style);
                this.data[i].selected = false;
            }
        }

    };
    this.selectItem = function (ind) {
        if (ind >= 0 && ind < this.data.length) {
            if (!this.data[ind].selected) {
                this.toggle(ind);
            }
        }
    };
    this.getActiveElemInd = function () {
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].selected) {
                return i;
            }
        }
        return null;
    };
    this.disable = function () {
        for (var i = 0; i < this.data.length; i++) {
            this.data[i].selected = false;
            clr(this.data[i].elem, this.en_style);
            cla(this.data[i].elem, this.dis_style);
            this.data[i].elem.disabled = true;
        }
    };
    this.enable = function () {
        for (var i = 0; i < this.data.length; i++) {
            this.data[i].elem.disabled = true;
        }
    };
    this.updateStr = function (header_str, item_str_arr) {
        this.headerE.innerHTML = header_str;
        for (var i = 0; i < item_str_arr.length; i++) {
            this.data[i].elem.innerHTML = item_str_arr[i];
        }
    };
    var self = this;
    for (var i = 0; i < data.length; i++) {
        var elem = cb(data[i][0]);
        elem.ind = i;
        elem.onclick = function () {
            self.toggle(this.ind);
        };
        if (data[i][1]) {
            cla(elem, this.en_style);
            clr(elem, this.dis_style);
        } else {
            clr(elem, this.en_style);
            cla(elem, this.dis_style);
        }
        cla(elem, this.item_style);
        a(this.elem_cont, elem);
        this.data.push({name: data[i][0], selected: data[i][1], elem: elem});
    }

}
