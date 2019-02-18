<?php

$af = function($p) {
	\sock\init($p['address'], $p['port']);
	\acp\requestSendI1List(ACP_CMD_CHANNEL_GET_INFO, $p['item']);
	$data = \acp\getBBChannelInfo($id);
	\sock\suspend();
	return $data;
};
