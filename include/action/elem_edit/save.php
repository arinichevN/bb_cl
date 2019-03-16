<?php

namespace program;

class save {

    public static function getUser() {
        return ['stranger' => '*'];
    }

    public static function execute($p) {
        $r = true;
        \db\init(DB_PATH_DATA);
        foreach ($p as $v) {
            $q = "update prog set description='{$v['description']}', interval_min={$v['interval_min']}, max_rows={$v['max_rows']} where id={$v['id']}";
            $r = $r && \db\commandF($q);
        }
        if (!$r) {
            \db\suspend();
            throw new \Exception('some of updates failed');
        }
        \db\suspend();
    }

}
