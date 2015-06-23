
'use strict';

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var config = {
    app: 'app',
    dist: 'dist',
    temp: '.tmp'
  };

  grunt.initConfig({
    config: config,

    // 监控文件变化并执行任务
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      sass: {
        files: ['<%= config.app %>/styles/{,*/}*.{sass,scss}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          // livereload 端口指定
          livereload: '<%= connect.options.livereload %>'
        },
        // 监视的文件？
        files: [
          '<%= config.app %>/{,*/}*.html',
          '<%= config.temp %>/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      }
    },
    // 本地静态服务器
    connect: {
      options: {
        // connect 启动的本地服务器地址
        hostname: 'localhost',
        // connect 启动的本地服务器端口号
        port: 9000,
        // livereload 功能所使用的端口号
        livereload: 35729
      },
      livereload: {
        options: {
          middleware: function (connect, options) {
            // 监控这两个目录
            return [
              connect.static(config.temp),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        optons: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },
    // bower 路径依赖自动补全
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['<%= config.app %>/{,*/}*.html']
      },
      sass: {
        ignorePath: /(\.\.\/){1,2}bower_components\//,
        src: ['<%= config.app %>/styles/{,*/}*.{sass,scss}']
      }
    },
    copy: {
      styles: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>/styles',
          dest: '<%= config.temp %>/styles',
          src: '{,*/}*.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'bower_components/bootstrap-sass/assets/fonts',
          dest: '<%= config.temp %>/fonts',
          src: '{,*/}*'
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '{,*/}*.{ico,png,txt}',
            '{,*/}*html'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= config.temp %>/fonts',
          src: '{,*/}*',
          dest: '<%= config.dist %>/fonts'
        }]
      }
    },
    // 清理工程目录
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.temp %>',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '<%= config.temp %>'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },
    sass: {
      options: {
        sourceMap: true,
        includesPaths: ['bower_components']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['{,*/}*.{sass,scss}'],
          dest: '<%= config.temp %>/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['{,*/}*.{sass,scss}'],
          dest: '<%= config.temp %>/styles',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.temp %>/styles',
          dest: '<%= config.dist %>/styles',
          src: ['{,*/}*.css']
        }]
      }
    },
    // css 文件浏览器前缀补充
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.temp %>/styles/',
          src: '{,*/}*.css',
          dest: '<%= config.temp %>/styles/'
        }]
      }
    },
    // 多线程任务
    concurrent: {
      server: [
        'sass:server',
        'copy:server'
      ],
      dist: [
        'sass:dist',
        'copy'
      ]
    }
  });

  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'concurrent:dist',
    'autoprefixer',
    'cssmin'
  ]);
};

