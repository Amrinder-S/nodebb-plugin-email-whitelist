'use strict';
const pluginData = require('nodebb-plugin-email-whitelist/plugin.json');

const meta = require.main.require('./src/meta');

const Plugin = module.exports;

pluginData.nbbId = pluginData.id.replace(/nodebb-plugin-/, '');

Plugin.load = async function (params) {
	const routeHelpers = require.main.require('./src/routes/helpers');
	const { router } = params;
	routeHelpers.setupAdminPageRoute(router, `/admin/plugins/${pluginData.nbbId}`, (req, res) => {
		res.render(`admin/plugins/${pluginData.nbbId}`, {
			title: pluginData.name,
		});
	});
};

Plugin.onEmailSave = async (data) => {
	const pluginSettings = await meta.settings.get(pluginData.nbbId);
	if (isWhitelistedDomain(data.email, pluginSettings.domains)) {
		throw new Error('You must only use gndec.ac.in email.');
	}

	return data;
};

Plugin.filterEmailUpdate = async function (data) {
	if (data && data.email) {
		const pluginSettings = await meta.settings.get(pluginData.nbbId);
		if (isWhitelistedDomain(data.email, pluginSettings.domains)) {
			throw new Error('You must only use gndec.ac.in email.');
		}
	}
	return data;
};

function isWhitelistedDomain(email, domains = '') {
	const emailDomain = String(email).substring(email.indexOf('@') + 1);
	const domainWhitelist = (domains || '').split('\n').map(line => line.trim());
	return !domainWhitelist.includes(emailDomain);
}


Plugin.admin = {
	menu: function (header, callback) {
		header.plugins.push({
			route: `/plugins/${pluginData.nbbId}`,
			icon: pluginData.faIcon,
			name: pluginData.name,
		});

		callback(null, header);
	},
};
