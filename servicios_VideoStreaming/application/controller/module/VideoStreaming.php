<?php
class VideoStreaming extends controller{

  private $_mdl_str = null;

  public function __construct()
  {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    $method = $_SERVER['REQUEST_METHOD'];
    if($method == "OPTIONS") {
      die();
    }
    parent::__construct();
    $this->_mdl_str = $this->loadModel('modelo_Agentes');
  }
  // Funcion para conectar a los dos usuarios
  public function videoStreaming_Conect()
  {
    $obj_Data = json_decode( file_get_contents("php://input" ));

    if (!isset($obj_Data)){
      echo 'no data found in controller videostreaming';
    }else{

      // Debo de recibir:
      // PK_ID_Usuario: pk_id_usuario
      // ID_Agente: id_agente
      //
      // debo de generar:
      // LINK(url_movil): es el link generado para la transmision, este link lo debo de actualizar en la tabla tbl_dll_usuario_link.
      //
      // debo cambiar:
      // Estado: el estado de la camara debe de cambiar en caso de generarse una conexion entre los usuarios


      // datos recibidos por la peticion
      $pk_id_usuario = $obj_Data->pk_id_usuario;
      $id_agente = $obj_Data->id_agente;
      $pk_id_link = $obj_Data->pk_id_link;


      //**************** GENERACION DEL LINK PARA LA TRANSMISION

      $sala = rand(1000000000,9999999999);
      $objectUrl = new stdClass();
      $objectUrl->url = "http://apprtc.ingeneo.co/r/".$sala;

      // url para el movil
      $url_movil = json_encode($objectUrl);
      // url para guardar en la BD
      $url_web = "http://apprtc.ingeneo.co/r/".$sala."?video=false&audio=false";

      // llamo la funcion del Modelo_Agentes
      $resultado = $this->_mdl_str->fn_actualizar_link( $pk_id_usuario,$pk_id_link,$id_agente,$url_web );


      // si la actualizacion de los datos de la Tbl_Links fue correcta, retorno la url_movil con la que el app iniciara la transmision
      if ( $resultado ){
        echo $url_movil;
      }
      else {
        echo "false";
      }
    }

  }


}
?>
