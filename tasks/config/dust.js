module.exports = function(grunt) {

    grunt.config.set('dust', {
        compile: {
            files: [{
                expand: true,
                cwd: "assets/templates",
                src: ["**/*.dust"],
                dest: ".tmp/public/live/templates",
                ext: ".js"
            }],
            options: {
                relative: true,
                wrapper: 'amd', //default
                wrapperOptions: {
                    packageName: null,
                    deps: {
                        dust: 'dust'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-dust');
};
