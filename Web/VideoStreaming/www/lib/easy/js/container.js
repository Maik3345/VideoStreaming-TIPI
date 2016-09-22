$(document).ready(function() {
      // --------------------------------------------------------------------
      // ------- X_Panel jquery
      // --------------------------------------------------------------------

      // Variables

      // Funcion para desplegar el contenedor de la informacion
      $('*[class-content]').bind( 'click', function(event)
      {
            // Capturo el atributo height que tendra el elemento al ser desplegado
            let heightDeafult = $(this).attr("height-content")
            // Capturo el nombre de la clase que tiene el elemento a afectar
            let className = $(this).attr("class-content")

            let containerInfo = $(this).parent('.x-panel-tools').parent('.x-panel-title').parent('.x-panel-cont').children('.'+className);

            if(containerInfo.css('height') === '0px')
            {
                  if(heightDeafult === undefined)
                  {
                        containerInfo.css({'overflow': 'hidden'}).animate({'height':'100%' }, 400)
                  }
                  else {

                        containerInfo.css({'overflow': 'auto'}).animate({'height':heightDeafult }, 400)
                  }
            }
            else {

                  containerInfo.css({'overflow': 'hidden'}).animate({'height': '0px'}, 400)
            }
      })

});
