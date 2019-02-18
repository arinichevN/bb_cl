<?php

$af = function($p) {
	\sock\init($p['address'], $p['port']);
	\acp\requestSendI1List(ACP_CMD_BB_CHANNEL_CLOSE, $p['item']);
	\sock\suspend();
};
