module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
		'dust',
		'less:dev',
		'sync:dev',
		'coffee:dev'
	]);
};
