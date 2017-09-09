/**
* Author: Valdiney França 
* E-mail: valdiney.2@hotmail.com
* Github repository: https://github.com/valdiney
*/

	Broker = (function() {

	var mosq = null;

	function Broker() {
		var _this = this;
		mosq = new Mosquitto();

		$("#conectar").click(function() {
			return _this.connect();
		});

		$("#aplicar").click(function() {
			/* 
			Use Publish quando quiser enviar publicações 
			para o Broker e do broker para o seu Embarcado
			*/

            _this.temperatura_minima();
            _this.temperatura_maxima();
            _this.umidade_minima();
            _this.umidade_maxima();
            _this.tempo_luz();

			console.log("Aplicando...");
		});

		mosq.onconnect = function(rc) {
			/* 
			Use Subscribe quando quiser assinar determinado 
			Publish enviado pelo seu Embarcado
			*/
			
			/*Assina os retornos dos publish´s*/
			mosq.subscribe("temperatura_minima", 0);
			mosq.subscribe("temperatura_maxima", 0);
			mosq.subscribe("umidade_minima", 0);
			mosq.subscribe("umidade_maxima", 0);
			mosq.subscribe("tempo_luz", 0);
            
            $(".status_conectado").hide();
			$("#body-information").append("<p class='status_conectado'>Conectado ao Broker.</p>");
		};

		mosq.onmessage = function(topic, payload, qos) {
            var action = payload;

            /*
            Action contem a informação que vai do embarcado 
            para o broker e do broker para a sua página, ou seja, 
            essa página.
            */

            console.log(action);
		}

		mosq.ondisconnect = function(rc) {
			$(".status_conectado").hide();
			$("#body-information").append("<p class='status_conectado'>Desconectado do Broker.</p>");
			//mosq.connect(url);
		}

	}

	Broker.prototype.connect = function(){
		var url = "ws://iot.eclipse.org/ws"; //Endereço do seu Broker
		mosq.connect(url);
	};
    
    // Métodos de Publish´s 
	Broker.prototype.temperatura_minima = function() {
		mosq.publish("temperatura_minima", $("#temperatura_minima").val(), 0);
	}

	Broker.prototype.temperatura_maxima = function() {
		mosq.publish("temperatura_maxima", $("#temperatura_maxima").val(), 0);
	}

	Broker.prototype.umidade_minima = function() {
		mosq.publish("umidade_minima", $("#umidade_minima").val(), 0);
	}

	Broker.prototype.umidade_maxima = function() {
		mosq.publish("umidade_maxima", $("#umidade_maxima").val(), 0);
	}

	Broker.prototype.tempo_luz = function() {
		mosq.publish("tempo_luz", $("#tempo_luz").val(), 0);
	}

	return Broker;

})();

var broker = new Broker();
broker.connect();