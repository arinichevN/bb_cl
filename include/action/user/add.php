<?php

$af = function($p) {
	$data = [];
	\db\init(DB_PATH);
	foreach ($p as $v) {
		$q = "insert into public.user(name, password, kind) values ('{$v['name']}', '{$v['pswd']}', '{$v['role']}')";
		\db\singleRowQ($q);
	}
	\db\suspend();
	return $data;
};
