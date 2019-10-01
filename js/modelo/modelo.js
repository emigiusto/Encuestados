/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
};

Modelo.prototype = {
  
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    if (this.preguntas.length>0) {
      var newId = _.maxBy(this.preguntas, function(preg) { return preg.id; }).id;
      this.ultimoId = newId;
      return newId
    } else {
      return 0;
    }
    
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  borrarPregunta: function(idPregunta) {
    this.preguntas = _.filter(this.preguntas, function(preg) { return !(preg.id==idPregunta); });
    this.guardar();
    this.preguntaEliminada.notificar();
  },

  borrarPreguntasAll: function() {
    this.preguntas = [];
    this.guardar();
    this.preguntaEliminada.notificar();
  },

  sumarVoto: function(idPregunta,respuestaTexto) {
    //Busco la pregunta en la que esta la respuesta elegida
    var preguntaParaSumar = this.buscarPreguntaPorId(idPregunta);
    //Busco la respuesta elegida dentro de la pregunta
    var respuestaParaSumar = this.buscarPreguntaPorId(preguntaParaSumar,respuestaTexto);
    //Le sumo a la cantidad de la respuesta +1
    respuestaParaSumar.cantidad +=1;
    this.guardar();
  },


  editarPregunta: function(idPregunta,nuevoTexto,respuestasNuevas){
    var preguntaEditar = this.buscarPreguntaPorId(idPregunta);
    //Actualizo el titulo de la Pregunta
    preguntaEditar.textoPregunta = nuevoTexto;

    //Filtro el array viejo a travez de respuestasNuevas
    var RespuestasAnterioresFiltradas = preguntaEditar.cantidadPorRespuesta.filter(function(resp) {
      return respuestasNuevas.includes(resp.textoRespuesta);
    });
    
      //respuestasNuevas es un array que contiene las nuevas respuestas
      //Recorro las respuestas nuevas, agregando las no existentes en el array de respuestas existentes
      for (let index = 0; index < respuestasNuevas.length; index++) {
        var respNew = respuestasNuevas[index];
        //si el array de respuestas no incluye a la nueva respuesta, hay que agregarla al final
        if (!(RespuestasAnterioresFiltradas.some(respAnt => respAnt.textoRespuesta === respNew))){
          //La agrego al final con cant 0
          RespuestasAnterioresFiltradas.push({textoRespuesta: respNew, cantidad: 0});
        }
      }
      preguntaEditar.cantidadPorRespuesta = RespuestasAnterioresFiltradas;
    //Cambio las respuestas. respuestas es un array de esta forma:
    // [{textoRespuesta: "asd", cantidad: 0},{textoRespuesta: "qwe", cantidad: 2}]
    this.guardar();
    this.preguntaAgregada.notificar();
  },


  //Esta función llena el modal de editarPregunta por "default"
  llenarModal: function(idPregunta){
    //Limpio las respuestas existentes
    $('#containerRespuestas').empty();
    //Esta es la pregunta según el ID seleccionado como "active"
    var preguntaEditar = this.buscarPreguntaPorId(idPregunta);

    //Este es el texto de la pregunta. Lo ingreso en el modal:
    var cuadroDePregunta = document.getElementById("pregunta-text");

    //Seteo por default el "value" del input del modal
    cuadroDePregunta.setAttribute("value", preguntaEditar.textoPregunta);
    cuadroDePregunta.setAttribute("idPregunta", idPregunta);
    var respuestashtml = "";
    
    
    //Este ciclo recorrerá las respuestas creando el html correspondiente
    for (let index = 0; index < preguntaEditar.cantidadPorRespuesta.length; index++) {
      var respTexto = preguntaEditar.cantidadPorRespuesta[index].textoRespuesta;
      respuestashtml = respuestashtml + this.prepararRespuestaModal(respTexto,index,idPregunta);
    }
    var containerResp = document.getElementById("containerRespuestas");
    containerResp.innerHTML = respuestashtml;

          //Asigno eventos a botones de autoborrado
          $("#containerRespuestas").find("img").click(function() {
            $(this).parent().remove();
          });
  },


  //se guardan las preguntas
  guardar: function(){
    localStorage.setItem('preguntas',JSON.stringify(this.preguntas));
  },

  precargarLocal:function(){
      if (localStorage.getItem('preguntas')!==null){
        this.preguntas = JSON.parse(localStorage.getItem('preguntas'));
      }
  },

  //Otras funciones adicionales
    //Devuelve la pregunta correspondiente a ese id
  buscarPreguntaPorId: function(idPregunta){
    return this.preguntas.find(function(pregunta) {
            return pregunta.id == idPregunta;
            });
  },
  //Devuelve la respuesta de una determinada pregunta que sea igual al texto pasado por param
  buscarRespuestaPorTexto: function(pregunta,respuestaTexto){
    return pregunta.cantidadPorRespuesta.find(function(respuesta) {
            return respuesta.textoRespuesta == respuestaTexto;
    });
  },

    //Devuelve el texto html a agregar al modal segun la cantidad de respuestas que haya
  prepararRespuestaModal: function(textoRespuesta,idRespuesta,idPregunta){
    return '<div idPregunta="' + idPregunta + '"><input type="text" class="form-control" value="'+ textoRespuesta +'" idRespuesta ="' + idRespuesta +'" idPregunta="' + idPregunta + '"></input><img class="modalDelete" src="img/deleteButton.png" alt="No Image"></img></div>';
id  }

};

