<?php
//_*Este archivo es un crud que se puede reutilizar, es necesario para su uso correcto, saber que datos son necesarios en cada proceso, y como se deben de mandar estos datos, para saber como mandar correctamente los datos necesarios, revizar el archivo Controlador_Ejemplo_Crud.js , Modulo_Ejemplo_Crud.php y M_Ejemplo_Crud.php
class CRUD extends controller{
	//_*===================CRUD REUTILIZABLE CON PHP Y ANGULAR=================================================
	private $_modeloCrud = null;
	//_*
	//_*Constructor para crear la instancia del modelo
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
		//_* 0- Primero que todo debo poder indicar cual archivo de modelo sera cargado, por eso se ideo la manera de indicar al constructor cual modelo cargar.
		$obj_Data = json_decode( file_get_contents("php://input" ));
		if( !isset( $obj_Data->modelo ) ){
			echo "not found var: modelo";
			exit();
		}
		else
		{
			$modelo = $obj_Data->modelo;
			$this->_modeloCrud = $this->loadModel( $modelo );

		}

	}
	public function crud_Registro()
	{
		//_*Recibo los datos mandados desde angular, y los almaceno en $obj_Data
		//_*
		$obj_Data = json_decode( file_get_contents("php://input") );
		//_*
		//_*Verifico si la variable $obj_Data esta vacia
		if( !isset( $obj_Data ) ){
			//_*No se encontraron datos
			echo 'false';
		}

		//_* Si se han encontrado datos en la variable $obj_Data
		else{
			//_*  1- Capturo el nombre de la funcion del modelo que se va a ejecutar, verifico si esta existe, en caso de no encontrarse retornare false, ya que el proceso siguiente necesita tener claro cual modelo estara llamando.
			//_*
			if( !isset( $obj_Data->fn_Modelo ) ){
				//_*
				//_* No se encontraron datos
				//_*
				echo 'not found var: fn_Modelo';
			}
			else
			{
				//_* Variable que posee el nombre del modelo que se estara llamando.
				//_*
				$fn_Modelo = $obj_Data->fn_Modelo;
				//_*
				//_*  2- Separo los nombres de las variables a usar en el proceso, es importante tenere en cuenta que cada variable debe estar separada por una coma (,) a la hora de mandarla desde angular, estas variables quedaran guardadas en un array, ademas verifico si la variable $obj_parametros existe, si no existe retornare false, ya que el proceso siguiente necesita tenere esta informacion
				if( !isset( $obj_Data->obj_parametros ) ){
					//_* No se encontro la variable
					//_*
					echo 'No se encontro la variable: obj_parametros';
				}
				else
				{
					//_* Variable tipo array que posee en cada posicion el nombre de una variable.
					//_*
					$obj_NombreVar = explode( ",", $obj_Data->obj_parametros );
					//_*
					//_* 3- Creo un array $obj_ValorVar, el cual contendra en cada una de sus posicion el valor de cada variable, esta variable sera la que se mandara al modelo y contendra la informacion que queremos usar.
					//_*
					$obj_ValorVar = array();

					//_* Para iniciar un contador con el cual podre recorrer un array
					//_*
					$pos_Array = 0;
					//_*
					//_* 4- Guardar en $obj_ValorVar los valores de cada una de las variables mandadas desde angular, para realizar esto recorro  $obj_NombreVar el cual contiene los nombres de las variables a usar, y recorro $obj_Data el cual posee los datos recibidos desde angular.
					foreach ($obj_NombreVar as $valor_Primario ) {

						foreach ( $obj_Data as $indice_Secundario => $valor_secundario ) {
							//_* Realizo una comparacion entre un nombre guardado en $obj_NombreVar y el indice de una variable de $obj_Data, la comparacion consiste en saber si hay algun indice  en $obj_Data que concuerde con el nombre de la variable guardada en $obj_NombreVar.
							if($valor_Primario == $indice_Secundario)
							{
								//_* Guardo el valor en $obj_ValorVar la cual sera enviada al modelo, no guardo el indice, guardo el valor,  por eso el segundo foreach usa la segunda forma de crear un foreach: $obj_Data as $indice_Secundario => $valor_secundario, $indice_Secundario para comparar los indices, $valor_secundario para tomar el valor del indice
								$obj_ValorVar[ $pos_Array ] = $valor_secundario;
							}

						}
						//_* Cada vez que se recorre el foreach, incremento $pos_Array, esta variable sera con la que podre guardar en cada una de las posicion de $obj_ValorVar los valores de las variables.
						$pos_Array ++;

					}
					//_*
					//_* 5- Hago uso de la variable $fn_Modelo para poder llamar al modelo solicitado,  y hago uso de la variable $obj_ValorVar para mandar la info a usar en el proceso.
					//_*
					$res_Registro = $this ->_modeloCrud->$fn_Modelo( $obj_ValorVar );

					if($res_Registro){
						echo "true";
					}else{
						echo "false";
					}
				}
			}
		}
	}
	Public function crud_Listar()
	{
		//_* Recibo los datos mandados desde angular, y los almaceno en $obj_Data
		//_*
		$obj_Data = json_decode( file_get_contents("php://input") );
		//_*
		//_* Verifico si la variable $obj_Data esta vacia
		if( !isset( $obj_Data ) ){
			//_* No se encontraron datos
			echo 'false';
		}
		else
		{
			//_*  1- Capturo el nombre de la funcion del modelo que se va a ejecutar, verifico si esta existe, en caso de no encontrarse retornare false, ya que el proceso siguiente necesita tener claro cual modelo estara llamando.
			//_*
			if( !isset( $obj_Data->fn_Modelo ) ){
				//_*
				//_* No se encontraron datos
				//_*
				echo 'No se encontro la variable: fn_Modelo';
			}
			else
			{
				//_* 2- En caso de que la funcion listar halla recibido parametros, ya sea para alguna condicion impuesta al select, verifico si se estan mandando variables para leer, en caso de que se halla mandado obj_parametros paso a un proceso donde separo las variables y  las mando al modelo, en caso de que no se halla mandado, tansolo hago un listar comun
				if( isset( $obj_Data->obj_parametros ) ){
					//_* Variable que posee el nombre del modelo que se estara llamando.
					//_*
					$fn_Modelo = $obj_Data->fn_Modelo;

					//_* Variable tipo array que posee en cada posicion el nombre de una variable.
					//_*
					$obj_NombreVar = explode( ",", $obj_Data->obj_parametros );
					//_*
					//_*  2-0 Creo un array $obj_ValorVar, el cual contendra en cada una de sus posicion el valor de cada variable, esta variable sera la que se mandara al modelo y contendra la informacion que queremos usar.
					//_*
					$obj_ValorVar = array();

					//_* Para iniciar un contador con el cual podre recorrer un array
					//_*
					$pos_Array = 0;
					//_*
					//_* 2-1 Guardar en $obj_ValorVar los valores de cada una de las variables mandadas desde angular, para realizar esto recorro  $obj_NombreVar el cual contiene los nombres de las variables a usar, y recorro $obj_Data el cual posee los datos recibidos desde angular.
					foreach ($obj_NombreVar as $valor_Primario ) {

						foreach ( $obj_Data as $indice_Secundario => $valor_secundario ) {
							//_* Realizo una comparacion entre un nombre guardado en $obj_NombreVar y el indice de una variable de $obj_Data, la comparacion consiste en saber si hay algun indice  en $obj_Data que concuerde con el nombre de la variable guardada en $obj_NombreVar.
							if($valor_Primario == $indice_Secundario)
							{
								//_* Guardo el valor en $obj_ValorVar la cual sera enviada al modelo, no guardo el indice, guardo el valor,  por eso el segundo foreach usa la segunda forma de crear un foreach: $obj_Data as $indice_Secundario => $valor_secundario, $indice_Secundario para comparar los indices, $valor_secundario para tomar el valor del indice
								$obj_ValorVar[ $pos_Array ] = $valor_secundario;
							}

						}
						//_* Cada vez que se recorre el foreach, incremento $pos_Array, esta variable sera con la que podre guardar en cada una de las posicion de $obj_ValorVar los valores de las variables.
						$pos_Array ++;

					}
					//_*
					//_* 2-2 Hago uso de la variable $fn_Modelo para poder llamar al modelo solicitado,  y hago uso de la variable $obj_ValorVar para mandar la info a usar en el proceso.
					//_*
					$Res_Modificacion = $this ->_modeloCrud->$fn_Modelo( $obj_ValorVar );
					echo json_encode( $Res_Modificacion );
				}
				else
				{

					//_* Variable que posee el nombre del modelo que se estara llamando.
					//_*
					$fn_Modelo = $obj_Data->fn_Modelo;
					//_*  3- Hago uso de la variable $fn_Modelo para poder llamar al modelo solicitado,  y hago uso de la variable $obj_ValorVar para mandar la info a usar en el proceso.
					//_*
					$res_Listar = $this->_modeloCrud->$fn_Modelo();
					echo json_encode( $res_Listar );
				}
			}
		}
	}
	Public function crud_Eliminar()
	{
		//_* Recibo los datos mandados desde angular, y los almaceno en $obj_Data
		//_*
		$obj_Data = json_decode( file_get_contents("php://input") );
		//_*
		//_* Verifico si la variable $obj_Data esta vacia
		if( !isset( $obj_Data ) ){
			//_* No se encontraron datos
			echo 'false';
		}

		//_* Si se han encontrado datos en la variable $obj_Data
		else{
			//_*  1- Capturo el nombre de la funcion del modelo que se va a ejecutar, verifico si esta existe, en caso de no encontrarse retornare false, ya que el proceso siguiente necesita tener claro cual modelo estara llamando.
			//_*
			if( !isset( $obj_Data->fn_Modelo ) ){
				//_*
				//_* No se encontraron datos
				//_*
				echo 'No se encontro la variable: fn_Modelo';
			}
			else
			{
				//_* Variable que posee el nombre del modelo que se estara llamando.
				//_*
				$fn_Modelo = $obj_Data->fn_Modelo;
				//_*
				//_*  2- Separo los nombres de las variables a usar en el proceso, es importante tenere en cuenta que cada variable debe estar separada por una coma (,) a la hora de mandarla desde angular, estas variables quedaran guardadas en un array, ademas verifico si la variable $obj_parametros existe, si no existe retornare false, ya que el proceso siguiente necesita tenere esta informacion
				if( !isset( $obj_Data->obj_parametros ) ){
					//_* No se encontro la variable
					//_*
					echo 'No se encontro la variable: obj_parametros';
				}
				else
				{
					//_* Variable tipo array que posee en cada posicion el nombre de una variable.
					//_*
					$obj_NombreVar = explode( ",", $obj_Data->obj_parametros );
					//_*
					//_*  3- Creo un array $obj_ValorVar, el cual contendra en cada una de sus posicion el valor de cada variable, esta variable sera la que se mandara al modelo y contendra la informacion que queremos usar.
					//_*
					$obj_ValorVar = array();

					//_*  Para iniciar un contador con el cual podre recorrer un array
					//_*
					$pos_Array = 0;
					//_*
					//_*  4- Guardar en $obj_ValorVar los valores de cada una de las variables mandadas desde angular, para realizar esto recorro  $obj_NombreVar el cual contiene los nombres de las variables a usar, y recorro $obj_Data el cual posee los datos recibidos desde angular.
					foreach ($obj_NombreVar as $valor_Primario ) {

						foreach ( $obj_Data as $indice_Secundario => $valor_secundario ) {
							//_*  Realizo una comparacion entre un nombre guardado en $obj_NombreVar y el indice de una variable de $obj_Data, la comparacion consiste en saber si hay algun indice  en $obj_Data que concuerde con el nombre de la variable guardada en $obj_NombreVar.
							if($valor_Primario == $indice_Secundario)
							{
								//_*  Guardo el valor en $obj_ValorVar la cual sera enviada al modelo, no guardo el indice, guardo el valor,  por eso el segundo foreach usa la segunda forma de crear un foreach: $obj_Data as $indice_Secundario => $valor_secundario, $indice_Secundario para comparar los indices, $valor_secundario para tomar el valor del indice
								$obj_ValorVar[ $pos_Array ] = $valor_secundario;
							}

						}
						//_*  Cada vez que se recorre el foreach, incremento $pos_Array, esta variable sera con la que podre guardar en cada una de las posicion de $obj_ValorVar los valores de las variables.
						$pos_Array ++;

					}
					//_*
					//_*  5- Hago uso de la variable $fn_Modelo para poder llamar al modelo solicitado,  y hago uso de la variable $obj_ValorVar para mandar la info a usar en el proceso.
					//_*
					$Respuesta_Eliminacion = $this->_modeloCrud->$fn_Modelo( $obj_ValorVar );

					if($Respuesta_Eliminacion){
						echo "true";
					}else{
						echo "false";
					}
				}
			}
		}
	}
	Public function crud_Modificar()
	{
		//_* Recibo los datos mandados desde angular, y los almaceno en $obj_Data
		//_*
		$obj_Data = json_decode( file_get_contents("php://input") );
		//_*
		//_* Verifico si la variable $obj_Data esta vacia
		if( !isset( $obj_Data ) ){
			//_* No se encontraron datos
			echo 'false';
		}

		//_* Si se han encontrado datos en la variable $obj_Data
		else{
			//_*  1- Capturo el nombre de la funcion del modelo que se va a ejecutar, verifico si esta existe, en caso de no encontrarse retornare false, ya que el proceso siguiente necesita tener claro cual modelo estara llamando.
			//_*
			if( !isset( $obj_Data->fn_Modelo ) ){
				//_*
				//_* No se encontraron datos
				//_*
				echo 'No se encontro la variable: fn_Modelo';
			}
			else
			{
				//_* Variable que posee el nombre del modelo que se estara llamando.
				//_*
				$fn_Modelo = $obj_Data->fn_Modelo;
				//_*
				//_*  2- Separo los nombres de las variables a usar en el proceso, es importante tenere en cuenta que cada variable debe estar separada por una coma (,) a la hora de mandarla desde angular, estas variables quedaran guardadas en un array, ademas verifico si la variable $obj_parametros existe, si no existe retornare false, ya que el proceso siguiente necesita tenere esta informacion
				if( !isset( $obj_Data->obj_parametros ) ){
					//_* No se encontro la variable
					//_*
					echo 'No se encontro la variable: obj_parametros';
				}
				else
				{
					//_* Variable tipo array que posee en cada posicion el nombre de una variable.
					//_*
					$obj_NombreVar = explode( ",", $obj_Data->obj_parametros );
					//_*
					//_*  3- Creo un array $obj_ValorVar, el cual contendra en cada una de sus posicion el valor de cada variable, esta variable sera la que se mandara al modelo y contendra la informacion que queremos usar.
					//_*
					$obj_ValorVar = array();

					//_*  Para iniciar un contador con el cual podre recorrer un array
					//_*
					$pos_Array = 0;
					//_*
					//_*  4- Guardar en $obj_ValorVar los valores de cada una de las variables mandadas desde angular, para realizar esto recorro  $obj_NombreVar el cual contiene los nombres de las variables a usar, y recorro $obj_Data el cual posee los datos recibidos desde angular.
					foreach ($obj_NombreVar as $valor_Primario ) {

						foreach ( $obj_Data as $indice_Secundario => $valor_secundario ) {
							//_*  Realizo una comparacion entre un nombre guardado en $obj_NombreVar y el indice de una variable de $obj_Data, la comparacion consiste en saber si hay algun indice  en $obj_Data que concuerde con el nombre de la variable guardada en $obj_NombreVar.
							if($valor_Primario == $indice_Secundario)
							{
								//_*  Guardo el valor en $obj_ValorVar la cual sera enviada al modelo, no guardo el indice, guardo el valor,  por eso el segundo foreach usa la segunda forma de crear un foreach: $obj_Data as $indice_Secundario => $valor_secundario, $indice_Secundario para comparar los indices, $valor_secundario para tomar el valor del indice
								$obj_ValorVar[ $pos_Array ] = $valor_secundario;
							}

						}
						//_*  Cada vez que se recorre el foreach, incremento $pos_Array, esta variable sera con la que podre guardar en cada una de las posicion de $obj_ValorVar los valores de las variables.
						$pos_Array ++;

					}
					//_*
					//_*  5- Hago uso de la variable $fn_Modelo para poder llamar al modelo solicitado,  y hago uso de la variable $obj_ValorVar para mandar la info a usar en el proceso.
					//_*
					$Res_Modificacion = $this ->_modeloCrud->$fn_Modelo( $obj_ValorVar );

					if($Res_Modificacion){
						echo "true";
					}else{
						echo "false";
					}
				}
			}
		}
	}
//*===================CRUD REUTILIZABLE CON PHP Y ANGULAR=================================================
}
?>
