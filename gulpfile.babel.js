import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import log from "fancy-log";
import pluginError from "plugin-error";
import flatten from "gulp-flatten";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import sass from "gulp-sass";
import dartSass from "sass";

// Sass compiler
sass.compiler = dartSass;

// sass sources

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Run server tasks
gulp.task("server", ["hugo", "css", "scss", "js", "fonts"], (cb) => runServer(cb));
gulp.task("server-preview", ["hugo-preview", "css", "scss", "js", "fonts"], (cb) => runServer(cb));

// Build/production tasks
gulp.task("build", ["css", "scss", "js", "fonts"], (cb) => buildSite(cb, [], "production"));
gulp.task("build-preview", ["css", "scss", "js", "fonts"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

// Compile CSS with PostCSS
gulp.task("css", () => (
    gulp.src("./src/css/**/*.css")
        .pipe(postcss([cssImport({from: "./src/css/main.scss"}), cssnext()]))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream())
));

// Compile Scs with gulp-sass
gulp.task("scss", () => ([
    gulp.src("./src/css/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream())
]));

// Compile Javascript
gulp.task("js-es6", (cb) => {
    const myConfig = Object.assign({}, webpackConfig);

    webpack(myConfig, (err, stats) => {
        if (err) throw new pluginError("webpack", err);
        log(`[webpack] ${stats.toString({
            colors: true,
            progress: true
        })}`);
        browserSync.reload();
        cb();
    });
});

gulp.task("js", () =>([
    jsTask("./node_modules/jquery/dist/jquery.min.js"),
    jsTask("./node_modules/bootstrap/dist/js/bootstrap.js")
]));

function fontTask(path, dest = "./dist/fonts") {
    return gulp.src(path)
        .pipe(flatten())
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream())
}

function jsTask(path) {
    return gulp.src(path)
        .pipe(flatten())
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream())
}

// Move all fonts in a flattened directory
gulp.task('fonts', () => ([
    fontTask("./src/fonts/**/*"),
    fontTask("./node_modules/@fortawesome/fontawesome-free/webfonts/*", "./dist/webfonts")
]));

// Development server with browsersync
function runServer() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false
    });
    gulp.watch("./src/js/**/*.js", ["js"]);
    gulp.watch("./src/css/**/*.css", ["css"]);
    gulp.watch("./src/css/**/*.scss", ["scss"]);
    gulp.watch("./src/fonts/**/*", ["fonts"]);
    gulp.watch("./site/**/*", ["hugo"]);
}

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
    const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

    process.env.NODE_ENV = environment;

    return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
        if (code === 0) {
            browserSync.reload();
            cb();
        } else {
            browserSync.notify("Hugo build failed :(");
            cb("Hugo build failed");
        }
    });
}
