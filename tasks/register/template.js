module.exports = function (grunt) {
    grunt.registerTask('template', [
        'dust',
        'uglify'
    ]);
};
