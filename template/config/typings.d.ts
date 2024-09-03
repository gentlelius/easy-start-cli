type umiConfType = {
	define: {
		APP_ENV: string | undefined;
		BASE_URL: string;
	};
	runtimePublicPath?: boolean;
	publicPath?: string;
};

declare const UMI_ENV: string;
