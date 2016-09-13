(function( global )
{
      // --------------------------------------------------------------------
      // ------- Dropdowns
      // --------------------------------------------------------------------

      // Variables

      var attrButton = null;

      var element = null;


      // Funcion para desplegar el contenedor de la informacion
      $('*[attr-dropdown]').bind( 'click', function(evetn)
      {
            // Capturo el attr que posee el boton que se clickeo
            attrButton = $(this).attr("attr-dropdown")

            // Si el attr es diferente a undefined paso a encontrar el drop-down que contenga dicho attr
            if(attrButton != undefined){
                  element =  $("*[name-dropdown="+attrButton+"]")
                  // Visualizo el elemento
                  showDropdown()
            }
      })

      function showDropdown()
      {
            // Si el elemento no es visible
            if(!element.is(':visible'))
            {
                  element.fadeIn("fast");

            }
            // Si el elemento es visible lo oculto
            else
            {
                  element.fadeOut("fast");
            }
      }
})( this );
