module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    clean: ["min/*", "dist/*"],
    copy: {
      ico: {
        src: "src/favicon.ico",
        dest: "dist/favicon.ico"
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: "src",
        src: ["**/*.css", "!*.min.css"],
        dest: "min/",
        ext: ".css"
      }
    },
    uglify: {
      minify: {
        files: [{
          expand: true,
          cwd: "src",
          src: ["**/*.js", "!*.min.js"],
          dest: "min"
        }]
      }
    },
    processhtml: {
      inline: {
        files: {
          "min/index.html": ["src/index.html"],
          "min/error.html": ["src/error.html"]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          "dist/index.html": "min/index.html",
          "dist/error.html": "min/error.html"
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-processhtml");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");

  grunt.registerTask("default", [
    "clean",
    "copy",
    "cssmin",
    "uglify",
    "processhtml",
    "htmlmin"
  ]);
  grunt.registerTask("wipe", ["clean"]);
};
