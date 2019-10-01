/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },

  borrarPregunta: function(idPregunta) {
    if (idPregunta > 0) this.modelo.borrarPregunta(idPregunta);
  },

  borrarTodasLasPreguntas: function() {
    this.modelo.borrarPreguntasAll();
  },

  editarPregunta:function(idPregunta,nuevoTexto,respuestasNuevas) {
    //respuestasNuevas es un array que contiene las nuevas respuestas
    this.modelo.editarPregunta(idPregunta,nuevoTexto,respuestasNuevas);
  },

  llenarModal:function(idPregunta) {
    this.modelo.llenarModal(idPregunta);
  },

  precargarLocal:function(){
    this.modelo.precargarLocal();
  }
};
