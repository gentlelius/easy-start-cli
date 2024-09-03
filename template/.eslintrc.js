// eslint校验
module.exports = {
	// Umi Max 项目
	extends: [require.resolve('@umijs/max/eslint'), 'prettier'],
	plugins: ['prettier'],
	rules: {
		'@typescript-eslint/ban-types': 1,
		'react-hooks/exhaustive-deps': 'warn',
		'prettier/prettier': [2],
	},
};
