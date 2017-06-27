module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch : {
            jsx: {
                files: ['views/src/**/*.jsx'],
                tasks: ['reactify'],
                options: {

                }
            },
            styles : {
                files: ['views/src/*/*.scss', 'renderer/*.scss'],
                tasks: ['sass'],
                options: {

                }
            },
            compiled : {
                files: ['views/compiled/*.js'],
                tasks: ['concat'],
                options: {

                }
            }
        },
        reactify: {
            'views/compiled' : 'views/src/*/*.jsx'
        },
        sass : {
            development: {
                options : {

                },
                files : {
                    'views/compiled/styles.css': '**/*.scss'
                }
            }
        },
        uglify : {
            options: {
                banner: '/* \n' +
                '  * \n' +
                '  *  <%= pkg.name %> \n' +
                '  *  <%= pkg.author %> \n' +
                '  *  v<%= pkg.version %> \n' +
                '  *  <%= grunt.template.today("dd/mm/yyyy") %> \n' +
                '  * \n' +
                '  */' +
                '\n\n',
                mangle: true
            },
            build: {
                src: ['views/compiled/*.js'],
                dest: '<%= pkg.name %>.min.js'
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/* \n' +
                '  * \n' +
                '  *  <%= pkg.name %> \n' +
                '  *  <%= pkg.author %> \n' +
                '  *  v<%= pkg.version %> \n' +
                '  *  <%= grunt.template.today("dd/mm/yyyy") %> \n' +
                '  * \n' +
                '  */' +
                '\n\n',
            },
            dist: {
                src: ['renderer/renderer.js', 'views/compiled/*.js'],
                dest: '<%= pkg.name %>.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-reactify');
    grunt.loadNpmTasks('grunt-notify');
    grunt.registerTask('default', ['watch']);

};