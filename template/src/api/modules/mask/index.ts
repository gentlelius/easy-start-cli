import { request } from '@umijs/max';
import { omit } from 'lodash-es';

/**
 * 新增模板
 * @param data 新增模板参数
 * @returns Promise<any>
 */
export function addMask(data: TypeAddMuskParams) {
	return request('/message-center/template/add', {
		method: 'POST',
		data,
	});
}

/**
 * 模板编辑更新
 * @param data 模板数据
 * @returns Promise<any>
 */
export function updateMask(id: string, data: TypeUpdateMaskParams) {
	return request(`/message-center/template/update/${id}`, {
		method: 'POST',
		data: omit(data, ['id']),
	});
}

/**
 * APP下拉框
 * @returns Promise<any>
 */
export function getAppOptions() {
	return request('/message-center/app/select');
}

/**
 * 渠道类型下拉框
 * @returns Promise<any>
 */
export function getChannelTypeOptions() {
	return request('/message-center/channel/channelType/select');
}

/**
 * 根据渠道类型获取渠道下拉框
 * @returns Promise<any>
 */
export function getChannelOptionsByType(channelType: number) {
	return request('/message-center/channel/getChannelByType/select', {
		method: 'GET',
		params: {
			channelType,
		},
	});
}

/**
 * 模板性质下拉框
 * @returns Promise<any>
 */
export function getContentTypeOptions() {
	return request('/message-center/template/getMsgContentType/select');
}

/**
 * 业务分类下拉框
 * @returns Promise<any>
 */
export function getImBizTypemOptions() {
	return request('/message-center/template/imRedirectType/select');
}

/**
 * 模板审核
 * @param id
 * @param auditStatus
 * @returns Promise<any>
 */
export function auditMusk(id: string, data: TypeAuditMustParams) {
	return request(`/message-center/template/audit/${id}`, {
		method: 'POST',
		data,
	});
}

/**
 * 查询模板详情
 * @param id 模板id
 * @returns Promise<any>
 */
export function queryMaskDetail(id: string) {
	return request(`/message-center/template/${id}`);
}

/**
 * 启用/禁用模板
 * @param id 模板id
 * @param isEnable 是否启用
 * @returns Promise<any>
 */
export function updateStatus(id: string, isEnable: boolean) {
	return request(`/message-center/template/updateStatus/${id}`, {
		method: 'POST',
		params: {
			isEnable,
		},
	});
}

/**
 * 获取语言下拉框
 * @returns Promise<any>
 */
export function getLangOptions() {
	return request('/message-center/template/language/select');
}
