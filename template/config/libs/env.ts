const { UMI_ENV } = process.env;

const domainMaps = {
	dev: '//admin-feature.hszq.com.cn',
	daily: '//admin-daily.vbkrhk.com',
	feature: '//admin-feature.hszq.com.cn',
	beta: '//admin-beta.vbkrhk.com',
	prods: '//admin.vbkrhk.com',
};

const publicPathMaps = {
	dev: '',
	daily: '//rdaily.hstong.com/fe/%%projectName%%/daily/',
	feature: '//rfeature.hstong.com/fe/%%projectName%%/feature/',
	beta: '//rbeta.hstong.com/fe/%%projectName%%/beta/',
	prods: '//r.hstong.com/fe/%%projectName%%/prod/',
};

export const getConfig = () => {
	let conf: umiConfType = {
		define: {
			APP_ENV: UMI_ENV,
			BASE_URL: domainMaps[UMI_ENV || 'dev'],
		},
		publicPath: publicPathMaps[UMI_ENV || 'dev'],
		runtimePublicPath: false,
	};
	if (UMI_ENV === 'dev') {
		delete conf.runtimePublicPath;
		delete conf.publicPath;
	}
	return conf;
};
