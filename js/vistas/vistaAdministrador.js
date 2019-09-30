/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaEliminada.suscribir(function() { 
    contexto.reconstruirLista(); 
  });
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.reconstruirLista();
    this.configuracionDeBotones();
    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
    var nuevoItem;
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    nuevoItem = $('<li/>', {
      'html' : pregunta.textoPregunta,
      'class' : 'list-group-item',
      'id': pregunta.id
    });
    // Modificado! Guia 1
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');

    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos; //Es el objeto que contiene a los elementos/botones del DOM
    var contexto = this; //es la vistaAdministrador
    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];
      $('[name="option[]"]').each(function() {
        //completado?
        var respuesta = {'textoRespuesta': $(this).val(), 'cantidad': 0}
        respuestas.push(respuesta);
      })

      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });
    //asociar el resto de los botones a eventos
    e.botonBorrarPregunta.click(function() {
      var id = parseInt($('.list-group-item.active').attr('id'));
      contexto.controlador.borrarPregunta(id);
    });

    e.borrarTodo.click(function() {
      contexto.controlador.borrarTodasLasPreguntas();
    });

    e.botonEditarPregunta.click(function() {
      //id pregunta a editar
      var id = parseInt($('.list-group-item.active').attr('id'));
      contexto.controlador.llenarModal(id);
      $('#editModal').modal('show');
    });

    e.confirmarEditar.click(function() {
      contexto.controlador.editarPregunta(idPregunta,nuevoTexto,respuestas);
      $('#editModal').modal('hide');
    });
    
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
