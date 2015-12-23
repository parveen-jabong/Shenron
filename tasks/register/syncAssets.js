module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
		'dust:dev',
		'less:dev',
		'sync:dev',
		'coffee:dev'
	]);
};
