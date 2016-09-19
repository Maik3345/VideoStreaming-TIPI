angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$ionicPush,$state,$cordovaInAppBrowser,$http,$timeout,$ionicPlatform) {

  // --------------------------------------------------------------------
  // ------- Notificaciones push ionic
  // --------------------------------------------------------------------
  $scope.token_dispositivo = '';
  var push = new Ionic.Push({
    "debug": true,
    'pluginConfig': {
      'android': {
        'senderID': '1091862388565',
        'iconColor': '#343434'
      }
    },
    // Cuando llegue la notificacion.
    "onNotification": function(notification) {
      // Ejecuto la funcion reunion para inciar la llamada.
      $scope.reunion(notification.payload.pk_id_link, notification.payload.closeApp, notification.payload.id_agente, notification.payload.pk_id_usuario);
    },
    "onRegister": function(data) {
      // Imprimo token generado o obtenido para el dispositivo.
      console.log("Token del dispositivo:"+data.token);
      $scope.token_dispositivo = data.token
    }
  });
  push.register(function(token) {
    // Imprimo token generado o obtenido para el dispositivo.
    console.log("Token del dispositivo:",token.token);
    push.saveToken(token);
  });

  // --------------------------------------------------------------------
  // ------- VideoStreaming TIPI
  // --------------------------------------------------------------------

  //$scope.link="https://appr.tc/r/7715699788889";

  // pk_id_link: para indicar el id de la camara.
  // closeApp: booleano que indica por medio de la notification, si se quiere finalizar la transmision.
  // id_agente: valor numerico, indica el numero de la camara, esta se pasa a php para que en la web se pueda saber cual camara tomar para sacar el token y luego enviar la notificacion cancelar.
  $scope.reunion = function(pk_id_link,closeApp,id_agente,pk_id_usuario){

    // si closeApp viene en true, se cerrara la transmision del navegador.

    // console.log("pk_id_link de la camara: "+pk_id_link);
    // console.log("Se finalizara la transmision:"+closeApp)
    // console.log("id_agente del agente conectado a la camara:"+id_agente)
    // console.log("pk_id_usuario del usuario solicitando transmision desde la camara:"+pk_id_usuario);
    //

    if(!closeApp)
    {

      // Preparo datos para la peticicon
      var obj_Data = {
        pk_id_link: pk_id_link,
        id_agente: id_agente,
        pk_id_usuario: pk_id_usuario
      };
      $http.post('http://vegacontenedor3.ingeneo.co/videostreaming/servicios_VideoStreaming/module/VideoStreaming/videoStreaming_Conect',obj_Data)
      .success(function ( respuesta ) {

        var res_peticion = ( respuesta );
        // console.log(res_peticion)
        $scope.link= res_peticion.url;
        window.open($scope.link, "_system");

        // send(JSON.stringify({Funcion: "cambiar_EstadoAgente"}));
      }).error(function ( respuesta, status ) {
        console.log('error', respuesta, status );
      });
    }
    // cierro transmision.
    else {
      window.open('', "_system");
      window.close();
    }
  }


  // --------------------------------------------------------------------
  // ------- listen SpeechRecognition
  // --------------------------------------------------------------------

  // Codigo necesario
  $scope.textoObtenido = '';
  // Comando, booleando utilizado para saber en que momento se ingreso un comando, si se ha ingresado el comando, se detendra el ciclo de reconocimiento de voz.
  $scope.comando = false;
  // variable donde declaro el tiempo que se demore la funcion que se encargar de limpiar la variable textoObtenido.
  $scope.timeClearTextoObtenido = 10000;
  //  variable donde declaro el tiempo que se demora la function recordUpdate, la cual se encarga de crear el ciclo de ejecucion de SpeechRecognition.
  $scope.TimeUpdateRecordUpdate = 3000;
  // variable donde declaro el tiempo que se demora la funcion que se encarga de abortar la escucha de audio, esto se hace para no esperar a que finalice el listener del SpeechRecognition.
  $scope.TimeAbortListen = 6000;
  // Variable utilizada para saber en el momento de ejecutar la funcion recordUpdate, si debo de finalizar o inicar el siclo
  $scope.executeFunction = true;

  // addEventListener para cuando se inicie la app, siempre tener la variable comando = false, para asi permitir el ciclo de SpeechRecognition.
  document.addEventListener("deviceready", function() {
    $scope.comando = false;
  }, false);


  // Funcion que sirve para crear el ciclo de reconocimiento de voz.
  $scope.recordUpdate = function(executeFunction)
  {
    // Si executeFunction es true, voy a permitir realizar el ciclo
    if(executeFunction)
    {
      $timeout(function() {
        $scope.record();
      }, $scope.TimeUpdateRecordUpdate)
    }
  }
  // Esta funcion es la que se emple para el reconocimiento de voz.
  $scope.record = function() {

    // Si executeFunction es true, podre ejecutar el proceso
    if($scope.executeFunction)
    {
      // variable que almacena el texto obtenido por el reconocimiento de voz.
      var recognition = new SpeechRecognition();
      // Proceso para capturar lo pronunciado y guardarlo en la variable textoObtenido.
      recognition.onresult = function(event) {
        if (event.results.length > 0) {
          $scope.textoObtenido = event.results[0][0].transcript;
          $scope.$apply()
          // Comando para deteccion de voz.
          if($scope.textoObtenido == '885')
          {
            // console.log("Comando ingresado")
            $scope.comando = true;
            // Finalizo reconocimiento de voz
            $scope.finReconocimiento();
            // Inicio transmision.
            $scope.reunion('videoStreaming1.php',false,1)
          }
        }
      }


      // Evento que se ejecuta cuando la deteccion de audio finalice.
      recognition.onend = function()
      {
        // Si se ha ingresado un comando, no se ejecuta esta funcion, ademas si executeFunction no es true, no se podra tambien ejecutar la funcion
        if( !$scope.comando && $scope.executeFunction)
        {
          navigator.vibrate(500);

          // Si la variable textoObtenido no posee texto, permito realizar la funcion recordUpdate para seguir escuchando.
          if($scope.textoObtenido == '')
          {

            // console.log("Desconectando servicio")
            $scope.recordUpdate($scope.executeFunction);
          }

          // Luego de cierto tiempo se verifica, si la variable textoObtenido es diferente a vacio, en caso de no estar vacia paso a limpiar el valor y a reiniciar el ciclo de reconocimiento de voz.
          $timeout(function() {
            if($scope.textoObtenido != '')
            {
              // console.log("Inciando servicio")
              $scope.textoObtenido = '';

              $scope.recordUpdate($scope.executeFunction);
            }
          }, $scope.timeClearTextoObtenido)
        }
        //
      }
    };
    // Cada cierto tiempo ejecuto esta funcion, lo que se encarga es de no dejar el SpeechRecognition escuchando mucho tiempo, apresura la finalizacion de la tarea escuchar y reinica la deteccion.
    $timeout(function() {
      if($scope.textoObtenido == '')
      {
        recognition.abort();
        // console.log("Cancelando reconocimiento")
      }
      else if($scope.textoObtenido == '885')
      {
        // console.log("Comando ingresado")
        $scope.comando = true;
        recognition.abort();
        // Inicio transmision.
        $scope.reunion('videoStreaming1.php',false,1)
      }
    }, $scope.TimeAbortListen)

    // Configuraciones para el idioma.
    recognition.lang = "es-ES";
    recognition.start();
  }

  // Ejecuto la funcion para iniciar el ciclo.
  // $scope.recordUpdate();

  // Ejecutar la funcion listener al presionar la tecla volumen mermar audio

  // document.addEventListener("volumedownbutton", finReconocimiento, false);
  //
  // $scope.finReconocimiento = function() {
  //   $scope.executeFunction = false;
  //   $scope.textoObtenido = '';
  //   $scope.recordUpdate($scope.executeFunction);
  //   navigator.vibrate(1000);
  //   // console.log("Ejecutando funcion iniReconocimiento");
  // }
  function  finReconocimiento(){
    $scope.executeFunction = false;
    $scope.textoObtenido = '';
    $scope.recordUpdate($scope.executeFunction);
    navigator.vibrate(1000);
    // console.log("Ejecutando funcion iniReconocimiento");
  }

  // Ejecutar la funcion listener al presionar la tecla volumen subir audio
  document.addEventListener("volumedownbutton", iniReconocimiento, false);
  $scope.Tipo = false;
  function iniReconocimiento() {

    $scope.Tipo =! $scope.Tipo;
    if($scope.Tipo)
    {
      $scope.executeFunction = true;
      $scope.recordUpdate($scope.executeFunction);
      $state.go('tab.listen');
      // console.log("Ejecutando funcion finReconocimiento");
    }
    if(!$scope.Tipo)
    {
      $scope.executeFunction = false;
      $scope.textoObtenido = '';
      $scope.recordUpdate($scope.executeFunction);
      navigator.vibrate(1000);
      // console.log("Ejecutando funcion iniReconocimiento");
    }
  }

  $scope.iniReconocimiento = function() {
    $scope.executeFunction = true;
    $scope.recordUpdate($scope.executeFunction);
    $state.go('tab.listen');
    // console.log("Ejecutando funcion finReconocimiento");
  }

  // Ejecutar la funcion  al presionar la tecla volumen subir audio
  document.addEventListener("volumeupbutton", openStreaming, false);
  function openStreaming() {
    // Preparo datos para la peticicon
      var obj_Data = {
        fn_Modelo: "fn_agente_solicitando_transmision",
        modelo: "modelo_Agentes",
        obj_parametros: "token",
        token: $scope.token_dispositivo
      };
      
    $http.post('http://vegacontenedor3.ingeneo.co/videostreaming/servicios_VideoStreaming/module/CRUD/crud_modificar',obj_Data)
      .success(function ( respuesta ) {

        var res_peticion = ( respuesta );
        // console.log(res_peticion)
        console.log("La solicitud ha sido enviada")

        // send(JSON.stringify({Funcion: "cambiar_EstadoAgente"}));
      }).error(function ( respuesta, status ) {
        console.log('error', respuesta, status );
      });
  }
  $scope.openStreaming = function ()
  {
    // Inicio transmision.
    $scope.reunion('videoStreaming1.php',false,1);
  }

  // $ionicPlatform.registerBackButtonAction(function (event) {
  //
  //   alert("button back");
  // }, 100);



})
