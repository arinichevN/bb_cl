<?php
$valid_user = [
	'role' => ['admin']
];
$af = function($p) {
	$data = [
		'group'=>[],
		'rack'=>[],
		'group_group'=>[],
		'group_rack'=>[]
	];
	\db\init(DB_PATH_LOG);
	$q = "select id, name from bb.group order by id asc";
	$r = \db\getData($q);
	while ($row = \db\fetch_assoc($r)) {
		\array_push($data["group"], $row);
	}
	\db\free_result($r);
	$q = "select id from bb.rack order by id asc";
	$r = \db\getData($q);
	while ($row = \db\fetch_assoc($r)) {
		\array_push($data["rack"], $row);
	}
	\db\free_result($r);
	$q = "select parent_id, child_id from bb.group_group order by parent_id asc";
	$r = \db\getData($q);
	while ($row = \db\fetch_assoc($r)) {
		\array_push($data["group_group"], $row);
	}
	\db\free_result($r);
	$q = "select group_id, rack_id from bb.group_rack order by id asc";
	$r = \db\getData($q);
	while ($row = \db\fetch_assoc($r)) {
		\array_push($data["group_rack"], $row);
	}
	\db\free_result($r);
	\db\suspend();
	return $data;
};
