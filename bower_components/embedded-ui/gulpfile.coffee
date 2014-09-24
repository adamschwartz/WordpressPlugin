fs = require('fs')
Path = require('path')
es = require('event-stream')
browserify = require('browserify')
source = require('vinyl-source-stream')
uglify = require('gulp-uglify')

gulp = require('gulp')
gutil = require('gulp-util')
bower = require('gulp-bower')
buffer = require('gulp-buffer')
concat = require('gulp-concat')
coffee = require('gulp-coffee')
replace = require('gulp-replace')
jade = require('gulp-jade')
stylus = require('gulp-stylus')
nib = require('nib')

{buildPage, pageCompiler} = require('./tools/build')

publish = require('build')

gulp.task 'bower', ->
  bower()
    .pipe(gulp.dest('bower_components/'))

gulp.task 'bundle', ['bower'], ->
  gulp.src("./pages/*")
    .pipe(es.mapSync(buildPage))

gulp.task 'pages', ['bundle'], ->
  gulp.src("./pages/*")
    .pipe(es.through(pageCompiler(uncss: false)))

gulp.task 'browserify', ->
  for file in ['eager', 'wordpress']
    browserify({
      entries: ["./coffee/#{ file }.coffee"]
      extensions: ['.coffee']
    })
      .bundle()
      .pipe(source("#{ file }.js"))
      .pipe(buffer())
      .pipe(replace(/(typeof define === 'function' && define.amd)/g, '(false)'))
      .pipe(uglify())
      .pipe(gulp.dest('./build/js'))

gulp.task 'tests', ->
  browserify({
    entries: ['./test/tests.coffee']
    extensions: ['.coffee']
  })
    .bundle()
    .pipe(source('tests.js'))
    .pipe(gulp.dest('./build/js'))

gulp.task 'watch', ->
  gulp.watch './pages/*/{jade,coffee,styl}/*', ['pages']
  gulp.watch './jade/*', ['pages']
  gulp.watch './bower_components/ui/{jade,styl}/*', ['pages']

  gulp.watch './coffee/*', ['browserify']
  gulp.watch './**/*.coffee', ['tests']

DEPLOY =
  src: ['**', '!node_modules/**', '!*.json', '!*.yml', '!*.yaml', '!bower_components/**', '!coffee/**', '!js/**', '!gulpfile.*']

gulp.task 'publish-dev', ->
  publish('development', DEPLOY)

gulp.task 'publish-prod', ->
  publish('production', DEPLOY)

gulp.task 'publish-staging', ->
  publish('staging', DEPLOY)

gulp.task 'build', ['pages', 'browserify', 'tests']
gulp.task 'default', ['build', 'watch']
