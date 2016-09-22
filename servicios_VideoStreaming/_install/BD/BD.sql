CREATE DATABASE IF NOT EXISTS VideoStreaming DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE VideoStreaming;


-- Estructura par la tabla  Tbl_Usuario
--
DROP TABLE IF EXISTS Tbl_Usuario;
CREATE TABLE IF NOT EXISTS Tbl_Usuario (
  PK_ID_Usuario INT(45) NOT NULL AUTO_INCREMENT ,
  Nombre_Usuario VARCHAR(45) NOT NULL,
  Contrasenia VARCHAR(45) NOT NULL,
  Avatar_Usuario VARCHAR(45) NOT NULL,
  PRIMARY KEY (PK_ID_Usuario)
)ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1 ;


-- Estructura par la tabla  Tbl_Agentes
--
DROP TABLE IF EXISTS Tbl_Agentes;
CREATE TABLE IF NOT EXISTS Tbl_Agentes (
  PK_ID_Agente INT(45) NOT NULL AUTO_INCREMENT ,
  Nombre_Agente VARCHAR(45) NOT NULL,
  Token_Dispositivo VARCHAR(250) NOT NULL,
  Estado VARCHAR(45) NOT NULL,
  PRIMARY KEY (PK_ID_Agente)
)ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1 ;


-- Estructura par la tabla  Tbl_Dll_Usuario_Agentes
--
DROP TABLE IF EXISTS Tbl_Dll_Usuario_Agentes;
CREATE TABLE IF NOT EXISTS Tbl_Dll_Usuario_Agentes (
  PK_ID_Usuario_Agente INT(45) NOT NULL AUTO_INCREMENT ,
  FK_ID_Usuario INT(45) NOT NULL,
  FK_ID_Agente INT(45) NOT NULL,
  Solicitando_Transmision VARCHAR(45) NOT NULL DEFAULT 'NO',
  FOREIGN KEY (FK_ID_Usuario) REFERENCES Tbl_Usuario (PK_ID_Usuario),
  FOREIGN KEY (FK_ID_Agente) REFERENCES Tbl_Agentes (PK_ID_Agente),
  PRIMARY KEY (PK_ID_Usuario_Agente)
)ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1 ;

-- Estructura par la tabla  Tbl_Links
--
DROP TABLE IF EXISTS Tbl_Links;
CREATE TABLE IF NOT EXISTS Tbl_Links (
  PK_ID_Link INT(45) NOT NULL AUTO_INCREMENT ,
  Nombre_Link VARCHAR(45) NOT NULL,
  PRIMARY KEY (PK_ID_Link)
)ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1 ;

-- Estructura par la tabla  Tbl_Dll_Usuario_Link
--
DROP TABLE IF EXISTS Tbl_Dll_Usuario_Link;
CREATE TABLE IF NOT EXISTS Tbl_Dll_Usuario_Link (
  PK_ID_Usuario_Link INT(45) NOT NULL AUTO_INCREMENT ,
  FK_ID_Usuario INT(45) NOT NULL,
  FK_ID_Link INT(45) NOT NULL,
  ID_Agente INT(45) NOT NULL,
  Estado VARCHAR(45) NOT NULL DEFAULT 'Disponible',
  LINK VARCHAR(250) NOT NULL,
  FOREIGN KEY (FK_ID_Usuario) REFERENCES Tbl_Usuario (PK_ID_Usuario),
  FOREIGN KEY (FK_ID_Link) REFERENCES Tbl_Links (PK_ID_Link),
  PRIMARY KEY (PK_ID_Usuario_Link)
)ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT = 1 ;

-- Volcado de datos para la tabla `Tbl_Agentes`
--

INSERT INTO `tbl_agentes` (`PK_ID_Agente`, `Nombre_Agente`,`Token_Dispositivo`,`Estado`) VALUES
(1, 'Juan','ePzR-_EUeFE:APA91bGB8e00--CuA8TzsqIPu07_mmCwGZq7mlIi2N_9iMiDvBDqzTIw7_6fz2AciNT1ODj1vzIB2unhf6TTsL4DitZdELNeSlAFyNVdtUca88cy3XR4Duoboin8tKdnmUUHai_Efzab','Desconectado'),
(2, 'Maik','fcpM3mpC-k0:APA91bHcwj9czUKIgfLqmPmIJ3r8L2XEw8Ntcp6yAvL0hS8p8Pdr_M4gtB-eK3y7SucS0zB50HJOM6TwKQb8LnkFT_DmlAFYy8SjL3QnyP-ufPsaTjeqMwqZhWF9CK-Mug6dPntWSPbM','Desconectado'),
(3, 'TIPI','fo8qOzn6lk4:APA91bHhPWf9rc8cQ93bQNUAN0P-8AsidnIIZ-dmdki_fo21ELVzvwgbzqJYqUzSZPZMczMmDmgXPBPuTum9Wzb6RKUOzO5WAQVPSVPBnl6u3vaZi6nGnqkFjKZh1Ony2fe-Xl4MvHRa','Desconectado');


--
-- Volcado de datos para la tabla `Tbl_Usuario`
--

INSERT INTO `tbl_usuario` (`PK_ID_Usuario`, `Nombre_Usuario`,`Contrasenia`,`Avatar_Usuario`) VALUES
(1, 'maik','3345','1234.png'),
(2, 'juan','3345','12345.png');


--
-- Volcado de datos para la tabla `Tbl_Links`
--

INSERT INTO `tbl_links` (`PK_ID_Link`,`Nombre_Link`) VALUES
(1,'Camara 1'),
(2,'Camara 2'),
(3,'Camara 3'),
(4,'Camara 4'),
(5,'Camara 5'),
(6,'Camara 6');


--
-- Volcado de datos para la tabla `Tbl_Dll_Usuario_Agentes`
--

INSERT INTO `tbl_dll_usuario_agentes` (`PK_ID_Usuario_Agente`, `FK_ID_Usuario`,`FK_ID_Agente`) VALUES
(1, '2','1'),
(2, '1','2');


--
-- Volcado de datos para la tabla `Tbl_Dll_Usuario_Link`
--

INSERT INTO `tbl_dll_usuario_link` (`PK_ID_Usuario_Link`, `FK_ID_Usuario`,`FK_ID_Link`,`LINK`) VALUES
(1, '1','1',''),
(2, '1','2',''),
(3, '1','3',''),
(4, '1','4',''),
(5, '1','5',''),
(6, '1','6',''),
(7, '2','1',''),
(8, '2','2',''),
(9, '2','3',''),
(10, '2','4',''),
(11, '2','5',''),
(12, '2','6','');

-- =================== CONSULTAR Agentes solicitando trasmision ================ --

DROP PROCEDURE IF EXISTS sp_Consultar_agentes_SOS;
DELIMITER !
CREATE PROCEDURE sp_Consultar_agentes_SOS(IN $PK_ID_Usuario INT(45))
BEGIN
SELECT * FROM `tbl_agentes` AS agent INNER JOIN  `tbl_dll_usuario_agentes` AS agentUsuario
ON agent.PK_ID_Agente = agentUsuario.FK_ID_Agente
WHERE agentUsuario.Solicitando_Transmision = 'SI' AND  agentUsuario.FK_ID_Usuario = $PK_ID_Usuario;
END !
DELIMITER ;
-- ==================== INICIAR SESION ================== --

DROP PROCEDURE IF EXISTS spIniciarSesion;
DELIMITER !
CREATE PROCEDURE spIniciarSesion(IN $Nombre_Usuario varchar(45), IN $Contrasenia  varchar(45))
BEGIN
SELECT * FROM `tbl_usuario` WHERE `Nombre_Usuario` =  $Nombre_Usuario AND `Contrasenia` = $Contrasenia ;
END !
DELIMITER ;


-- =================== CONSULTAR Agentes ================ --

DROP PROCEDURE IF EXISTS spListar_Agentes;
DELIMITER !
CREATE PROCEDURE spListar_Agentes(IN $Nombre_Usuario VARCHAR(45))
BEGIN
SELECT * FROM `tbl_agentes` tblAgentes INNER JOIN
`tbl_dll_usuario_agentes` AS tblUsuarioAgente INNER JOIN `tbl_usuario` AS tblUsuario
ON tblAgentes.PK_ID_Agente = tblUsuarioAgente.FK_ID_Agente AND
tblUsuarioAgente.FK_ID_Usuario = tblUsuario.PK_ID_Usuario WHERE tblUsuario.Nombre_Usuario = $Nombre_Usuario;
END !
DELIMITER ;


-- =================== CONSULTAR Links ================ --

DROP PROCEDURE IF EXISTS spListar_Links;
DELIMITER !
CREATE PROCEDURE spListar_Links(IN $PK_ID_Usuario INT(45))
BEGIN
SELECT link.PK_ID_Link,dllusuariolink.LINK,link.Nombre_Link,dllusuariolink.Estado,(SELECT Nombre_Agente FROM `tbl_agentes` where PK_ID_Agente = dllusuariolink.ID_Agente) AS Nombre_Agente FROM `tbl_links` AS link INNER JOIN `tbl_dll_usuario_link` AS dllusuariolink ON link.PK_ID_Link = dllusuariolink.FK_ID_Link AND dllusuariolink.FK_ID_Usuario = $PK_ID_Usuario;
END !
DELIMITER ;

-- =================== CONSULTAR consultar token del agente deacuerdo al id de la camara ingresado ================ --

DROP PROCEDURE IF EXISTS sp_Consultar_token_usuario_camara;
DELIMITER !
CREATE PROCEDURE sp_Consultar_token_usuario_camara(IN $ID_LINK INT(45))
BEGIN
SELECT Agente.Token_Dispositivo,Agente.PK_ID_Agente FROM `tbl_agentes` as Agente where Agente.PK_ID_Agente in (SELECT `ID_Agente` FROM `tbl_dll_usuario_link` WHERE `FK_ID_Link` = $ID_LINK);
END !
DELIMITER ;
-- =================== Actualizar link de acuerdo al id ================ --

DROP PROCEDURE IF EXISTS spActualizar_link;
DELIMITER !
CREATE PROCEDURE spActualizar_link(IN $pk_id_usuario INT(45), IN $pk_id_link INT(45), IN $id_agente INT(45), IN $url_web varchar(250), IN $Estado varchar(45))
BEGIN
UPDATE `tbl_dll_usuario_link` SET `LINK` = $url_web, `ID_Agente` = $id_agente, `Estado` = $Estado WHERE `FK_ID_Usuario` = $pk_id_usuario AND `FK_ID_Link` = $pk_id_link;
END !
DELIMITER ;

-- =================== Actualizar Estado de un agente ================ --

DROP PROCEDURE IF EXISTS spActualizar_EstadoAgente;
DELIMITER !
CREATE PROCEDURE spActualizar_EstadoAgente(IN $Estado varchar(45), IN $id_agente INT (45))
BEGIN
UPDATE `tbl_agentes` SET `Estado` = $Estado WHERE `PK_ID_Agente` = $id_agente ;
END !
DELIMITER ;


-- =================== Remover Agente asociado a un link ================ --



DROP PROCEDURE IF EXISTS spRemover_Link_Agente;
DELIMITER !
CREATE PROCEDURE spRemover_Link_Agente( IN $id_agente INT (45))
BEGIN
UPDATE `tbl_dll_usuario_link` SET `Estado` = 'Disponible', `ID_Agente` = ' ', `LINK` = ' ' WHERE `ID_Agente` = $id_agente;
END !
DELIMITER ;


-- =================== Actualizar Solicitando_Transmision de un agente ================ --

DROP PROCEDURE IF EXISTS sp_agente_solicitando_transmision;
DELIMITER !
CREATE PROCEDURE sp_agente_solicitando_transmision(IN $Token varchar(250))
BEGIN
UPDATE `tbl_dll_usuario_agentes` SET `Solicitando_Transmision` = 'SI' WHERE `FK_ID_Agente` = (SELECT `PK_ID_Agente` FROM `tbl_agentes` WHERE `Token_Dispositivo` = $Token) ;
END !
DELIMITER ;


-- =================== Actualizar Solicitando_Transmision de un agente, se actualiza a NO. ================ --

DROP PROCEDURE IF EXISTS sp_Cancelar_Solicitud_SOS;
DELIMITER !
CREATE PROCEDURE sp_Cancelar_Solicitud_SOS(IN $id_agente INT(45))
BEGIN
UPDATE `tbl_dll_usuario_agentes` SET `Solicitando_Transmision` = 'NO' WHERE `FK_ID_Agente` = $id_agente ;
END !
DELIMITER ;
