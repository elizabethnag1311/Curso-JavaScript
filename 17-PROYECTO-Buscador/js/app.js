//variables
const marca = document.querySelector("#marca");
const year = document.querySelector("#year");
const minimo = document.querySelector("#minimo");
const maximo = document.querySelector("#maximo");
const puertas = document.querySelector("#puertas");
const transmision = document.querySelector("#transmision");
const color = document.querySelector("#color");

//contenedor para los resultados
const resultado = document.querySelector("#resultado");

const max = new Date().getFullYear();
const min = max - 10;

//generar un objeto con la busqueda
const datosBusqueda = {
  marca: "",
  year: "",
  minimo: "",
  maximo: "",
  puertas: "",
  transmision: "",
  color: "",
}

//eventos

document.addEventListener("DOMContentLoaded", () => {
  mostrarAutos(autos); //muestra los automoviles al cargar la app

  //llena las opciones de year
  llenarSelect();
})

//eventListener para los selec de busqueda

marca.addEventListener("change", e => {
  datosBusqueda.marca = e.target.value;

  filtrarAuto();
});
year.addEventListener("change", e => {
  datosBusqueda.year = parseInt(e.target.value);   //parseInt para convertirlo en los numeros en strings
  filtrarAuto();
});
minimo.addEventListener("change", e => {
  datosBusqueda.minimo = e.target.value;
  filtrarAuto();
});
maximo.addEventListener("change", e => {
  datosBusqueda.maximo = e.target.value;
  filtrarAuto();
});
puertas.addEventListener("change", e => {
  datosBusqueda.puertas = parseInt(e.target.value);
  filtrarAuto();
});
transmision.addEventListener("change", e => {
  datosBusqueda.transmision = e.target.value;
  filtrarAuto();
});
color.addEventListener("change", e => {
  datosBusqueda.color = e.target.value;
  filtrarAuto();
});

//console.log(datosBusqueda);


//funciones

function mostrarAutos(autos) {

  limpiarHtml(); //elimina el HTML previo
  autos.forEach( auto => {
    const {marca, modelo, year, puertas, color, transmision, precio} = auto;
    const autosHtml = document.createElement("p");
    autosHtml.textContent = `
    ${marca} ${modelo} - ${year} - ${puertas}Puertas - Color: ${color} - Transmision: ${transmision} - Precio ${precio}
    `;

    //insertar en el HTML
    resultado.appendChild(autosHtml);
  })
}

//Limpiar el HTML
function limpiarHtml() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

//genera los años del select
function llenarSelect() {
  for (let i = max; i >= min; i--) {
    const opcion = document.createElement("option");
    opcion.value = i;
    opcion.textContent = i;
    year.appendChild(opcion); //agrega las opciones de año al select
  }
}
//funcion que filtra en base a la busqueda
function filtrarAuto() {
  const resultado = autos.filter(filtrarMarca).filter(filtrarYear).filter(filtrarMinimo).filter(FiltrarMaximo)
  .filter(filtrarPuertas).filter(filtrarTransmision).filter(filtrarColor);
  //console.log(resultado);
  if (resultado.length) {
    mostrarAutos(resultado);
  }else {
    noResultado();
  }
}

function noResultado() {
  limpiarHtml();

  const noResultado = document.createElement("div");
  noResultado.classList.add("alerta", "error");
  noResultado.textContent = "No Hay Resultado. Intenta Diferentes Terminos de Búsqueda";
  resultado.appendChild(noResultado);
}

function filtrarMarca(auto) {
  const {marca} = datosBusqueda;
  if (marca) {
    return auto.marca === marca;
  }
  return auto;
}

function filtrarYear(auto) {
  const {year} = datosBusqueda;
  if (year) {
    return auto.year === year;
  }
  return auto;

}
function filtrarMinimo(auto) {
  const {minimo} = datosBusqueda;
  if (minimo) {
    return auto.precio >= minimo;
  }
  return auto;
}

function FiltrarMaximo(auto) {
  const {maximo} = datosBusqueda;
  if (maximo) {
    return auto.precio <= maximo;
  }
  return auto;
}
function filtrarPuertas(auto) {
  const {puertas} = datosBusqueda;
  if (puertas) {
    return auto.puertas === puertas;
  }
  return auto;
}
function filtrarTransmision(auto) {
  const {transmision} = datosBusqueda;
  if (transmision) {
    return auto.transmision === transmision;
  }
  return auto;
}
function filtrarColor(auto) {
  const {color} = datosBusqueda;
  if (color) {
    return auto.color === color;
  }
  return auto;
}

//funcion de alto nivel ,es decir, una funcion que toma otra funcion 