const gulp = require('gulp'),
sass = require('gulp-sass'),
jade = require('gulp-jade'),
plumber = require('gulp-plumber'),
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
connect = require('gulp-connect'),
//    	imagemin = require('gulp-imagemin'),
si = require('gulp-if'),
clean = require('gulp-rimraf'),
runSequence = require('run-sequence');

var comprimir_css = false,
comprimir_jade = true,
// 	comprimir_img = false,
server = true;

/*
DEFINICIÓN DE VARIABLES ↑ :

1.	gulp: Es el motor de este documento requiere la funcinalidad gulpJs sin el
no se podrian ejecutar ninguna tarea, por tanto debe ser definida de primera.

2.	babel: Es mas conocido como un transpilador este se encarga de leer todo
nuestro codigo javascript de EcmaScript6 (ES6) y compilarlo a EcmaScript6 (ES5).

3.  	plumber es un plugin que persiste las tareas de gulpjs aunque hayan
errores en ejecución y asi no tener que estar reiniciando las tareas.

4.	imagemin es el plugin para comprimir las imagenes

5.	uglify se encarga de comprimir o minificar nuestro javascript

6.	si, es un plugin que me permite utilizar condicinales con las tareas

7.	clean lo que hace es eliminar carpetas y ficheros, es util para limpiar
compilaciones anteriores.

8.	runSequence Para definir secuencias de tarea asi tarea1, tarea2, tareaN
una despues de la otra y no 	todas a la vez.

9.	comprimir_css , comprimir_js ,comprimir_img es util para definir si quiero
que esos archivos al ser compilados sean minificado o no.

*/

/**
* Variable de entorno.
* En la terminal se puede definir de manera opcional el puerto para cualquiera
* de las tareas watch, un ejemplo de uso sería:
* PORT=8080 gulp watch:all
*/
var PORT = process.env.PORT || 7070;


//Tarea inicial para hacer una compilación de todo antes de comenzar a trabajar, se compilan los estilos, y paralelamente se ejecuta la tarea watch:all que se encargara de iniciar la conexion y tambien este compilara jade.
gulp.task('default', function() {
	runSequence('limpiar',['sass'],'watch:all');
});


/**
** Limpiar la carpeta css y html
*/
gulp.task('limpiar', function() {
	return gulp.src([
		'./www/lib/easy/css/**/*.css' ,
		'./www/templates/**/*.html'

	],{ read: false })
	.pipe(clean({ force: true }));
});



/**
* Compila los archivos jade hijos directos de la carpeta `jade/templates`.
* Los archivos HTML generados se guardan en la carpeta www/templates del proyecto.
*/
gulp.task('jade', function () {
	gulp.src('./jade/templates/**/*.jade')
	.pipe(plumber())
	.pipe(si(comprimir_jade == true , jade({pretty: true}).on('error', console.log)))
	.pipe(si(comprimir_jade == false , jade().on('error', console.log)))
	.pipe(gulp.dest('./www/templates'))
	.pipe(connect.reload());

});

/**
* Compila los archivos sass hijos directos de la carpeta `scss/`.
* Agrega los prefijos propietarios de los navegadores.
* Los archivos CSS generados se guardan en la carpeta `lib/easy/css`.
*/
gulp.task('sass', function () {

	var processors = [
		autoprefixer({ browsers: ['last 2 versions'] })
	];

	return gulp.src('./scss/**/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(plumber())
	.pipe(postcss(processors))
	.pipe(si(comprimir_css , sass({outputStyle: 'compressed'})))
	.pipe(gulp.dest('./www/lib/easy/css'))
	.pipe(connect.reload());
});

/**
* Recarga el HTML en el navegador.
* Creado para quienes no usen Jade.
*/
gulp.task('html', function () {
	gulp.src('./www/templates/*.html')
	.pipe(connect.reload());
});


/**
* Crea un servidor local livereload
* http://localhost:7070
*/
gulp.task('connect', function() {
	connect.server({
		// root: '.',
		port: PORT,
		livereload: true
	});
});



/**
* Recarga el js en el navegador.
*/
gulp.task('js', function () {
	gulp.src('./www/lib/easy/js/**/*.js')
	.pipe(connect.reload());
});

/**
* Queda escuchano los cambios de todos los archivos js y ejecuta la tarea js, l acual se encarga de recargar el navegador.
*/
gulp.task('watch:js', function () {
	gulp.watch(['./www/lib/easy/js/**/*.js'],['js']);
});

/**
* Ejecuta las tareas watch:sass y watch:jade.
*/
gulp.task('watch:all', ['watch:sass','watch:jade','watch:js']);



/**
* Ejecuta las tareas connect y sass, queda escuchando los cambios de todos
* los archivos Sass de la carpeta `scss/` y subcarpetas.
*/
gulp.task('watch:sass', ['connect','sass'], function () {
	gulp.watch(["./scss/**/*.scss","./www/lib/easy/scss/**/*.scss"] , ["sass"]);
});



/**
* Ejecuta las tareas connect y jade, queda escuchando los cambios de todos
* los archivos jade de la carpeta `jade/` y subcarpetas.
*/
gulp.task('watch:jade',  ['connect','jade'],function () {
	gulp.watch(["./jade/**/*.jade"] ,["jade"]);
});



/**
* Ejecuta las tareas connect y html, queda escuchando los cambios de todos
* los archivos HTML de la carpeta raíz del proyecto.
* Creado para quienes no usen Jade.
*/
gulp.task('watch:html', ['connect', 'html'], function () {
	gulp.watch('./www/templates/*.html', ['html']);
});


/**
* Ejecuta las tareas watch:html y watch:sass
* Creado para quienes no usen Jade.
*/
gulp.task('watch:html-sass', ['watch:html', 'watch:sass']);
