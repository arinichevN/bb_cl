function SelectButton(items, sz){
	this.container = c("select");	
	s(o, "size", sz);
	this.items = [];
	this.names = [];
	for(var i=0;i<items.length;i++){
		var o = c("option");
		if(i===0){
			o.selected = true;	
		}
		o.innerHTML=trans.get(items[i]);
		a(this.container, o);
		this.items.push(o);
		this.names.push(items[i]);
	}
	this.getSelectedIndex = function(){
		return this.container.selectedIndex;
	};
	this.updateStr=function(){
		for(var i=0;i<this.items.length;i++){
			this.items[i].innerHTML = trans.get(this.names[i]);
		}
	};
}
