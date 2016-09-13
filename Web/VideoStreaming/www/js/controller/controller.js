(function () {
  'use strict';

  function videoStreaming($scope, $http, $window, $timeout, Fabrica, $q,$localStorage,$sessionStorage, $sce)
  {
    // Variable para almacenar los diferente equipos conectados
    $scope.agentes = [];
    // Variable para almacenar el equipo seleccionado
    $scope.selectAgent =
    {
      Nombre_Agente: "Seleccione un agente"
    };
    // variable para la lista de camaras
    $scope.listCamaras = [];
    // variable donde almaceno los datos del usuario
    $scope.datosUsuario = [];

    // Para verificar si hay una sesion inciada
    $scope.verificarSesion = function()
    {

      if(window.location.href == "http://vega:8282/videostreaming/Web/VideoStreaming/" || window.location.href == "http://vega:8282/videostreaming/Web/VideoStreaming/www/templates/streaming.html" )
      {

        // Si la variable datosUsuario no esta definida, significa que no hay sesion iniciada
        if($localStorage.datosUsuario == undefined)
        {
          // Si la direccion actual es diferente a la de login Redirecciono a la pagina login
          if(window.location.href != "http://vega:8282/videostreaming/Web/VideoStreaming/" )
          {

            // Redirecciono a la pagina principal
            window.location.assign("http://vega:8282/videostreaming/Web/VideoStreaming/")
          }
          //
        }
        else
        {
          // Si la pestaña actual es videoStreaming tansolo ejecuto las funciones
          if(window.location.href == "http://vega:8282/videostreaming/Web/VideoStreaming/www/templates/streaming.html" )
          {
            $scope.datosUsuario = $localStorage.datosUsuario;
            $scope.fn_Consultar_Agentes();
            $scope.fn_Consultar_Links()

          }
          else {
            // Si es la pagina de login, redirecciono a la pagina VideoStreaming
            window.location.assign("http://vega:8282/videostreaming/Web/VideoStreaming/www/templates/streaming.html")

          }
        }
      }

    }

    $scope.cerrarSesion = function( )
    {
      delete $localStorage.datosUsuario
      window.location.reload();
    }
    // Inciar sesion
    $scope.incioSesion = function( data )
    {
      // Armo los datos necesarios para ejecutar la funcion consultar
      var obj_Data =
      {
        fn_Modelo: "fn_Iniciar_Sesion",
        modelo: "modelo_Agentes",
        obj_parametros: "Nombre_Usuario,Contrasenia",
        Nombre_Usuario: data.Nombre_Usuario,
        Contrasenia: data.Contrasenia
      }
      // url para la petición
      var url = 'http://vega:8282/videostreaming/servicios_VideoStreaming/module/CRUD/crud_Listar';
      // Ejecuto la funcion consultar
      $scope.factory.fn_Consultar( obj_Data, url ).then(function (res){
        var Respuesta = res;
        if( Respuesta != 'false')
        {
          // $scope.createNotify('Inicio correcto','Datos verificados','100','succes-notification')
          $localStorage.datosUsuario = Respuesta;
          // console.log(Respuesta)
          window.location.reload();
        }
        else if ( Respuesta == 'false') {
          $scope.createNotify('Datos incorrectos','Error al iniciar','100','info-notification')
        }
        else
        {
          console.log("Error al validar"+ Respuesta)
        }
      });
    }
    // Listar todos los agentes registrados
    $scope.fn_Consultar_Agentes = function()
    {
      $scope.selectAgent =
      {
        Nombre_Agente: "Seleccione un agente"
      };
      // console.log($scope.datosUsuario);
      // Armo los datos necesarios para ejecutar la funcion consultar
      var obj_Data =
      {
        fn_Modelo: "fn_Consultar_Agentes",
        modelo: "modelo_Agentes",
        obj_parametros: "Nombre_Usuario",
        Nombre_Usuario: $scope.datosUsuario[0].Nombre_Usuario
      }
      // url para la petición
      var url = 'http://vega:8282/videostreaming/servicios_VideoStreaming/module/CRUD/crud_Listar';
      // Ejecuto la funcion consultar
      $scope.factory.fn_Consultar( obj_Data, url ).then(function (res){
        $scope.agentes = res
      });
    }
    // Listar todos los agentes registrados
    $scope.fn_Consultar_Links = function()
    {
      // Armo los datos necesarios para ejecutar la funcion consultar
      var obj_Data =
      {
        fn_Modelo: "fn_Consultar_Links",
        modelo: "modelo_Agentes",
        obj_parametros: "PK_ID_Usuario",
        PK_ID_Usuario: $scope.datosUsuario[0].PK_ID_Usuario
      }
      // url para la peticion
      var url = 'http://vega:8282/videostreaming/servicios_VideoStreaming/module/CRUD/crud_Listar';
      // Ejecuto la funcion consultar
      $scope.factory.fn_Consultar( obj_Data, url ).then(function (res){
        $scope.listCamaras = res;
        for (var i = 0; i < $scope.listCamaras.length; i++) {
          var temp_Link = $sce.trustAsResourceUrl($scope.listCamaras[i].LINK)
          $scope.listCamaras[i].LINK = temp_Link;
          $scope.reloadIframe($scope.listCamaras[i].PK_ID_Link)
        }
      });
    }

    // funcion para seleccionar una camara de la lista de camaras en el modal.
    $scope.selectCam = function ( index, pk_id_link )
    {
      for (var i = 0; i < $scope.listCamaras.length; i++) {
        $scope.listCamaras[i].select = false
      }
      $scope.listCamaras[index].select = true
      // capturo el id de la camara y lo guardo en pk_id_link para luego enviar la notificacion cuando se precion aceptar
      $scope.pk_id_link = pk_id_link

    }
    // Funcion para enviar una notificacion, recibe el token al cual se le estara enviando la notificacion
    // pk_id_link: id de la camara seleccionada
    $scope.pk_id_link = '';
    $scope.pushNotification = function ( data ) {


      for (var i = 0; i < $scope.listCamaras.length; i++) {
        if($scope.listCamaras[i].PK_ID_Link == $scope.pk_id_link)
        {
          if($scope.listCamaras[i].Estado == "Disponible")
          {
            // No tengo permitido enviar la notificacion para finalizar transmision
            $scope.estado_link = true;
          }
          else {
            // Tengo permitod enviar notificacion para finalizar transmision
            $scope.estado_link = false;
          }

        }
      }

      if( $scope.estado_link )
      {
        // data: posee el id de la camara que se selecciono en el modal de seleccion de camara
        // Armo la petición
        var req = {
          method: 'POST',
          url: 'https://api.ionic.io/push/notifications',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2YzE2ZWMzNS1iZTcwLTQwNmYtYWQ2My00OTQ1ZmQ3MmQxZmIifQ.qKOooEczSXw25mJl_SfV4fDu3hjm4N-5Hd_b9lmaKm8'
          },
          data:{
            "tokens": $scope.selectAgent.Token_Dispositivo,
            "profile": "videostreamingtipi",
            "notification": {
              "title": "Iniciando transmisión, Streaming Tipi",
              "android":{
                "data": {
                  "title": "Streaming Tipi",
                  "message": "",
                  "content-available": "1",
                  "sound":"silence.aif",
                  "vibrate":false
                },
                "payload": {
                  "pk_id_link": $scope.pk_id_link,
                  "closeApp": false,
                  "pk_id_usuario":$scope.datosUsuario[0].PK_ID_Usuario,
                  "id_agente":$scope.selectAgent.PK_ID_Agente
                }
              }
            }
          }
        };
        // Ejecuto la peticion
        $http(req).success(function(resp){
          // console.log('Push response: '+resp);
          $scope.createNotify('Se ha enviado correctamente la notificación','Notificación enviada ','100','succes-notification')
          // Cuando se envie la notification, se actualiza el iframe seleccionado
          $scope.reloadIframe($scope.pk_id_link);
          $scope.fn_Consultar_Agentes();
        }).error(function(error){
          // Handle error
          // console.log(error);
          $scope.createNotify('','Error al enviar la notificación ','100','info-notification')
        });
      }
      else {
        $scope.createNotify('La camara actualmente se encuentra ocupada','Camara','100','info-notification')
      }
    }

    $scope.pushNotificationCloseAgente = function ( index )
    {
      var token = '';
      var id_agente = '';
      console.log(index)
      console.log($scope.agentes[index])

          token = $scope.agentes[index].Token_Dispositivo;
          id_agente = $scope.agentes[index].PK_ID_Agente;

          console.log(token)
          console.log(id_agente)

      // Luego de obtener los datos del agente seleccionado, paso a actualizar primero su estado en la BD
      // armo los datos para la nueva peticion
      var obj_Data =
      {
        fn_Modelo: "fn_Actualizar_EstadoAgente",
        modelo: "modelo_Agentes",
        obj_parametros: "Estado,id_agente",
        id_agente: id_agente,
        Estado: "Desconectado"

      }
      // url de la petición
      var url = 'http://vega:8282/videostreaming/servicios_VideoStreaming/module/CRUD/crud_Modificar';
      // Ejecuto la funcion modifiar para cambiar el estado del agene al que se le quiere finalizar la transmision, para ello uso el PK_ID_Agente que se obtubo cuando cosulte el token del usuario que tiene asociada la camara.
      $scope.factory.fn_Modificar( obj_Data, url ).then(function (res){

        if(res == 'true')
        {
          // Armo la petición para generar la notificacion
          var req = {
            method: 'POST',
            url: 'https://api.ionic.io/push/notifications',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2YzE2ZWMzNS1iZTcwLTQwNmYtYWQ2My00OTQ1ZmQ3MmQxZmIifQ.qKOooEczSXw25mJl_SfV4fDu3hjm4N-5Hd_b9lmaKm8'
            },
            data:{
              "tokens": token,
              "profile": "videostreamingtipi",
              "notification": {
                "title": "Transmisión finalizada, Streaming Tipi.",
                "android":{
                  "data": {
                    "title": "Streaming Tipi",
                    "message": "",
                    "content-available": "1",
                    "sound":"silence.aif",
                    "vibrate":false
                  },
                  "payload": {
                    "closeApp": true
                  }
                }
              }
            }
          };
          // Ejecuto la peticion
          $http(req).success(function(resp){
            // console.log(resp);
            $scope.createNotify('Se ha enviado la solicitud para finalizar la transmisión','Transmisión finalizada ','100','succes-notification')

            // Recargo la lista de agentes y los links de las camaras
            $scope.fn_Consultar_Agentes();
            $scope.fn_Consultar_Links();
          }).error(function(error){
            // Handle error
            // console.log(error);
            $scope.createNotify('','Error al enviar la notificación ','100','info-notification')

          });
        }
        else {
          // console.log(error);
          $scope.createNotify('','Error al finalizar la transmision ','100','info-notification')
        }
      })
    }
    $scope.estado_link = false;
    // Funcion para cerrar la sesion entre los usuarios
    $scope.pushNotificationClose = function (id_Link) {

      // Antes de realizar la peticion para obtener el token, verifico si la camara seleccionada, no esta Disponible, en caso de estar disponible significa que no hay nadie conectada a ella y por eso no se mandaria la notificacion, en casi de no estar disponible, paso a verificar en la BD el token del usuario conectado para finalizar la transmision.

      for (var i = 0; i < $scope.listCamaras.length; i++) {
        if($scope.listCamaras[i].PK_ID_Link == id_Link)
        {
          if($scope.listCamaras[i].Estado == "Disponible")
          {
            // No tengo permitido enviar la notificacion para finalizar transmision
            $scope.estado_link = false;
          }
          else {
            // Tengo permitod enviar notificacion para finalizar transmision
            $scope.estado_link = true;
          }

        }
      }

      if( $scope.estado_link )
      {
        // Armo los datos necesarios para ejecutar la funcion consultar, al funcion me retornara el token del usuario que tiene actualmente la camara asignada
        var obj_Data =
        {
          fn_Modelo: "fn_Consultar_token_usuario_camara",
          modelo: "modelo_Agentes",
          obj_parametros: "id_camara",
          id_camara: id_Link

        }
        // url de la petición
        var url = 'http://vega:8282/videostreaming/servicios_VideoStreaming/module/CRUD/crud_Listar';
        // Ejecuto la funcion consultar
        $scope.factory.fn_Consultar( obj_Data, url ).then(function (res){
          $scope.token = res[0].Token_Dispositivo;
          $scope.id_agente = res[0].PK_ID_Agente;

          console.log($scope.id_agente)

          // armo los datos para la nueva peticion
          var obj_Data =
          {
            fn_Modelo: "fn_Actualizar_EstadoAgente",
            modelo: "modelo_Agentes",
            obj_parametros: "Estado,id_agente",
            id_agente: $scope.id_agente,
            Estado: "Desconectado"

          }
          // url de la petición
          var url = 'http://vega:8282/videostreaming/servicios_VideoStreaming/module/CRUD/crud_Modificar';
          // Ejecuto la funcion modifiar para cambiar el estado del agene al que se le quiere finalizar la transmision, para ello uso el PK_ID_Agente que se obtubo cuando cosulte el token del usuario que tiene asociada la camara.
          $scope.factory.fn_Modificar( obj_Data, url ).then(function (res){

            // Si la modifcacion es exitosa, puedo enviar la notificacion
            if(res == 'true')
            {
              // Armo la petición para generar la notificacion
              var req = {
                method: 'POST',
                url: 'https://api.ionic.io/push/notifications',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2YzE2ZWMzNS1iZTcwLTQwNmYtYWQ2My00OTQ1ZmQ3MmQxZmIifQ.qKOooEczSXw25mJl_SfV4fDu3hjm4N-5Hd_b9lmaKm8'
                },
                data:{
                  "tokens": $scope.token,
                  "profile": "videostreamingtipi",
                  "notification": {
                    "title": "Transmisión finalizada, Streaming Tipi.",
                    "android":{
                      "data": {
                        "title": "Streaming Tipi",
                        "message": "",
                        "content-available": "1",
                        "sound":"silence.aif",
                        "vibrate":false
                      },
                      "payload": {
                        "closeApp": true
                      }
                    }
                  }
                }
              };
              // Ejecuto la peticion
              $http(req).success(function(resp){
                // console.log(resp);
                $scope.createNotify('Se ha enviado la solicitud para finalizar la transmisión','Transmisión finalizada ','100','succes-notification')
                // Recargo la lista de agentes y los links de las camaras
                $scope.fn_Consultar_Agentes();
                $scope.fn_Consultar_Links();
              }).error(function(error){
                // Handle error
                // console.log(error);
                $scope.createNotify('','Error al enviar la notificación ','100','info-notification')

              });
              // Armo la petición
            }
            else {
              // console.log(error);
              $scope.createNotify('','Error al finalizar la transmision ','100','info-notification')
            }
          });
        })
      }
      else {
        $scope.createNotify('La camara actualmente no se encuentra ocupada','Camara','100','info-notification')
      }
    }
    // Funcion para permitir selecionar uno delos agentes.
    $scope.selecAgent = function ( datosAgentes, agentPosicion )
    {
      $scope.selectAgent = datosAgentes;
      // Restauro la variable de seleccion
      for (var i = 0; i < $scope.agentes.length; i++) {
        $scope.agentes[i].seleccionado = false;
      }
      // Cambio el estado de la variable que permite saber si el agente fue seleccionado
      $scope.agentes[agentPosicion].seleccionado = true;
    }

    // Funcion para remover un agente ya seleccionado
    $scope.removAgent = function ()
    {
      $scope.selectAgent =
      {
        Nombre_Agente: "Seleccione un agente"
      };
      // Vuelvo a false la variable que me sirve para saber si el agente esta seleccionado
      for (var i = 0; i < $scope.agentes.length; i++) {
        $scope.agentes[i].seleccionado = false;
      }
    }
    $scope.reloadIframe = function ( pk_id )
    {
      // Recargo los iframe de la pagina
      $('#'+pk_id,window.parent.document).attr('src',$('#'+pk_id,window.parent.document).attr('src'));
      // $timeout(function() {
      //   $window.location.reload();
      // }, 4000);
      //$window.location.reload();

    }



    //- Notificaciones con angular.js

    $scope.objNotify = [];
    let notifyCreate = false;
    $scope.createNotify = function (menssageNotify, tituloNotificacion,tiempoNotificacion,tipoNotify)
    {
      let permitidoCrearNotificacion = false, mensajeYaCreado = false;
      let Mensajes_Alerta =
      {
        menssageNotify: menssageNotify,
        tituloNotificacion: tituloNotificacion,
        tipoNotify: tipoNotify,
        visibilidadNotify: false
      };
      //_*Si el objeto de mensajes esta vacio puedo crear el mensaje sin ningun problema, pero si el objeto esta lleno paso a verificar si la notificacion a mostrar ya se encuentra en el objeto, esto lo realizo recorriendo .objNotify y buscando posicion por posicion para buscar el mensaje, si se encuentra el mensaje, cambio permitidoCrearNotificacion a false con lo que no se creara el mensaje, si no se encuentra el mensaje cambio permitidoCrearNotificacion  a true con lo que pasara al condicional que verifica si permitidoCrearNotificacion es true y asi genero el nuevo mensaje, esta validacion se hace para no tener mas de una notificacion igual


      if($scope.objNotify.length)
      {
        //_* el objeto ya posee notificaciones asi que paso a buscar alguna notifiacion igual a la que se desea crear para asi borrarla y volverla a crear
        for (let i = 0; i < $scope.objNotify.length; i++) {
          if($scope.objNotify[i].menssageNotify == menssageNotify &&
            $scope.objNotify[i].tituloNotificacion == tituloNotificacion &&
            $scope.objNotify[i].visibilidadNotify === true &&
            $scope.objNotify[i].tipoNotify == tipoNotify)
            {

              //_*Elimino el mensaje encontrado y luego paso a generar un nuevo para asi dar un toque mas agradabele a el mensaje
              $scope.objNotify[i].visibilidadNotify = false;
              $scope.objNotify.splice(i,1);
              mensajeYaCreado = true;
            }
            else
            {
              mensajeYaCreado = true;
            }
          }
          if( mensajeYaCreado )
          {
            permitidoCrearNotificacion = true;
          }
        }
        else
        {
          permitidoCrearNotificacion = true;
        }
        //_* el objeto de notificaciones esta vacio y puedo crear una nueva notificacion.
        if( permitidoCrearNotificacion )
        {
          $scope.objNotify.push(Mensajes_Alerta);
          $timeout( $scope.createMessage, tiempoNotificacion);
        }
        // Si el booleano es false se entiende que no hay notificaciones creadas, esto se hace para que el llamado a la funcion cerrar_notificacion no se repita cada vez que se cree una notificacion y asi se obtiene un solo llamado aunque se creen varias notificaciones.
        if( !notifyCreate )
        {
          $timeout($scope.closeNotify, 10000);
        }

      };
      $scope.createMessage = function () {
        for (let i = 0; i < $scope.objNotify.length; i++) {
          //booleano que sera el que permita visualizar la notificacion
          $scope.objNotify[i].visibilidadNotify = true;
        }

        //booleano que indicara si ya hay alguna notificacion creada, al ser true se entiende que una notificacion fue creada.
        notifyCreate = true;

      };
      $scope.closeNotify =  function () {

        if( $scope.objNotify.length )
        {
          $timeout($scope.closeNotify, 10000);
          $scope.objNotify.splice(0,1);
        }
        else
        {
          // una vez que no se encuentren notificaciones, volvemos a poner en false la variable que indicara que no hay notificaciones creadas aun.
          notifyCreate = false;
        }
      };
      // Funcion para cerrrar una notificacion en especifica
      $scope.closeSpecificNotifications = function (Posicion) {
        $scope.objNotify.splice(Posicion,1);
      }
      //- Notificaciones con angular.js

      // Instancia de la fabrica
      $scope.factory = Fabrica.objeto;
    }
    app.controller( 'videoStreaming', videoStreaming);
  })();
