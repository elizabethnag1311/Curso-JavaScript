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

      const inputCantidad = document.createElement('input');
      inputCantidad.type = 'number';
      inputCantidad.min = 0;
      inputCantidad.value = 0;
      inputCantidad.id = `producto-${platillo.id}`;
      inputCantidad.classList.add('form-control');

      //funcion para detectar la cantidad y el platillo
      inputCantidad.onchange = function () {
        const cantidad = parseInt (inputCantidad.value);
        agregarPlatillo({...platillo, cantidad})
      }
      

      const agregar = document.createElement('div');
      agregar.classList.add('col-md-2');
      agregar.appendChild(inputCantidad);

      row.appendChild(nombre);
      row.appendChild(precio);
      row.appendChild(categoria);
      row.appendChild(agregar);


      contenido.appendChild(row);
    })
  }

  function agregarPlatillo(producto) {
    //extraer el pedido actual
    let {pedido} = cliente
    //revisar que la cantidad sea mayor a 0
    if (producto.cantidad > 0) {
      //comprueba si el elemento ya existe en el array
      if( pedido.some(articulo => articulo.id === producto.id)){
        //el articulo ya existe, actualizar la canridad
        const pedidoActualizado = pedido.map( articulo => {                //identifica el elemento para poder modificar creando un array nuevo
          if (articulo.id === producto.id) {                               //ya estamos en el elemnto que hay que actualizar su cantidad
            articulo.cantidad = producto.cantidad;                        //ya actualiza
          }
          return articulo;                                                //asigna el articulo al array nuevo modificado
        });
        //se asigna el nuevo array a cliente.pedido
        cliente.pedido = [...pedidoActualizado];
      }else {
        //el articulo no existe , se agrega al array de pedido
        cliente.pedido = [...pedido, producto];
      } 
    }else {
      //eliminar elementos cuando la cantidad es 0
      const resultado = pedido.filter( articulo => articulo.id !== producto.id);      //retorna los que son diferentes al que se esta eliminando
      cliente.pedido = [...resultado];
    }
    //limpiar el HTML previo
    limpiarHtml();

    if (cliente.pedido.length) {
      //mostrar el resumen
      actualizarResumen();
    }else {
      mensjPedidoVacio();
    }
  }

  function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    //informacion de la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //informacion de la hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');


    //agregar a los elemntos padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //titulo de la seccion
    const heading = document.createElement('h3');
    heading.textContent = 'Ordenes'
    heading.classList.add('my-4', 'text-center');

    //iterar sobre el array de pedidos
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const {pedido} = cliente;
    pedido.forEach ( articulo => {
      const {nombre, cantidad, precio, id} = articulo

      const lista = document.createElement('li');
      lista.classList.add('list-group-item');

      const nombrePlato = document.createElement('h4');
      nombrePlato.classList.add('my-4');
      nombrePlato.textContent = nombre;

      //cantidad del articulo
      const cantidadPlato = document.createElement('p');
      cantidadPlato.classList.add('fw-bold');
      cantidadPlato.textContent = 'Cantidad: ';

      const cantidadValor = document.createElement('span');
      cantidadValor.classList.add('fw-normal');
      cantidadValor.textContent = cantidad;

      //precio del articulo
      const precioPlato = document.createElement('p');
      precioPlato.classList.add('fw-bold');
      precioPlato.textContent = 'Precio: ';

      const precioValor = document.createElement('span');
      precioValor.classList.add('fw-normal');
      precioValor.textContent = `$${precio}`;

      //subtotal del articulo
      const subtotalPlato = document.createElement('p');
      subtotalPlato.classList.add('fw-bold');
      subtotalPlato.textContent = 'Subtotal: ';

      const subtotalValor = document.createElement('span');
      subtotalValor.classList.add('fw-normal');
      subtotalValor.textContent = calcularSubtotal(precio, cantidad);

      //boton de eliminar
      const btnEliminar = document.createElement('button');
      btnEliminar.classList.add('btn', 'btn-danger');
      btnEliminar.textContent = 'Eliminar del pedido';

      //funcion para eliminar del pedido
      btnEliminar.onclick = function () {
        eliminarProducto(id)
      }


      //agregar valores a sus contenedores
      cantidadPlato.appendChild(cantidadValor);
      precioPlato.appendChild(precioValor);
      subtotalPlato.appendChild(subtotalValor);

      //agregar elementos al li
      lista.appendChild(nombrePlato);
      lista.appendChild(cantidadPlato);
      lista.appendChild(precioPlato);
      lista.appendChild(subtotalPlato);
      lista.appendChild(btnEliminar);

      //agregar lista al grupo principal
      grupo.appendChild(lista)
    })

    //agregar a contenido
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);
  }

  function limpiarHtml() {
    const contenido = document.querySelector('#resumen .contenido')

    while (contenido.firstChild) {
      contenido.removeChild(contenido.firstChild)
    }
  }

  function calcularSubtotal(precio, cantidad) {
    return `$${ precio * cantidad}`;
  }

  function eliminarProducto(id) {
    const {pedido} = cliente;
    const resultado = pedido.filter( articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    //limpiar el HTML previo
    limpiarHtml();
  
    if (cliente.pedido.length) {
      //mostrar el resumen
      actualizarResumen();
    }else {
      mensjPedidoVacio();
    }

    //al eliminar el producto ,vuelve la cantidad a 0 en el formulario
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
  }

  function mensjPedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
  }