<?php

class modelo_Agentes{
	
	
	
	/**  * @param $db  objeto de la conección a la DB que recibe cuando se ejecuta la instancia.  */
	
	function __construct($db) {
		
		try {
			
			$this->db = $db;
			
		}
		catch (PDOException $e) {
			
			exit('Error al intentar conectar con la Base de Datos en Modelo_Agentes:' + $e);
			
		}
		
	}
	
	
	public function fn_Consultar_Agentes( $obj_parametros ) {
		
		
		$sql = "CALL `spListar_Agentes`(?);";
		
		$query = $this->db->prepare($sql);
		
		$Indice = 1;
		
		//_		* extraigo los datos pasados por el controlador
		foreach ( $obj_parametros as $value ) {
			
			$query->bindValue( $Indice, $value );
			
			$Indice ++;
			
		}
		
		$query->execute();
		
		
		return $query->fetchAll();
		
	}
	
	
	public function fn_Consultar_Links( $obj_parametros ) {
		
		
		$sql = "CALL `spListar_Links`(?);";
		
		$query = $this->db->prepare($sql);
		
		$Indice = 1;
		
		//_		* extraigo los datos pasados por el controlador
		foreach ( $obj_parametros as $value ) {
			
			$query->bindValue( $Indice, $value );
			
			$Indice ++;
			
		}
		
		$query->execute();
		
		
		return $query->fetchAll();
		
	}
	
	
	public function fn_Consultar_token_usuario_camara( $obj_parametros ) {
		
		
		$sql = "CALL `sp_Consultar_token_usuario_camara`(?);";
		
		$query = $this->db->prepare($sql);
		
		$Indice = 1;
		
		//_		* extraigo los datos pasados por el controlador
		foreach ( $obj_parametros as $value ) {
			
			$query->bindValue( $Indice, $value );
			
			$Indice ++;
			
		}
		
		$query->execute();
		
		
		return $query->fetchAll();
		
	}
	
	
	public function fn_Iniciar_Sesion( $obj_parametros ) {
		
		
		$sql = "CALL `spIniciarSesion`(?,?);";
		
		$query = $this->db->prepare($sql);
		
		$Indice = 1;
		
		$Respuesta_Consulta = "";
		
		//_		* extraigo los datos pasados por el controlador
		foreach ( $obj_parametros as $value ) {
			
			$query->bindValue( $Indice, $value );
			
			
			$Indice ++;
			
		}
		
		$query->execute();
		
		
		$Respuesta_Consulta =  $query->fetchAll();
		
		
		// 		var_dump($Respuesta_Consulta);
		
		
		if($Respuesta_Consulta != null)
		{
			
			return $Respuesta_Consulta;
			
		}
		
		else {
			
			return false;
			
		}
		
	}
	
	
	// 	Funcion llamada desde el app
	public function fn_actualizar_link( $pk_id_usuario, $pk_id_link, $id_agente, $url_web ) {
		
		// 		Variable para cambiar el estado de la camara
		$Estado = "Ocupada";
		
		$sql = "CALL `spActualizar_link`(?,?,?,?,?);";
		
		$query = $this->db->prepare($sql);
		
		$query->bindParam(1,$pk_id_usuario);
		
		$query->bindParam(2,$pk_id_link);
		
		$query->bindParam(3,$id_agente);
		
		$query->bindParam(4,$url_web);
		
		$query->bindParam(5,$Estado);
		
		
		$query->execute();
		
		
		if ($query->rowCount() > 0) {
			
			// 			Luego de actualizar el link en la tabla  tbl_dll_usuario_link, paso a actualizar el estado del agente en la tabla tbl_agentes
			$Estado = "Conectado";
			
			$sql = "CALL `spActualizar_EstadoAgente`(?,?);";
			
			$query = $this->db->prepare($sql);
			
			$query->bindParam(1,$Estado);
			
			$query->bindParam(2,$id_agente);
			
			$query->execute();
			
			if ($query->rowCount() > 0) {
				
				// 				Luego de actualizar el estado de un agente, paso a cambiar el estado del campo Solicitando_Transmision en la tabla tbl_dll_usuario_agentes, en caso de que el usuario halla echo una solicitud de transmision  
				$sql = "CALL `sp_Cancelar_Solicitud_SOS`(?);";
				
				$query = $this->db->prepare($sql);
				
				$query->bindParam(1,$id_agente);
				
				$query->execute();
				
				if ($query->rowCount() > 0) {
					
					return true;
					
				}
				
				else {
					
					return true;
					
				}
				
			}
			
			else {
				
				return false;
				
			}
			
		}
		else {
			
			return false;
			
		}
		
	}
	
	
	public function fn_Actualizar_EstadoAgente( $obj_parametros ) {
		
		
		$sql = "CALL `spActualizar_EstadoAgente`(?,?);";
		
		$query = $this->db->prepare($sql);
		
		$Indice = 1;
		
		$id_agente = 0;
		
		//_		* extraigo los datos pasados por el controlador
		foreach ( $obj_parametros as $value ) {
			
			$query->bindValue( $Indice, $value );
			
			if($Indice == 2)
			{
				
				$id_agente = $value;
				
			}
			
			$Indice ++;
			
		}
		
		
		$query->execute();
		
		
		if ($query->rowCount() > 0) {
			
			$sql = "CALL `spRemover_Link_Agente`(?);";
			
			$query = $this->db->prepare($sql);
			
			$query->bindParam(1,$id_agente);
			
			$query->execute();
			
			if ($query->rowCount() > 0) {
				
				return true;
				
			}
			
			else {
				
				return false;
				
			}
			
			
		}
		
		else {
			
			return false;
			
		}
		
	}
	
	

	public function fn_agente_solicitando_transmision( $obj_parametros ) {
		
		
		$sql = "CALL `sp_agente_solicitando_transmision`(?);";
		
		$query = $this->db->prepare($sql);
		
		$Indice = 1;
		
		//_		* extraigo los datos pasados por el controlador
		foreach ( $obj_parametros as $value ) {
			
			$query->bindValue( $Indice, $value );
			
			$Indice ++;
			
		}
		
		$query->execute();
		
		
		if ($query->rowCount() > 0) {
			
			return true;
			
		}
		
		else {
			
			return false;
			
		}
		
	}
	
	
	public function fn_Consultar_agentes_SOS( $obj_parametros ) {
		
		
		$sql = "CALL `sp_Consultar_agentes_SOS`(?);";
		
		$query = $this->db->prepare($sql);
		
		$Indice = 1;
		
		//_		* extraigo los datos pasados por el controlador
		foreach ( $obj_parametros as $value ) {
			
			$query->bindValue( $Indice, $value );
			
			$Indice ++;
			
		}
		
		$query->execute();
		
		
		return $query->fetchAll();
		
	}
	
}

?>