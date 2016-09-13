
app.factory('Fabrica', function ($http, $q) {
  var servicio =
  {
    objeto:
    {

      // fn_Modelo: funcion a ejecutar del modelo php
      // modelo: nombre de la clase del modelo de php
      fn_Consultar: function ( obj_Data, url)
      {
        var defered = $q.defer();
        var promise = defered.promise;
        // variable donde se indica el modelo  y la funcion a ejecutar
        var obj_Data = obj_Data;
        // peticion post
        $http.post(url, obj_Data )
        .success(function ( respuesta ) {
          var res_peticion = ( respuesta );
          if( res_peticion != 'not found var: fn_Modelo' && res_peticion != 'not found var: modelo' )
          {
            defered.resolve(respuesta);
          }
          else
          {
            console.log( respuesta, 100, 'Error' );
          }

        })
        .error(function ( respuesta, status ) {
          console.log('error', respuesta, status );
        });
        return promise;
      },


      // fn_Modelo: funcion a ejecutar del modelo php
      // modelo: nombre de la clase del modelo de php
      fn_Modificar: function ( obj_Data, url)
      {
        var defered = $q.defer();
        var promise = defered.promise;
        // variable donde se indica el modelo  y la funcion a ejecutar
        var obj_Data = obj_Data;
        // peticion post
        $http.post(url, obj_Data )
        .success(function ( respuesta ) {
          var res_peticion = ( respuesta );
          if( res_peticion != 'not found var: fn_Modelo' && res_peticion != 'not found var: modelo' )
          {
            defered.resolve(respuesta);
          }
          else
          {
            console.log( respuesta, 100, 'Error' );
          }

        })
        .error(function ( respuesta, status ) {
          console.log('error', respuesta, status );
        });
        return promise;
      }

    }
  }
  return servicio;
});
