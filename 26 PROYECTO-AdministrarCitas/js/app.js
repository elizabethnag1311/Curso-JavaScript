//variables del formulario
const mascotainput = document.querySelector("#mascota");
const propietarioinput = document.querySelector("#propietario");
const telefonoinput = document.querySelector("#telefono");
const fechainput = document.querySelector("#fecha");
const horainput = document.querySelector("#hora");
const sintomasinput = document.querySelector("#sintomas");

//variables de UI
const formulario = document.querySelector("#nueva-cita");
const listaCitas = document.querySelector("#citas");

let editando;

//clases
class Citas {
  constructor() {
    this.citas = [];
  }
  agregarCita(cita) {
    this.citas = [...this.citas, cita];
  }

  eliminarCita(id) {
    this.citas = this.citas.filter(cita => cita.id !== id)
  }

  editarCita(citaActualizada) {
    this.citas = this.citas.map(cita => cita.id ===citaActualizada.id ? citaActualizada : cita)
  }
}

class Ui {
  mensajeAlerta(mensaje, tipo){
//crear el div
  const divAlerta = document.createElement("div");
  divAlerta.classList.add("text-center", "alert", "d-block", "col-12", "font-weight-bolder");
//agregar clase en base al tipo de error
  if (tipo === "error") {
    divAlerta.classList.add("alert-danger");
  }else {
    divAlerta.classList.add("alert-success");
  }
//mensaje de error
  divAlerta.textContent = mensaje
//agregar al DOM
  document.querySelector("#contenido").insertBefore(divAlerta, document.querySelector(".agregar-cita"));
//quitar despues de 5seg
setTimeout(() => {
  divAlerta.remove();
}, 5000);
 }
 


 imprimirCitas({citas}) {         //metodo({}): interfas para hacer destructuring directamente desde el parametro

  this.limpiarHtml();

  citas.forEach(cita => {
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    const citaDiv = document.createElement("div");
    citaDiv.classList.add("cita", "p-3");
    citaDiv.dataset.id = id;

    //scripting de los elementos de la cita
    const mascotaH2 = document.createElement("h2");
    mascotaH2.classList.add("card-title", "font-weight-bolder");
    mascotaH2.textContent = mascota;

    const propietarioP = document.createElement("p");
    propietarioP.innerHTML = `
    <span class="font-weight-bolder">Propietario: </span> ${propietario}`;

    const telefonoP = document.createElement("p");
    telefonoP.innerHTML = `
    <span class="font-weight-bolder">Telefono: </span> ${telefono}`;

    const fechaP = document.createElement("p");
    fechaP.innerHTML = `
    <span class="font-weight-bolder">Fecha: </span> ${fecha}`;

    const horaP = document.createElement("p");
    horaP.innerHTML = `
    <span class="font-weight-bolder">Hora: </span> ${hora}`;

    const sintomasP = document.createElement("p");
    sintomasP.innerHTML = `
    <span class="font-weight-bolder">Sintomas: </span> ${sintomas}`;

    //boton para eliminar la cita
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-danger", "mr-2")
    btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    btnEliminar.onclick = () => eliminarCita(id)

    //añade un boton para editar
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("btn", "btn-info");
    btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
    btnEditar.onclick = () => cargarEdicion(cita);
    
    //agregar el h2 y los parrafos a citaDiv
    citaDiv.appendChild(mascotaH2);
    citaDiv.appendChild(propietarioP);
    citaDiv.appendChild(telefonoP);
    citaDiv.appendChild(fechaP);
    citaDiv.appendChild(horaP);
    citaDiv.appendChild(sintomasP);
    citaDiv.appendChild(btnEliminar);
    citaDiv.appendChild(btnEditar);

      //agregar citaDiv al HTML
      listaCitas.appendChild(citaDiv);
  });
 }

 //limpia el Html previo
 limpiarHtml(){
  while (listaCitas.firstChild) {
    listaCitas.removeChild(listaCitas.firstChild)
  }
 }

}

//instarciar
const manejarCitas = new Citas();

const ui = new Ui();


//eventListener
eventListener();
function eventListener() {
  mascotainput.addEventListener("input", datosCita);
  propietarioinput.addEventListener("input", datosCita);
  telefonoinput.addEventListener("input", datosCita);
  fechainput.addEventListener("input", datosCita);
  horainput.addEventListener("input", datosCita);
  sintomasinput.addEventListener("input", datosCita);

  formulario.addEventListener("submit", nuevaCita);
}


//objeto con la informacion de la cita
const citaObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas:""
}

//funciones

//agrega datos al objeto de cita
function datosCita(e) {
  citaObj[e.target.name] = e .target.value;         //se usa name ya que es un atrivuto definido en el html y ayudara a ir llenando el valor de las llaves en el obj
}


//valida y agregauna nueva citaa la clase de citas
function nuevaCita(e) {
  e.preventDefault()

  //extraer la informacion del objeto de cita
  const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj

  if (mascota === "" || propietario ==="" || telefono ==="" || fecha ==="" || hora ==="" || sintomas ==="") {
    ui.mensajeAlerta("Todos los campos son obligatorios", "error");
    return;
  }

  if (editando) {
    ui.mensajeAlerta("Editado Correctamente");
    
    //pasar el objeto de la cita a la edicion
    manejarCitas.editarCita({...citaObj})

    //regresar el texto del boton a su estado original
    formulario.querySelector(`button[type="submit"]`).textContent = "Crear Cita";
    //quitar modo edicion
    editando = false;

  }else {
  //generar un id unico
    citaObj.id = Date.now();

  //creando una nueva cita
    manejarCitas.agregarCita({...citaObj});            //sintaxis para pasar solo una copia del objeto y no la referenciaa completa
  
  //mensaje de agregado correctamente
  ui.mensajeAlerta("Se Agrego Correctamente");
  }

 //reiniciar el objeto para la validacion
 reiniciarObj();
 
  //reiniciar el formulario
  formulario.reset();

  //mostar las citas en el HTML
  ui.imprimirCitas(manejarCitas);
}

//reiniciar objeto
function reiniciarObj() {
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintomas = "";
  
}

function eliminarCita(id) {
  //eliminar cita
  manejarCitas.eliminarCita(id);
  //muestra un mensaje al eliminar la cita
  ui.mensajeAlerta("La cita se elimino correctamente");
  //refrescar la lista de citas
  ui.imprimirCitas(manejarCitas);
}


//carga los datos y el modo edicion 
function cargarEdicion(cita) {
  const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

  //llenar los inputs
  mascotainput.value = mascota;
  propietarioinput.value = propietario;
  telefonoinput.value =  telefono;
  fechainput.value = fecha;
  horainput.value = hora;
  sintomasinput.value = sintomas;

  //llenar el objeto
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  //cambiar el texto del boton
  formulario.querySelector(`button[type="submit"]`).textContent = "Guardar cambios";

  editando = true;
}