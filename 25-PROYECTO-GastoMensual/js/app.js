//variables y Selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//eventListener
eventListener();
function eventListener() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto)

  formulario.addEventListener("submit", agregarGasto);
}


//clases
class Presupuesto {
  constructor(presupuesto){
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto){
  //agregar al array 
  this.gastos = [...this.gastos, gasto];
  this.calcularRestante()
  }

  calcularRestante(){
    const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    this.restante = this.presupuesto - gastado;
    console.log(this.restante);
  }

  eliminarGasto(id){
    this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    this.calcularRestante()
  }
}


class Ui {
  insertarPresupuesto(cantidad){
    //estrayendo los valores
  const {presupuesto, restante} = cantidad
    //agregar al HTML
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }
  imprimirAlerta(mensaje, tipo){
    //crear el div
    const divAlerta = document.createElement("div");
    divAlerta.classList.add("text-center", "alert");

    if (tipo === "error") {
      divAlerta.classList.add("alert-danger");
    }else {
      divAlerta.classList.add("alert-success");
    }

    //mensaje de error
    divAlerta.textContent = mensaje;

    //insertar en el HTML
    document.querySelector(".primario").insertBefore(divAlerta, formulario);

    setTimeout(() => {
      divAlerta.remove();
    }, 3000);
  }
  mostarGastos(gastos){

    this.limpiarHtml();//limpia el HTML previo

    //iterar sobre los gastos
    gastos.forEach( gasto => {
      const { cantidad, nombre, id } = gasto;

      //crear un li
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
      nuevoGasto.dataset.id = id;

      //crear el HTML del gasto
      nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`;

      //boton para borrar el gasto
      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.innerHTML = 'Borrar &times;'
      btnBorrar.onclick = () => {
        eliminarGasto(id)
      }
      nuevoGasto.appendChild(btnBorrar);

      //agregar el HTML
      gastoListado.appendChild(nuevoGasto);
    });
  }
  limpiarHtml(){
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }
  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const {presupuesto, restante} = presupuestoObj;
    const restanteDiv = document.querySelector(".restante")

    //comprobar 25%
    if ((presupuesto / 4) > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    }else if ((presupuesto / 2) > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    }else {
      restanteDiv.classList.remove("alert-danger","alert-warning");
      restanteDiv.classList.add("alert-success");
    }


    //si el total es 0 o menor
    if (restante <= 0) {
      ui.imprimirAlerta("El presupuesto se ha agotado", "error")
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

const ui = new Ui();
let presupuesto;

//funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("Cual es tu Presupuesto")   //la funcion prompt funciona para crear una alerta cuando el documento esta listo
  console.log(Number(presupuestoUsuario));

  //validar con un if
  if (presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
    window.location.reload();     //recarga la ventana actual si no pasa ninguna validacion establecida
  }
  //presupuesto valido
  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);

  ui.insertarPresupuesto(presupuesto);
}

//añade gastos
function agregarGasto(e) {
  e.preventDefault();

  //lee los datos del formulario
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);     //number para convertir de string a numero

  //validad
  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
    return;
  }else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidada no valida", "error");
    return;
  }
  //generar un objeto con el gasto
  const gasto = {nombre, cantidad, id: Date.now() }
  
  //añade un nuevo gasto
  presupuesto.nuevoGasto(gasto);

  //mensaje de todo correcto
  ui.imprimirAlerta("Gasto agregado correctamente")

  //imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.mostarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);

  //resetea el formulario
  formulario.reset();
}

function eliminarGasto(id) {
  //elimina del objeto
  presupuesto.eliminarGasto(id);

  //elimina los gastos del HTML
  const {gastos, restante} = presupuesto
  ui.mostarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);

}

//destructuring: extrae "nombre y cantidad" de gasto
//Object literal Enhancement: une "nombre y cantidad" a gasto vendria siendo lo contrario de destructuring
//OlE sintaxis: const variable = {}