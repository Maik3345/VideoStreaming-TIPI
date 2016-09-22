(function( global )
{
  // --------------------------------------------------------------------
  // ------- Dropdowns
  // --------------------------------------------------------------------

  // Variables

  var attrButton = null;

  var element = null;


  // Funcion para desplegar el contenedor de la informacion
  $(document).on('click', "*[attr-fullscreen]", function(event)
  {
    // Capturo el attr que posee el boton que se clickeo
    attrButton = $(this).attr("attr-fullscreen")

    // Si el attr es diferente a undefined paso a encontrar el drop-down que contenga dicho attr
    if(attrButton != undefined){
      element =  $("*[name-fullscreen="+attrButton+"]")
      // Visualizo el elemento
      showDropdown()
    }
  })

  function showDropdown()
  {
    // Si el elemento no posee la clase, paso a agregarla
    if(!element.find(".iframeStreaming").hasClass("fullscreen-iframe"))
    {
      $("*[name-fullscreen]").fadeOut();
      element.addClass("fullscreen-content")
      element.find(".iframeStreaming").addClass("fullscreen-iframe")
      element.fadeIn();

    }
    // Si el elemento tiene la clase la remuevo
    else
    {
      element.fadeOut();
      $("*[name-fullscreen]").fadeIn();
      element.removeClass("fullscreen-content")
      element.find(".iframeStreaming").removeClass("fullscreen-iframe")
    }
  }
})( this );
