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
        this.modelo.borrarPregunta(idPregunta);
  },

  borrarTodasLasPreguntas: function() {
    this.modelo.borrarPreguntasAll();
  },

  editarPregunta:function() {
    this.modelo.editarPregunta(idPregunta,nuevoTexto,respuestas);
  },

  llenarModal:function(idPregunta) {
    this.modelo.llenarModal(idPregunta);
  }
};
