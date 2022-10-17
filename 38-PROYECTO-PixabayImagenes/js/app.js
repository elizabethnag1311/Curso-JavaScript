const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const resultadoPorPag = 40;
let totalPagns;
let iterador;
let pagActual = 1;

window.onload = () => {
  formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
  e.preventDefault();

  const terminoBusqueda = document.querySelector('#termino').value;

  if (terminoBusqueda === '') {
    mostrarAlerta('Agrega un termino de busqueda');
    return;
  }
  buscarImagenes();
}

function mostrarAlerta(mensaje) {
  const existeAlerta = document.querySelector('.bg-red-100');

  if (!existeAlerta) {
    const alerta = document.createElement('p');
    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto',
    'mt-6', 'text-center');
  
    alerta.innerHTML = `
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">${mensaje}</apan>
    `;
  
    formulario.appendChild(alerta);
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

async function buscarImagenes() {
  const termino = document.querySelector('#termino').value;
  const key = '30414687-81b967eaae6f80b3c08fe2509';
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${resultadoPorPag}&page=${pagActual}`;

  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    totalPagns = calcularPag(resultado.totalHits);
    mostrarImagenes(resultado.hits);
  } catch (error) {
    console.log(error);
  }
};

//Generador para registar la cantidad de elementos por pagina
function *crearPaginador(total) {
  //console.log(total);
  for (let i = 1; i <= total; i++) {
    yield i;
    
  }
}

function calcularPag(total) {
  return parseInt(Math.ceil( total / resultadoPorPag ));
}

function mostrarImagenes(imagenes) {
  //console.log(imagenes);
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  //iterar sobre el arreglo de imagenes y construir el HTML
  imagenes.forEach( imagen => {
    const { previewURL, likes, views, largeImageURL } = imagen;

    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
      <div class="bg-white">
        <img class="w-full" src="${previewURL}">
         <div class="p-4">
           <p class="font-bold">${likes}<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg></p>
           <p class="font-bold"> ${views} <span class="font-light">de vistas</span></p>
           <a 
            class=" block w-full bg-teal-700 hover:bg-teal-400 text-white uppercase font-bold text-center rounded mt-5 p-1"
             href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
              Ver Imagen
           </a>
        </div>
      </div>
    </div>
    `;
  });

  //limpiar el paginador previo
  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild)
  }

  //genera un nuevo HTML
  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPagns);
  
  while (true) {
    const {value, done} = iterador.next();
    if(done) return;

    //caso contrario genera un boton por cada elemento en el generador
    const botonPag = document.createElement('a');
    botonPag.href = '#';
    botonPag.dataset.pagina = value;
    botonPag.textContent = value;
    botonPag.classList.add('siguiente', 'bg-teal-400', 'hover:bg-teal-700', 'px-2', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

    botonPag.onclick = () => {
      pagActual = value;
      buscarImagenes();
    }

    paginacionDiv.appendChild(botonPag);
  }
}