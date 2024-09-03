// 设置commit提交规范
module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feat', // 新增/优化部分功能、特性
				'fix', // 修复bug
				'docs', // 修改文档
				'style', // 代码风格变更（不影响功能, 例如分号修改）
				'refactor', // 代码重构（重构，在不影响代码内部行为、功能下的代码修改）
				'perf', // 性能优化
				'build', // 影响项目构建或依赖项修改
			],
		],
		'subject-case': [0, 'never'],
	},
};
