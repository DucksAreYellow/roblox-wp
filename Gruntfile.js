module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        implementation: require('node-sass')
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'style.css': 'sass/style.scss'
        }
      },
      dev: {
        files: {
          'style.css': 'sass/style.scss'
        }
      }
    },

    uglify: {
      all: {
        files: {
          'site.min.js': ['js/vendor/vimeo-player.min.js','js/vendor/jquery.mask.min.js', 'js/vendor/slick/slick.js', 'js/vendor/gsap/TweenMax.min.js', 'js/vendor/scrollmagic/ScrollMagic.js', 'js/vendor/scrollmagic/jquery.ScrollMagic.js',   'js/vendor/scrollmagic/animation.gsap.js', 'js/vendor/scrollmagic/debug.addIndicators.js', 'js/analytics.js', 'js/utils.js', 'js/contact-form.js', 'js/testimonials-slideshow.js', 'js/careers-slideshow.js', 'js/application.js', 'js/ajax.js', 'js/scrollToggle.js', 'js/accessibility.js']
        }
      }
    },

    watch: {
      pages: {
        files: ['**/*.{php, html}']
      },
      css: {
        files: ['sass/**/*.scss'],
        tasks: ['sass:dev']
      },
      scripts: {
        files: ['js/**/*.js'],
        tasks: ['uglify']
      }
    }

  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['sass:dist', 'uglify:all']);

};