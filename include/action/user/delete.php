<?php

$af = function($p) {
	$data = [];
	\db\init(DB_PATH);
	foreach ($p as $value) {
		$q = "delete from public.user where name='{$value['name']}'";
		\db\command($q);
	}
	\db\suspend();
	return $data;
};
