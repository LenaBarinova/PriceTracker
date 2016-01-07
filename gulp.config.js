(function(){
  "use strict";

  const src_dir_frontend = "./src/frontend/";
  const dist_dir_frontend = "./dist/frontend/";
  const src_dir_backend = "./src/backend/";
  const dist_dir_backend = "./dist/backend/";


  let config = {
    frontend: {
      src_dir: src_dir_frontend,
      src_files: [src_dir_frontend + "**/*.js", src_dir_frontend + "**/*.jsx"],

      test_dir: "./test/frontend/",
      test_files: ["./test/frontend/**/*-test.js", "./test/frontend/**/*-test.jsx"],

      dist_dir: dist_dir_frontend,
      dist_files: dist_dir_frontend + "**/*.*",
      sass: src_dir_frontend + "sass/**/*.scss",
      index: src_dir_frontend + "index.html",
      app: src_dir_frontend + "app.jsx",
      favicon: src_dir_frontend + "*.ico",
      lib_css: src_dir_frontend + "lib/css/**/*",
      lib_js: src_dir_frontend + "lib/js/**/*.js",
      img: "./img/stores.png"
    },
    backend: {
      src_dir: src_dir_backend,
      src_files: src_dir_backend + "**/*.js",
      test_dir: "./test/backend/",
      test_files: "./test/backend/**/*-test.js",
      dist_dir: dist_dir_backend,
      dist_files: dist_dir_backend + "**/*",
      exclude: ['!' + dist_dir_backend + 'package.json',
        '!' + dist_dir_backend + 'node_modules/react*{,/**}',
        '!' + dist_dir_backend + 'node_modules/flux{,/**}',
        '!' + dist_dir_backend + 'node_modules/keymirror{,/**}',
        '!' + dist_dir_backend + 'node_modules/node-sass{,/**}'
      ],
      dist_zip: dist_dir_backend + "dist.zip"
    },
    data_dir: "./data/*"
  };

  module.exports = config;
})();