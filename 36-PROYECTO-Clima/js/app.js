const container = document.querySelector('.container');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

window.addEventListener('load', () => {
  formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
  e.preventDefault();

  //Validar
  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;

  if (ciudad === '' || pais === '') {
    //Hubo un error
    mostrarError('Ambos campos son Obligatorios');

    return;
  }
  //Consultar la API
  consultarApi(ciudad, pais);
}

function mostrarError(mensaje) {
  //crear una alerta 
  const alerta = document.querySelector('.bg-red-100');
  if (!alerta) {
    const alerta = document.createElement('div');

    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto',
    'mt-6', 'text-center');
  
    alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block">${mensaje}</span>
    `;
  
    container.appendChild(alerta);
    //eliminar la alerca despues de 5seg
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
}

function consultarApi(ciudad, pais) {
  const addId = 'bc739bcca09dc8924453aa92ab7ac21e';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${addId}`;

  Spinner();  //muestra un Spineer de carga

  fetch(url)
   .then( respuesta => respuesta.json())
   .then( datos => {
    limpiarHtml(); //limpiar el HTML previo
     if(datos.cod === "404") {
      mostrarError('Ciudad no Encontrada')
      return;
     }

     //imprimir la respuesta en el HTML
     mostrarClima(datos);

   })
}

function mostrarClima(datos) {
  const {name, main: {temp, temp_max, temp_min}} = datos;
  const centigrados = Math.round(temp - 273.15);
  const max = Math.round(temp_max - 273.15);
  const min = Math.round(temp_min -273.15);

  const nombreCiudad = document.createElement('p');
  nombreCiudad.textContent = `Clima en ${name}`;
  nombreCiudad.classList.add('font-bold', 'text-2xl');

  const actual = document.createElement('p');
  actual.textContent = `${centigrados} ºC`;
  actual.classList.add('font-bold', 'text-6xl');

  const tempMaxima = document.createElement('p');
  tempMaxima.textContent = `Max: ${max} ºC`;
  tempMaxima.classList.add('text-xl');

  const tempMinima = document.createElement('p');
  tempMinima.textContent = `Max: ${min} ºC`;
  tempMinima.classList.add('text-xl');

  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center', 'text-white');
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);

  resultado.appendChild(resultadoDiv);
}


function limpiarHtml() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function Spinner() {
  limpiarHtml();
  
  const divSpinner = document.createElement('div');
  divSpinner.classList.add('sk-fading-circle');
  divSpinner.innerHTML = `
  
  <div class="sk-circle1 sk-circle"></div>
  <div class="sk-circle2 sk-circle"></div>
  <div class="sk-circle3 sk-circle"></div>
  <div class="sk-circle4 sk-circle"></div>
  <div class="sk-circle5 sk-circle"></div>
  <div class="sk-circle6 sk-circle"></div>
  <div class="sk-circle7 sk-circle"></div>
  <div class="sk-circle8 sk-circle"></div>
  <div class="sk-circle9 sk-circle"></div>
  <div class="sk-circle10 sk-circle"></div>
  <div class="sk-circle11 sk-circle"></div>
  <div class="sk-circle12 sk-circle"></div>
  `;

  resultado.appendChild(divSpinner);
}