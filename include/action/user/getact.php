<?php

namespace history;

class geta {

    public static function getUser() {
        return ['stranger' => '*'];
    }

    public static function execute($p) {
        $data = [];
        \db\init(DB_PATH_LOG);
        foreach ($p as $value) {
            $q = "select id, mark, datetime(mark, 'unixepoch', 'localtime') mark_str, value, state from v_real where id={$value['id']} order by mark asc";
            $r = \db\getData($q);
            while ($row = \db\fetch_assoc($r)) {
                \array_push($data, $row);
            }
        }
        \db\suspend();
        return $data;
    }

}
