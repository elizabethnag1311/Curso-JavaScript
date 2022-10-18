const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado')

const objBusqueda ={
  moneda: '',
  criptomoneda: ''
}

//crear un Promise
const obtenerCripto = criptomonedas => new Promise( resolve => {
  resolve(criptomonedas)
})

document.addEventListener('DOMContentLoaded', () => {
  consultarCripto()

  formulario.addEventListener('submit', submitFormulario);
  criptoSelect.addEventListener('change', leerValor);
  monedaSelect.addEventListener('change', leerValor);
})

async function consultarCripto() {

  const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=100&tsym=USD'

   try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json()
    const criptomonedas = await obtenerCripto(resultado.Data);
    selectCripto(criptomonedas);
   } catch (error) {
    console.log(error)
   }
}

function selectCripto(criptomonedas) {
  criptomonedas.forEach(cripto => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement('option');
    option.value = Name;
    option.textContent = FullName;
    criptoSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda [e.target.name] = e.target.value;
  //console.log(objBusqueda);
}

function submitFormulario(e) {
  e.preventDefault()

  const {criptomoneda, moneda} = objBusqueda
  if (criptomoneda === '' || moneda === '') {
    mostrarAlerta('Ambos campos son Obligatorios');
    return;
  }
  //consultar la API con los resultados
  consultarAPI();
}

function mostrarAlerta(mensaje) {
   //crear una alerta 
   const existeAlerta = document.querySelector('.error');
   if (!existeAlerta) {
     const alerta = document.createElement('div');
     alerta.classList.add('error')
    //mensaje de error
    alerta.textContent = mensaje;
   
     formulario.appendChild(alerta);
     //eliminar la alerca despues de 5seg
     setTimeout(() => {
       alerta.remove();
     }, 5000);
   }
}

async function consultarAPI() {

  const { moneda, criptomoneda } = objBusqueda;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();
   try {
    const respuesta = await fetch(url);
    const cotizacion = await respuesta.json();
    mostrarCotizacionHTML(cotizacion.DISPLAY [criptomoneda] [moneda])
   } catch (error) {
    console.log(error);
   }
}

function mostrarCotizacionHTML(cotizacion) {

  limpiarHtml();
  
  const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE  } = cotizacion

  const precio = document.createElement('p');
  precio.classList.add('precio');
  precio.innerHTML = `Precio: <span>${PRICE}</span>`;

  const precioAlto = document.createElement('p');
  precioAlto.innerHTML = `<p>Precio mas alto del dia: <span>${HIGHDAY}<span></p>`;

  const precioBajo = document.createElement('p');
  precioBajo.innerHTML = `<p>Precio mas bajo del dia: <span>${LOWDAY}<span></p>`;

  const cambio24Hr = document.createElement('p');
  cambio24Hr.innerHTML = `<p>Variacion ultimas 24 horas: <span>${CHANGEPCT24HOUR}%<span></p>`;

  const ultimaActualizacion = document.createElement('p');
  ultimaActualizacion.innerHTML = `<p>Actualizado: <span>${LASTUPDATE}<span></p>`;


  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(cambio24Hr);
  resultado.appendChild(ultimaActualizacion);

}

function limpiarHtml() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHtml();

  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
  <div class="sk-chase">
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  </div>
  `;

  resultado.appendChild(spinner);
}