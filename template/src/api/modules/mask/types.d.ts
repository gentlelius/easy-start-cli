/**
 * TemplateDTO
 */
type TypeAddMuskParams = {
	/**
	 * 应用id
	 */
	appId?: number;
	/**
	 * 模板渠道配置
	 */
	appTemplateConfig?: AppTemplateConfig;
	/**
	 * 模板审核描述
	 */
	auditContent?: string;
	/**
	 * 模板审核状态[0:草稿未发起审核,1:待审核,2:审核中,3:审核成功,4:审核失败]
	 */
	auditStatus?: number;
	/**
	 * 模板内容
	 */
	contentModifyDTOList?: TemplateContentDTO[];
	/**
	 * 模板默认语言
	 */
	defaultLang?: string;
	/**
	 * 模板描述
	 */
	description?: string;
	/**
	 * 模板状态[0:禁用,1:启用]
	 */
	isEnable?: boolean;
	/**
	 * 名称
	 */
	name?: string;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 模板KEY，大写下划线格式
	 */
	templateKey?: string;
	/**
	 * 模板类型
	 */
	type?: number;
};

/**
 * 模板渠道配置
 *
 * AppTemplateConfig
 */
type AppTemplateConfig = {
	/**
	 * 渠道配置
	 */
	channelConfig?: TemplateChannelConfig;
	/**
	 * 重复消息过滤开关
	 */
	repeatMsgSwitch?: boolean;
};

/**
 * com.huasheng.standard.msgcenter.api.request.TemplateChannelConfig.AppTemplateChannel
 *
 * AppTemplateChannel
 */
type AppTemplateChannel = {
	channelKey?: string;
	channelName?: string;
	/**
	 * 是否是主渠道,默认为主
	 */
	isPrimary?: number;
	weight?: number;
};

/**
 * com.huasheng.standard.msgcenter.api.request.TemplateDTO.TemplateContentDTO
 *
 * TemplateContentDTO
 */
type TemplateContentDTO = {
	/**
	 * 模板内容
	 */
	content?: string;
	/**
	 * 模板内容配置
	 */
	contentConfig?: string;
	/**
	 * 模板内容关联语言
	 */
	contentLang?: string;
	/**
	 * contentId
	 */
	id?: number;
	/**
	 * 状态[0:禁用,1:启用]
	 */
	isEnable?: boolean;
	/**
	 * 模板内容名称
	 */
	name?: string;
	/**
	 * 跳转类型[兼容字段]
	 */
	redirectType?: string;
	/**
	 * 跳转参数值[兼容字段]
	 */
	redirectValue?: string;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 关联模板id
	 */
	templateId?: string;
	/**
	 * 模板内容title
	 */
	title?: string;
	/**
	 * 模板内容title url
	 */
	titleUrl?: string;
	/**
	 * 模板类型[1:SMS,2:EMAIL,3:PUSH,4:站内信,5:微信公众号,6:飞书,7:钉钉]
	 */
	type?: number;
};

type TypeAuditMustParams = {
	auditContent?: string;
	auditStatus: boolean;
};

/**
 * TemplateDTO
 */
type TypeUpdateMaskParams = {
	/**
	 * 应用id
	 */
	appId: number;
	/**
	 * 模板审核描述
	 */
	auditContent?: string;
	/**
	 * 模板审核状态[0:草稿未发起审核,1:待审核,2:审核中,3:审核成功,4:审核失败]
	 */
	auditStatus?: number;
	/**
	 * 模板内容
	 */
	contentModifyDTOList?: TemplateContentDTO[];
	/**
	 * 模板默认语言
	 */
	defaultLang?: string;
	/**
	 * 模板描述
	 */
	description?: string;
	/**
	 * 模板渠道配置
	 */
	sendConfig?: AppTemplateConfig;
	/**
	 * 模板状态[0:禁用,1:启用]
	 */
	isEnable?: boolean;
	/**
	 * 模板性质
	 */
	sceneType?: MsgContentType;
	/**
	 * 名称
	 */
	name: string;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 模板KEY，大写下划线格式
	 */
	templateKey: string;
	/**
	 * 模板类型
	 */
	type: number;
};

/**
 * 模板性质
 */
type MsgContentType =
	| 'NOTIFY_MSG_SEND'
	| 'MARKETING_MSG_SEND'
	| 'INFORMATION_MSG_SEND'
	| 'COMMUNITY_MSG_SEND';

/**
 * TemplateDTO
 *
 * TemplateVO
 */
type TypeQueryMaskDetailRes = {
	/**
	 * 应用id
	 */
	appId: number;
	/**
	 * 模板审核描述
	 */
	auditContent?: string;
	/**
	 * 模板审核状态[0:草稿未发起审核,1:待审核,2:审核中,3:审核成功,4:审核失败]
	 */
	auditStatus?: number;
	/**
	 * 模板内容
	 */
	contentList?: TemplateContentVO[];
	/**
	 * 创建人
	 */
	createBy?: string;
	/**
	 * 创建时间
	 */
	createTime?: string;
	/**
	 * 模板默认语言
	 */
	defaultLang?: string;
	/**
	 * 模板描述
	 */
	description?: string;
	/**
	 * 扩展参数（不同的渠道模板有些特殊的参数，放到该参数中维护）
	 */
	extendParam?: TemplateExtendParam;
	/**
	 * 主键id
	 */
	id?: number;
	/**
	 * 模板状态[0:禁用,1:启用]
	 */
	isEnable?: boolean;
	/**
	 * 名称
	 */
	name?: string;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 扩展配置
	 */
	sendConfig?: SendConfig;
	/**
	 * 模板KEY，大写下划线格式
	 */
	templateKey?: string;
	/**
	 * 模板类型
	 */
	type?: number;
	/**
	 * 更新人
	 */
	updateBy?: string;
	/**
	 * 创建时间
	 */
	updateTime?: string;
	[property: string]: any;
};

/**
 * com.huasheng.standard.msgcenter.api.response.TemplateContentVO
 *
 * TemplateContentVO
 */
type TemplateContentVO = {
	/**
	 * 模板内容
	 */
	content?: string;
	/**
	 * 模板内容配置
	 */
	contentConfig?: string;
	/**
	 * 模板内容关联语言
	 */
	contentLang: string;
	/**
	 * 创建人
	 */
	createBy?: string;
	/**
	 * 创建时间
	 */
	createTime?: string;
	/**
	 * 主键id
	 */
	id?: number;
	/**
	 * 状态[0:禁用,1:启用]
	 */
	isEnable?: boolean;
	/**
	 * 模板内容名称
	 */
	name?: string;
	/**
	 * 跳转类型[兼容字段]
	 */
	redirectType?: number;
	/**
	 * 跳转参数值[兼容字段]
	 */
	redirectValue?: string;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 关联模板id
	 */
	templateId?: number;
	/**
	 * 模板内容title
	 */
	title?: string;
	/**
	 * 模板内容title url
	 */
	titleUrl?: string;
	/**
	 * 模板类型[1:SMS,2:EMAIL,3:PUSH,4:站内信,5:微信公众号,6:飞书,7:钉钉]
	 */
	type?: number;
	/**
	 * 更新人
	 */
	updateBy?: string;
	/**
	 * 创建时间
	 */
	updateTime?: string;
	[property: string]: any;
};

/**
 * 扩展参数（不同的渠道模板有些特殊的参数，放到该参数中维护）
 *
 * TemplateExtendParam
 */
type TemplateExtendParam = {
	/**
	 * IM业务类型（决定该模板消息出现在App的消息中心的哪个栏目）
	 */
	imBizType?: number;
	/**
	 * IM、Push跳转类型
	 */
	redirectType?: string;
	/**
	 * 跳转参数值
	 */
	redirectValue?: string;
	[property: string]: any;
};

/**
 * 扩展配置
 *
 * SendConfig
 */
type SendConfig = {
	/**
	 * 渠道配置
	 */
	channelConfig?: TemplateChannelConfig;
	/**
	 * 重复消息过滤开关
	 */
	repeatMsgSwitch?: boolean;
	[property: string]: any;
};

/**
 * 渠道配置
 *
 * TemplateChannelConfig
 */
type TemplateChannelConfig = {
	/**
	 * 模板渠道配置
	 */
	channels: TemplateChannel[];
	/**
	 * 路由策略，1-主备，2-权重
	 */
	routeStrategy: RouteStrategy;
};

/**
 * com.huasheng.standard.msgcenter.api.request.TemplateChannelConfig.TemplateChannel
 *
 * TemplateChannel
 */
type TemplateChannel = {
	/**
	 * 渠道Key
	 */
	channelKey: string;
	/**
	 * 是否是主渠道(路由策略选择主备时有效)
	 */
	isPrimary?: boolean;
	/**
	 * 权重百分比(路由策略选择权重时有效)
	 */
	weight?: number;
};

/**
 * 路由策略，1-主备，2-权重
 */
type RouteStrategy = 1 | 2;
