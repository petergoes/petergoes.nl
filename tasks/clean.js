const gulp = require('gulp');
const del = require('del');
const { paths } = require('./config')
const fs = require('fs')

gulp.task('clean', clean);

function clean() {
  return del(paths.dist.all)
    .then(() => {
      if (!fs.existsSync(paths.dist.root)){
        fs.mkdirSync(paths.dist.root);
      }
    });
}
