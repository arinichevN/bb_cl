function Translater() {
    this.dict = [];
    this.active_lang = null;
    this.init = function () {
;
    };
    this.addDict = function (v) {
        for (var i = 0; i < v.length; i++) {
            this.dict.push(v[i]);
        }
    };
    this.get = function (id) {
		try{
	        for (var i = 0; i < this.dict.length; i++) {
	            if (this.dict[i].id === id) {
	                return this.dict[i].str[this.active_lang];
	            }
	        }
	        return "";
		}catch(e){
			console.log(e.message);
		}
    };
}
var trans = new Translater();
elem.push(trans);

