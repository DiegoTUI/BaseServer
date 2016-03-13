'use strict';

module.exports = function(grunt) {
    var sourceFiles = [
        '*.js',
        'bin/*.js',
        'config/*js',
        'api/**/*.js',
        'utils/*.js'
    ];
    grunt.initConfig({
        jshint: {
            files: sourceFiles,
            options: {
                // use closest-through-parent jshint configuration file
                jshintrc: true
            }
        },
        jsdoc: {
            dist: {
                src: sourceFiles,
                options: {
                    destination: 'doc'
                }
            }
        },
        jscs: {
            src: sourceFiles,
            options: {
                config: '.jscsrc'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.registerTask('default', ['jshint', 'jsdoc', 'jscs']);
};
