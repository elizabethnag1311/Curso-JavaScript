//variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

//funcion para registrar todos los eventlistener

cargarEventListeners();  //llamar la funcion para que no quedn en la ventana global
function cargarEventListeners() {
  //agregar un curso dando click en "agregar al carrito"
  listaCursos.addEventListener("click", agregarCurso);

  //eliminar cursos del carrito
  carrito.addEventListener("click", eliminarCurso);

  //muestra los cursos de Local Storage
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carritoHtml();
  })

  //vaciar carrito
  vaciarCarritoBtn.addEventListener("click", () => {
    articulosCarrito = []; //receteamos el array
    limpiarHtml(); //se elimina todo el HTML
  })
  
}

//funciones
function agregarCurso(e) {  
  e.preventDefault();                                                       //preventDefault para prevenir la accion automatica de enviar hacia el enlace (mientras no se tenga dicho enlace)
   if (e.target.classList.contains("agregar-carrito")) {  
    const cursoSeleccionado = e.target.parentElement.parentElement;        //.contains para prevenir el eventbubbling
     leerDatosCurso(cursoSeleccionado);                                    //y solo ejecute el event listener al dar click en el boton de "agregar al carrito"  
    }                                                                      //e.target hace referencia al elemnto unico y .parentElement hace traversing para acceder a los elemntos padres para selelccionar el conjunto
}
 //elimina un curso del carrito
 function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");

    //eliminar del array de articulosCarrito por el data-id
    articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
    carritoHtml();  //iterar sobre el carrito y mostar el HTML
  }
}

//lee el contenido del HTML al que le dimos click y extrae la info del curso
function leerDatosCurso(curso) {                                            //curso va a tener el contenido del html para hacer referencia en el objeto
  //console.log(curso);
  //crear un objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),                      //ya que cada curso tiene su propio id ,agregamos getAttribute para seleccion dicho ide especifico
    cantidad: 1
  }

 //revisa si un elemnto yaexiste en el carrito
 const existe = articulosCarrito.some( curso => curso.id === infoCurso.id);         //.some para iterar sobre el array
   if (existe) {
  const cursos = articulosCarrito.map(curso => {                                    //.map para crear un nuevo arreglo
   if (curso.id === infoCurso.id ) {
      curso.cantidad++;
      return curso; //retorno el objeto actualizado
   }else {
      return curso; //retorna los objetos que no son duplicados
     }
  });
  articulosCarrito = [...cursos];
   }else {
  //agrega elementos al array de carrito
  articulosCarrito = [...articulosCarrito, infoCurso];
 }


  console.log(articulosCarrito);
  carritoHtml();

}

//muestra el carrito de compras en el HTML

function carritoHtml() {

  //limpiar el html
   limpiarHtml();

//recorre el carrito y genera el HTML
  articulosCarrito.forEach( curso => {
    const {imagen, titulo, precio, cantidad, id} = curso;
    const row = document.createElement("tr");
    row.innerHTML = `
    <td> <img src="${imagen}" width="100"> </td>
    <td> ${titulo} </td>
    <td> ${precio} </td>
    <td> ${cantidad} </td>
    <td> <a href="#" class="borrar-curso" data-id="${id}"> X </a> </td>`;
  

    //agrega el HTML del carrito en el tbody
    contenedorCarrito.appendChild(row);
  });

   //agregar el carrito de compras al Local Storage
   sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}


//elimina los cursos ddel tbody
function limpiarHtml() {
  //forma lenta
  //contenedorCarrito.innerHTML = "";

  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild)
  }
}