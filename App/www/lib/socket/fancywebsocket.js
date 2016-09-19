var FancyWebSocket = function(url)
{
	var callbacks = {};
	var ws_url = url;
	var conn;

	this.bind = function(event_name, callback)
	{
		callbacks[event_name] = callbacks[event_name] || [];
		callbacks[event_name].push(callback);
		return this;
	};

	this.send = function(event_name, event_data)
	{
		this.conn.send( event_data );
		return this;
	};

	this.connect = function()
	{
		if ( typeof(MozWebSocket) == 'function' )
			this.conn = new MozWebSocket(url);
		else
			this.conn = new WebSocket(url);

		this.conn.onmessage = function(evt)
		{
			dispatch('message', evt.data);
		};

		this.conn.onclose = function(){dispatch('close',null)}
		this.conn.onopen = function(){dispatch('open',null)}
	};

	this.disconnect = function()
	{
		this.conn.close();
	};

	var dispatch = function(event_name, message)
	{

		var JSONdata  = JSON.parse(message);
		// console.log(JSON.parse(message));
		if(JSONdata.Funcion == "cambiar_EstadoAgente")
		{
			cambiar_EstadoAgente();
		}
		else if(JSONdata.Funcion == "Actualizar_Notificaciones")
		{
			Actualizar_Notificaciones();
		}
	};
};

var Server;
function send( text )
{
	Server.send( 'message', text );
}
$(document).ready(function()
{
	Server = new FancyWebSocket('ws://192.168.125.2:12345');
	Server.bind('open', function()
	{
	});
	Server.bind('close', function( data )
	{
	});
	Server.bind('message', function( payload )
	{
	});
	Server.connect();
});



function cambiar_EstadoAgente()
{
		//Funcion para consultar los agentes
		angular.element(document.getElementById('VideoStreaming')).scope().fn_Consultar_Agentes();
}
