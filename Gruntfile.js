module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * DroplitJS v<%= pkg.version %>\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',
    jasmine: {
      all: {
        src: [
          'src/droplit.js',
          'src/droparea.js'
        ],
        options: {
          vendor: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/sinon/pkg/sinon.js',
          ],
          specs: 'spec/**/*.js',
          keepRunner: true
        }
      }
    },
    jshint: {
      all: ['src/*.js', 'spec/*.js']
    },
    watch: {
      files: ['src/**/*.js', 'spec/**/*.js'],
      tasks: ['jshint:all', 'jasmine:all']
    },
    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          'dist/droplit.min.js': ['src/droplit.js', 'src/droparea.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['uglify:dist'])

  grunt.registerTask('example', 'Run Express server for example', function() {
    grunt.log.writeln('Started web server on port 4000');
    var express = require('express');
    var app = express();
    app.configure(function(){
      app.use(express.methodOverride());
      app.use(express.multipart());
    });
    app.use(express.static(__dirname));
    app.set('views', __dirname);
    
    app.engine('html', require('ejs').renderFile);

    app.get('/', function(req, res) {
      res.render('index.html');
    });

    app.post('/', function(req, res) {
      var fs = require('fs');
      fs.readFile(req.files.myFile.path, function (err, data) {
        var newPath = __dirname + "/example/uploads/" + req.files.myFile.originalFilename;
        fs.writeFile(newPath, data, function (err) {
          res.redirect("back");
        });
      });
    });

    app.listen(4000);
  });

  grunt.registerTask('default', ['connect', 'watch']);

};