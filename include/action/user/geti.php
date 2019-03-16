<?php

namespace history;

class geti {

    public static function getUser() {
        return ['stranger' => '*'];
    }

    public static function execute() {
        $data = [];
        $q = "select id, description from prog order by id asc";
        \db\init(DB_PATH_DATA);
        $data = \db\getDataAll($q);
        \db\suspend();
        return $data;
    }

}
