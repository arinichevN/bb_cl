<?php

define('DB_PATH', 'host=localhost port=5432 user=postgres password=654321 dbname=postgres connect_timeout=3');

ini_set('display_errors',1);
error_reporting(E_ALL|E_STRICT);

function f_getConfig() {
    return [
        'acp' => [
            'use' => '1',
        ],
        'sock' => [
            'use' => '1'
            ],
        'session' => [
            'use' => '6',
            'expire_sec' => 97200
        ],
        'check' => [
            'use' => [1],
        ]
    ];
}
