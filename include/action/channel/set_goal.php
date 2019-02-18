<?php

$af = function($p) {
	\sock\init($p['address'], $p['port']);
	\acp\requestSendI1F1List(ACP_CMD_BB_CHANNEL_PROG_SAVE_GOAL, $p['item']);
	\sock\suspend();
};
