var app = {
	USER_KIND:{
		STR:['admin','actor','viewer'],
		DICT:[308,309,310]
	},
    LIMIT: {
        GET_DATA: 3
    },
    NAME_SIZE: 32,
    init: function () {
        trans.active_lang=1;
    },
    update: function () {
        this.sendU();
    }
};
elem.push(app);
