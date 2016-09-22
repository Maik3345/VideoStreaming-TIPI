$(document).ready(function() {
      // --------------------------------------------------------------------
      // ------- Alerts jquery
      // --------------------------------------------------------------------

      // Boton que cerrara la alerta
      let btnAlert = $('.alert-close');

      // Funcion para desplegar el contenedor de la informacion
      btnAlert.bind( 'click', function(event)
      {
            $(this).parent('.alert').fadeOut('slow', function() {
                  $(this).remove()
            });;
      })

});
