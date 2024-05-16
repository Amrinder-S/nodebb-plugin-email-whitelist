'use strict';

define('admin/plugins/email-whitelist', [
	'settings',
], function (settings) {
	var ACP = {};

	ACP.init = function () {
		settings.load('email-whitelist', $('.email-whitelist-settings'));
		$('#save').on('click', saveSettings);
	};

	function saveSettings() {
		settings.save('email-whitelist', $('.email-whitelist-settings'));
	}

	return ACP;
});
