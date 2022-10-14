let cliente = {
  mesa: '',
  hora: '',
  pedido: []
}

const categorias = {
  1: 'comida',
  2: 'bebida',
  3: 'postre'
};

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente );

function guardarCliente() {
  const mesa = document.querySelector('#mesa').value;
  const hora = document.querySelector('#hora').value;

  //revisar si hay campos vacios
  const camposVacios = [mesa, hora].some( campo => campo === '');

  if (camposVacios) {
    //verificar si ya existe la alerta
    const existeAlerta = document.querySelector('.invalid-feedback');

    if (!existeAlerta) {
      const alerta = document.createElement('div');
      alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
      alerta.textContent = 'Todos son campos son obligatorios';
      document.querySelector('.modal-body form').appendChild(alerta);

    //eliminar la alerta  
      setTimeout(() => {
        alerta.remove()
      }, 3000);
    } return;
  }
  //asignar datos del formulario a cliente
    cliente = {...cliente, mesa, hora }
    //console.log(cliente);

    //ocultar modal
    const ocultarModalForm = document.querySelector('#formulario');
    const modalB = bootstrap.Modal.getInstance(ocultarModalForm)
    modalB.hide();

    //mostrar las secciones 
    mostrarSecciones();

    //consultar platillos desde la api de json-server
    obtenerPlatillos();
  }

  function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
  }

  function obtenerPlatillos() {
    const url = 'http://localhost:3000/platillos'

    fetch(url)
     .then(respuesta => respuesta.json())
     .then(resultado => mostrarPlatillos(resultado))
     .catch(error => console.log(error))
  }

  function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
      const row = document.createElement('div');
      row.classList.add('row', 'py-3', 'border-top');

      const nombre = document.createElement('div');
      nombre.classList.add('col-md-4');
      nombre.textContent = platillo.nombre;

      const precio = document.createElement('div');
      precio.classList.add('col-md-3', 'fw-bold');
      precio.textContent = `$${platillo.precio}`;

      const categoria = document.createElement('div');
      categoria.classList.add('col-md-3');
      categoria.textContent = categorias [platillo.categoria];

      row.appendChild(nombre);
      row.appendChild(precio);
      row.appendChild(categoria);


      contenido.appendChild(row);

      console.log(platillo)
    })
  }