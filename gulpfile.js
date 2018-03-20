var gulp       = require('gulp'), 
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync').create(), 
    concat       = require('gulp-concat'), 
    uglify       = require('gulp-uglify'), 
    cssnano      = require('gulp-cssnano'), 
    rename       = require('gulp-rename'), 
    del          = require('del'), 
    imagemin     = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'), 
    pngquant     = require('imagemin-pngquant'), 
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('browserSync', function() {
    browserSync.init({
      server: {
        baseDir: './app'
      },
      notify: false 
    })
  })


gulp.task('sass', function(){
    return gulp.src('./app/scss/**/*.scss')
      .pipe(sass()) // Using gulp-sass
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest('./app/css'))
      .pipe(cssnano())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./app/css'))
      .pipe(browserSync.reload({
        stream: true
      }))
});

gulp.task('scripts', function() {
    return gulp.src('./app/js/vendor/*.js')
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js')); 
});

gulp.task('watch', ['browserSync', 'scripts'], function (){
    gulp.watch('./app/scss/**/*.scss', ['sass']); 
    gulp.watch('./app/*.html', browserSync.reload); 
    gulp.watch('./app/js/**/*.js', browserSync.reload); 
});

gulp.task('clean', function() {
    return del.sync('./dist/');
});


gulp.task('img', function(){
    return gulp.src('./app/images/*').pipe(cache(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imageminJpegRecompress({progressive: true, method: 'smallfry', quality: 'veryhigh'}),
        pngquant(),
        imagemin.svgo({plugins: [{removeViewBox: false}]})
    ]))).pipe(gulp.dest('./dist/images'));
});


gulp.task('build', ['clean', 'img','sass', 'scripts'], function() {

    var buildCss = gulp.src('./app/css/styles.min.css')
    .pipe(gulp.dest('./dist/css/'));

    var buildJs = gulp.src('./app/js/*.js')
        .pipe(gulp.dest('./dist/js/'));

    var buildHtml = gulp.src('./app/index.html') 
        .pipe(gulp.dest('./dist/'));

    var buildFonts = gulp.src('./app/fonts/*') 
    .pipe(gulp.dest('./dist/fonts/'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})
