// De esta manera añado los elementos html necesarios para el ripple, con tan solo añadir la clase .ripple añado estos elementos html los cuales serviran para dar el efecto ripple
$('.ripple').append( '<svg class="ripple-obj js-ripple-circle" ><use height="100" width="100" xlink:href="#ripply-scott" class="js-ripple"></use></svg>' );


// idRandom: esta variable se emplea para generar un id aleatorio y asignarlo al elemento clickeado y con la clase .ripple
var idRandom = 0;
// timing: esta viarable indica la velocidad de la onda
var timing = 0.75;
// ripple: almacena la informacion del elemento al que se le asigno el idRandomRipple, este elemento posee la clase .js-ripple.
var ripple = '';

var ripplyScott = (function() {

  function rippleAnimation(event, timing) {
    var tl           = new TimelineMax();

    // event: es el elemento almacenado en la variable ripple, en esta variable se encuentra toda la información del elemento, de allí se extraen las posiciones del cursor donde se presiono, el tamaño del elemento presiona, luego se almacenan en las diferentes variables las cuales se usaran como parametros para la funcion de la onda
    x            = event.offsetX,
    y            = event.offsetY,
    w            = event.target.offsetWidth,
    h            = event.target.offsetHeight,
    offsetX      = Math.abs( (w / 2) - x ),
    offsetY      = Math.abs( (h / 2) - y ),
    deltaX       = (w / 2) + offsetX,
    deltaY       = (h / 2) + offsetY,
    scale_ratio  = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    // console.log('x is:' + x);
    // console.log('y is:' + y);
    // console.log('offsetX is:' + offsetX);
    // console.log('offsetY is:' + offsetY);
    // console.log('deltaX is:' + deltaX);
    // console.log('deltaY is:' + deltaY);
    // console.log('width is:' + w);
    // console.log('height is:' + h);
    // console.log('scale ratio is:' + scale_ratio);

    tl.fromTo(ripple, timing, {
      x: x,
      y: y,
      transformOrigin: '50% 50%',
      scale: 0,
      opacity: 1,
      ease: Linear.easeIn
    },{
      scale: scale_ratio,
      opacity: 0
    });

    return tl;
  }

  return {
    init: function() {

      // al precionar en un elemento con la clase ripple
      $(document).on('click', '.ripple', function(event)
      {
        // Genero id ramdom para el elemento padre, (boton que ejecuta la accion, este posee la clase ripple)
        idRandom = String(Math.floor((Math.random() * 10000) + 1));
        // console.log("Se ha asignado el id:"+" "+ idRandom)
        // Añado al boton el id generado
        $(this).attr("id",idRandom);
        // Genero otro id para identificar al elemento js-ripple que quiero que se vea afectado
        var idRandomRipple = String(Math.floor((Math.random() * 100) + 1));
        // console.log("Se ha añadido al elemento con la clase .ripple el id:"+" "+ idRandomRipple)
        // Añado al js-ripple el id generado
        $(this).find('.js-ripple').attr("id",idRandomRipple);
        // guardo en ripple el elemento que posee el id que genere anteriormente
        ripple = document.getElementById(idRandomRipple);

        // Ejecuto la funcion pasando como parametros el elementos que se clickeo y el tiempo de ejecucion, al pasar $(this): estoy mandando un objeto con toda la info del elemento, la cual se emplea en la funcion rippleAnimation para sacar la posicion del elemento y la posicion del mouse donde fue clickeado
        rippleAnimation.call($(this), event, timing)


        // Remuevo los id generados en los elementos
        $(this).removeAttr('id');
        $(this).find('.js-ripple').removeAttr('id');

      })
    }
  };
})();

ripplyScott.init();
