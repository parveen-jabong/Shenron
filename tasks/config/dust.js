module.exports = function(grunt) {

    grunt.config.set('dust', {
        dev : {
            files: {
                // e.g.
                // 'relative/path/from/gruntfile/to/compiled/template/destination'  : ['relative/path/to/sourcefiles/**/*.html']
                '.tmp/public/templates.js': require('../pipeline').templateFilesToInject
            }
        }
    });

    grunt.loadNpmTasks('grunt-dust');
};
