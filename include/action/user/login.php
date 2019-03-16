<?php

$af = function($p) {
	$data=['name' => null, 'role' => null];
	if(isset($_un) && isset($_ur){
	    if (isset($p['name']) && \session\is_n($p['name']) && isset($p['pswd']) && \session\is_p($p['pswd']) ) {
	        \session\check_new_user($_POST['un'], $_POST['up'], $_stmo);
	    }
		$data['name'] = $_un;
		$data['role'] = $_ur;
	}
	return $data;
};
