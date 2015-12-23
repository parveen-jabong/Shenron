module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'dust',
		'less:dev',
		'copy:dev',
		'coffee:dev'
	]);
};
