module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'dust:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev'
	]);
};
