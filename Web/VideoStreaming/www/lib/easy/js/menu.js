// --------------------------------------------------------------------
// ------- Menu
// --------------------------------------------------------------------
// Funcion para desplegar el menu


// Capturo la clase del contenedor del menu
let menu = $('.menu');
// Capturo la clase  del menu
let menuCont = $('.menu-cont');
// Capturo la clase del nav
let nav = $('.toolbar-content');
// Capturo el with del menu para luego añadirlo al padding del menu
let widthMenu = menu.css('width');
// capturo el  left en caso de ser el menu fixed
let left = menu.css('left') === '0px' ? '-100%' : '0px';
// Variable para el tiempo de duracion de las animaciones del menu
let time = 300;


// Funcion para la adaptabilidad del menu

$(window).on("load resize",function(){

      widthMenu = menu.css('width');

      if ( $(window).width() >= 1200) {

            // Si es mayor a tablet, el menu se vuelve relativo
            menu.css({
                  'position': 'relative',
                  'left' : '0px'
            })
            menuCont.css({
                  'left' : '0px'
            })
            // Añado el padding-left que posee el nav, el padding-left es deacuerdo al tamaño que posee el menu
            nav.animate({
                  'padding-left': widthMenu
            },time)
      }
      if ($(window).width() < 1200) {

            // Si es meno a web el menu se vuelve fixe
            menu.css({
                  'position': 'fixed'
            })
            // Remuevo el padding-left que posee el nav
            nav.animate({
                  'padding-left': '0px'
            },time)

		// llamo la funcion showMenuFixed para ocultar el menu apenas carge la pagina y la resolucion sea minima a 1200
		showMenuFixed();

            $('html').click(function() {

                  if ( $(window).width() < 1200) {
                        if (menuCont.css('left') === '0px') {
                              showMenuFixed();
                        }
                  }


            })
      }

});

// Funcion para ocultar el menu al darle en cualquier otro elemento que no sea el menu
function showMenuFixed() {
      menu.animate({
            'left': left
      })
      menuCont.animate({
            'left': left
      })
}
function showMenu() {

      let positionElement = menu.css('position');


      if(positionElement == 'fixed')
      {

            // Media actual de una tablet o mayor
            if ( $(window).width() >= 1200) {

                  // vuelvo relativo el menu
                  menu.css('position', 'relative');
                  menu.animate({
                        'left': '0px'
                  },time)
                  menuCont.animate({
                        'left': '0px'
                  },time)
                  // Añado el padding-left deacuerdo al width del menu
                  nav.animate({
                        'padding-left': widthMenu
                  },time)
            }
            // Medida actual inferior a tablet
            else
            {

                  // vuelvo fijo el menu
                  menu.css('position', 'fixed');
                  menu.animate({
                        'left': '0px'
                  },time)
                  menuCont.animate({
                        'left': '0px'
                  },time)
            }


      }
      else
      {
            menu.css('position', 'fixed');
            menu.animate({
                  'left': left
            })
            menuCont.animate({
                  'left': left
            })

            if ( $(window).width() >= 1200) {
                  // Remuevo el padding-left que posee el nav
                  nav.animate({
                        'padding-left': '0px'
                  },time)
            }

      }
}
$(document).ready(function() {


      // evento click para permitir dar click en el menu a la hora de estar en resolucion de movil
      menuCont.click(function(e) {
            e.stopPropagation();
      });


      // Funcion para los desplegables del menu, clase a afectar: "menu-list-dropdown"


      $( '.menu-list-dropdown' ).bind( 'click', function(event)
      {

            // capturo la clase a la cual aplicarle los estilos, esta clase se especifica en:data-ShowItemMenu
            let className = $(this).attr("data-ShowItemMenu")

            // capturo el atributo height que tendra el elemento al ser desplegado
            let heightDeafult = $(this).attr("data-HeightItemMenu")

            // capturo el tamaño actual del elemento indicado por la clase a usar
            let heightElement = $('.'+className).innerHeight();

            if(heightElement > 0)
            {
                  $('.'+className).animate({
                        'height': '0px'
                  })
            }
            else
            {
                  $('.'+className).animate({
                        'height': heightDeafult
                  })
            }
      })
})
