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
    this.preguntaEliminada.notificar();
  },

  borrarPreguntasAll: function() {
    this.preguntas = [];
    this.preguntaEliminada.notificar();
  },

  sumarVoto: function(idPregunta,respuestaTexto) {
    //Busco la pregunta en la que esta la respuesta elegida
    var preguntaParaSumar = this.buscarPreguntaPorId(idPregunta);
    //Busco la respuesta elegida dentro de la pregunta
    var respuestaParaSumar = this.buscarPreguntaPorId(preguntaParaSumar,respuestaTexto);
    //Le sumo a la cantidad de la respuesta +1
    respuestaParaSumar.cantidad +=1;
  },


  editarPregunta: function(idPregunta,nuevoTexto,respuestas){
    var preguntaEditar = this.buscarPreguntaPorId(idPregunta);
    console.log(preguntaEditar);
    //Cambio el texto de las preguntas
    preguntaEditar.textoPregunta = nuevoTexto;
    //Cambio las respuestas. respuestas es un array de esta forma:
    // [{textoRespuesta: "asd", cantidad: 0},{textoRespuesta: "qwe", cantidad: 2}]
    preguntaEditar.cantidadPorRespuesta = respuestas;
    this.preguntaAgregada.notificar();
  },

  //Esta función llena el modal de editar por "default"
  llenarModal: function(idPregunta){
    //Limpio las respuestas existentes
    $('#containerRespuestas').html = '';

    //Esta es la pregunta según el ID seleccionado como "active"
    var preguntaEditar = this.buscarPreguntaPorId(idPregunta);
    //Este es el texto de la pregunta. Lo ingreso en el modal:
      $('#pregunta-text').html = preguntaEditar.textoPregunta;

    var respuestashtml = "";

    //Este ciclo recorrerá las respuestas creando el html correspondiente
    preguntaEditar.cantidadPorRespuesta.forEach(function (preg, index) {
      respuestashtml =+ this.prepararRespuestaModal(preg,index);
    });

    $('#containerRespuestas').html = respuestashtml;
  },

  //se guardan las preguntas
  guardar: function(){
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
  prepararRespuestaModal: function(textoRespuesta,id){
    return '<input type="text" class="form-control" id="responseNumber'+ id + '">' + textoRespuesta + '</input>';
  },

};

