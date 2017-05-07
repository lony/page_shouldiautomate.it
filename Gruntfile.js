module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    clean: ["dist"],
    cssmin: {
      minify: {
        expand: true,
        cwd: "src",
        src: ["**/*.css", "!*.min.css"],
        dest: "dist/1_min",
        ext: ".css"
      }
    },
    uglify: {
      minify: {
        files: [{
          expand: true,
          cwd: "src",
          src: ["**/*.js", "!*.min.js"],
          dest: "dist/1_min"
        }]
      }
    },
    processhtml: {
      inline: {
        files: {
          "dist/2_inline/index.html": ["src/index.html"],
          "dist/2_inline/error.html": ["src/error.html"]
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
          "dist/3_comp/index.html": "dist/2_inline/index.html",
          "dist/3_comp/error.html": "dist/2_inline/error.html"
        }
      }
    },
    copy: {
      ico: {
        src: "src/favicon.ico",
        dest: "dist/3_comp/favicon.ico"
      }
    },
    compress: {
      main: {
        options: {
          mode: "gzip"
        },
        expand: true,
        cwd: "dist/3_comp/",
        src: ["**/*"],
        dest: "dist/4_gzip/",
        rename: function (dest, src) {
          return dest + src + ".gz";
        }
      }
    },
    aws: grunt.file.readJSON("aws-deploy-key.json"),
    aws_s3: {
      options: {
        accessKeyId: "<%= aws.AWSAccessKeyId %>",
        secretAccessKey: "<%= aws.AWSSecretKey %>",
        region: "eu-west-1",
      },
      dist: {
        options: {
          params: {
            StorageClass: "REDUCED_REDUNDANCY",
            CacheControl: "public, max-age=1800"
          },
          bucket: "shouldiautomate.it",
          gzipRename: "ext"
        },
        files: [
          {
            action: "upload",
            expand: true,
            cwd: "dist/4_gzip",
            src: ["**"],
            dest: "/"
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-processhtml");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-aws-s3");

  grunt.registerTask("default", [
    "clean",
    "copy",
    "cssmin",
    "uglify",
    "processhtml",
    "htmlmin",
    "compress",
    "aws_s3"
  ]);
  grunt.registerTask("wipe", ["clean"]);
};
