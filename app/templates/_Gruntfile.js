module.exports = function( grunt ) {
  'use strict';

  var
    LIVERELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT }),
    mountFolder = function( connect, dir ) {
      return connect.static(require('path').resolve(dir));
    };

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    bowercopy: {
      ink: {
        options: {
          destPrefix: 'src/<%= processorExtension %>'
        },
        files: {
          '_ink.<%= processorExtension %>': 'ink/css/ink.css'
        }
      }
    },
    watch: {
      livereload: {
        files: ['src/compiled/**/*'],
        options: {
          livereload: LIVERELOAD_PORT
        }
      },
      <%= processor %>:{
        files: ['src/**/*.<%= processorExtension %>'],
        tasks: ['<%= processor %>']
      },
      jade:{
        files: ['src/**/*.jade'],
        tasks: ['jade']
      },
      juice: {
        files: ['src/compiled/**/*.html'],
        tasks: ['juice']
      }
    },
    sass:{
      options: {
        style: 'compressed'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.scss'],
          dest: 'src/compiled',
          ext: '.css'
        }]
      }
    },
    less:{
      options: {
        paths: 'less',
        compress: true,
        sourceMap: true,
      },
      files: {
        "src/compiled/main.css": "src/main.less"
      }
    },
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          },
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.jade'],
          dest: 'src/compiled',
          ext: '.html'
        }]
      }
    },
    juice: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: 'src/compiled',
            src: ['**/*.html'],
            dest: 'build/',
            ext: '.html'
          }
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function( connect ) {
            return [
              lrSnippet,
              mountFolder(connect, 'src/compiled')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:9000'
      }
    }
  });

  grunt.registerTask('srv', function() {
    grunt.task.run([
      'connect:livereload',
      'bowercopy',
      '<%= processor %>',
      'jade',
      'juice',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('default', [ 'srv' ]);
};