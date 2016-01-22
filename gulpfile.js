var gulp = require('gulp');
var plug = require('gulp-load-plugins')({ lazy: true });

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var babel = require('babel-core/register');
var del = require('del');

var config = require('./gulp.config');

/* ------------ HELPER ------------ */

gulp.task('help', plug.taskListing);
gulp.task('default', ['help']);

/* ------------ BUILD & DEPLOYMENT FRONTEND ------------ */

gulp.task('deployWebsite', function (done) {
  plug.runSequence(
    ['clean-frontend'],
    ['generate-sass'],
    ['build-frontend', 'test-frontend', 'copy-files', 'prep-lib'],
    ['upload-frontend'],
    done
    );
});

gulp.task('clean-frontend', function () {
  return del(config.frontend.dist_dir);
});

gulp.task('build-frontend', function () {
  return browserify({
    extensions: ['.js', '.jsx'],
    entries: config.frontend.app,
  })
    .transform(babelify.configure({
      ignore: /(node_modules)/
    }))
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(plug.uglify())
    .pipe(gulp.dest(config.frontend.dist_dir));
});

gulp.task('upload-frontend', function () {
  var publisher = plug.awspublish.create({
    params: {
      Bucket: 'price-tracker-website'
    }
  });
  return gulp.src(config.frontend.dist_files)
  //.pipe(plug.awspublish.gzip({ ext: '.gz' }))
    .pipe(publisher.publish({ 'Cache-Control': 'max-age=315360000, no-transform, public' }))
    .pipe(publisher.cache())
    .pipe(plug.awspublish.reporter());
});

/* ------------ BUILD & DEPLOYMENT BACKEND ------------ */

gulp.task('deployLambda', function (done) {
  plug.runSequence(
    ['clean-backend'],
    ['test-backend'],
    ['build-backend', 'node-mods'],
    ['zip-files'],
    ['upload-backend'],
    done
  );
});

gulp.task('clean-backend', function () {
  return del(config.backend.dist_dir);
});

gulp.task('node-mods', function () {
  return gulp.src('./package.json')
    .pipe(gulp.dest(config.backend.dist_dir))
    .pipe(plug.install({ production: true }));
});

gulp.task('build-backend', function () {
  return gulp.src(config.backend.src_files)
    .pipe(gulp.dest(config.backend.dist_dir));
});

gulp.task('zip-files', function () {
  return gulp.src(config.backend.exclude.concat(config.backend.dist_files))
    .pipe(plug.zip('dist.zip'))
    .pipe(gulp.dest(config.backend.dist_dir));
});

gulp.task('upload-backend', function () {
  return gulp.src(config.backend.dist_zip)
    .pipe(plug.awslambda('Notifier', { region: 'us-west-2' }))
    .pipe(plug.awslambda('Watcher', { region: 'us-west-2' }))
    .pipe(plug.awslambda('GetProduct', { region: 'us-west-2' }))
    .pipe(plug.awslambda('GetProducts', { region: 'us-west-2' }))
    .pipe(plug.awslambda('SaveProduct', { region: 'us-west-2' }))
    .pipe(gulp.dest(config.backend.dist_dir));
});

/* ------------ TESTS ------------ */

gulp.task('test', function(done){
  plug.runSequence(
    ['test-frontend'],
    ['test-backend'],
    done
    );
});

gulp.task('coverage', function (done) {
  plug.runSequence(
    ['coverage-backend'],
    ['coverage-frontend'],
    done
  );
});

gulp.task('test-frontend', function () {
  return gulp.src(config.frontend.test_files, { read: false })
    .pipe(plug.mocha({
      compilers: {
        js: babel
      }
    }));
});

gulp.task('test-backend', function () {
  return gulp.src(config.backend.test_files, { read: false })
    .pipe(plug.mocha({
      recursive: true,
      timeout: 15000
    }));
});

/* ------------ TEST COVERAGE FRONTEND ------------ */

gulp.task('pre-test-frontend', function () {
  return gulp.src(config.frontend.src_files)
    .pipe(require('gulp-babel')({
            presets: ['react']
    }))
    .pipe(plug.istanbul())
    .pipe(plug.istanbul.hookRequire());
});

gulp.task('coverage-frontend', ['pre-test-frontend'], function () {
  return gulp.src(config.frontend.test_files, { read: false })
    .pipe(plug.mocha({
      reporter: 'min',
      recursive: true,
      compilers: {
        js: babel
      }
    }))
    .pipe(plug.istanbul.writeReports({
      reporters: ['text', 'text-summary']
    }));
});

/* ------------ TEST COVERAGE BACKEND ------------ */

gulp.task('pre-test-backend', function () {
  return gulp.src(config.backend.src_files)
    .pipe(plug.istanbul())
    .pipe(plug.istanbul.hookRequire());
});

gulp.task('coverage-backend', ['pre-test-backend'], function () {
  return gulp.src(config.backend.test_files, { read: false })
    .pipe(plug.mocha({
      reporter: 'min',
      recursive: true,
      timeout: 15000
    }))
    .pipe(plug.istanbul.writeReports({
      reporters: ['text', 'text-summary']
    }));
});

/* ------------ STYLES ------------ */

gulp.task('generate-sass', function () {
  return gulp.src(config.frontend.sass)
    .pipe(plug.sass().on('error', plug.sass.logError))
    .pipe(plug.concat('app.css'))
    .pipe(plug.minifyCss())
    .pipe(gulp.dest(config.frontend.dist_dir));
});

/* ------------ LIBS ------------ */

gulp.task('prep-lib', ['bundle-lib-css', 'bundle-lib-js']);

gulp.task('bundle-lib-css', function () {
  return gulp.src(config.frontend.lib_css)
    .pipe(plug.concat('lib.css'))
    .pipe(gulp.dest(config.frontend.dist_dir));
});


gulp.task('bundle-lib-js', function () {
  return gulp.src(config.frontend.lib_js)
    .pipe(plug.concat('lib.js'))
    .pipe(gulp.dest(config.frontend.dist_dir));
});

/* ------------ COPY FILES ------------ */

gulp.task('copy-index', function () {
  return gulp.src(config.frontend.index)
    .pipe(gulp.dest(config.frontend.dist_dir));
});

gulp.task('copy-favicon', function () {
  return gulp.src(config.frontend.favicon)
    .pipe(gulp.dest(config.frontend.dist_dir));
});

gulp.task('copy-img', function () {
  return gulp.src(config.frontend.img)
    .pipe(gulp.dest(config.frontend.dist_dir));
});

gulp.task('copy-files', ['copy-index', 'copy-favicon', 'copy-img']);

/* ------------ WATCHES ------------ */

gulp.task('watch:sass', function () {
  gulp.watch(config.frontend.sass, ['generate-sass']);
});

gulp.task('watch:html', function () {
  gulp.watch(config.frontend.index, ['copy-index']);
});
