(function( global )
{
      // --------------------------------------------------------------------
      // ------- Modals jquery
      // --------------------------------------------------------------------

      // variable para el elemento modal
      var element = null;
      // variable para capturar el atributo del boton para saber cual modal abrir
      var btnAtrrButton = null;
      // variable paa capturar el atributo del boton para saber si el boton es con el que se puede cerrar el modal
      var btnAttrConfirm  = false;
      // variable para capturar el atributo del tipo de modal
      var Confirm = null;

      // Cuando click el boton
      $('*[modal-attr]').bind( 'click', function(event)
      {

            // Capturo el nombre del atributo que se quiere abrir con el boton
            btnAtrrButton = $(this).attr("modal-attr")

            btnAttrConfirm = $(this).attr("btn-confirm")

            // De esta forma puedo encontrar al elemento que quiero hacer visible, lo guardo en una variable para poder usarlo mas facil
            element =  $(".modal[name-attr="+btnAtrrButton+"]");


            // Validacion para saber si el modal es un modal de confimacion
            // Variable que contiene el dato de el atributo confirm-modal
            Confirm = element.attr('confirm-modal');

            // En caso de ser yes, paso a realizar una confirmacion
            if(Confirm === "yes")
            {
                  // Si el modal esta cerrado, permito desplegarlo
                  if(!element.is(':visible'))
                  {
                        showModal();
                  }
                  else if(btnAttrConfirm != "true")
                  {
                        if (element.children('.modal-inner').hasClass('confirm-modal'))
                        {
                              element.children('.modal-inner').removeClass('confirm-modal')
                        }
                        else
                        {
                              element.children('.modal-inner').addClass('confirm-modal')

                        }
                  }
                  else
                  {
                        showModal();
                  }
            }
            // Si no, muestro el modal o lo oculto
            else
            {
                  showModal();
            }
      })


      // Funcion
      function showModal()
      {
            if(!element.is(':visible'))
            {

                  element.children('.close-modal').fadeIn();
                  element.children('.modal-inner').css({
                        'top': '-1000px'
                  })
                  element.children('.modal-inner').animate({
                        'top': '60px'
                  })
                  element.css({"display": "flex"})

			$('body').css({"overflow":"hidden"})
            }
            else
            {
                  element.fadeOut("fast");
                  element.children('.close-modal').fadeOut();
                  element.children('.modal-inner').animate({
                        'top': '-1000px'
                  })
			$('body').css({"overflow":"scroll"})
            }
      }

})( this );
