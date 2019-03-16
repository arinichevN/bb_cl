function InputText(){
	this.container = c('input');
    s(this.container, 'type', 'text');
	this.getValue = function(){
		return this.container.value;
	};
	this.updateStr=function(t, p){
		//s(this.container, 'title', t);
	  //  s(this.container, 'placeholder', p);
	    this.container.title = t;
	    this.container.placeholder = p;
	};
	this.updateStr(t, p);
}
