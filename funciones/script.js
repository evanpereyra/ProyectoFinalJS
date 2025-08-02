/*
****************************************
Entrega Final curso de JavaScript Flez

Pereyra Evangelina 

tema: Veterinaria 
***************************************
*/



import { cargarDatosClientes, cargarDatosMascotas } from "../datos/datos.js";
import { hash } from "../metodos/metodo.js"


/* variables globales */
let cliente = null;
var users
dayjs.locale('es');
const ahora = dayjs();



const url = './datos/usuario.json'


/* funcion asincrona */

fetch(url)
  .then(response => response.json())
  .then(users => {
    console.log("usuarios", users)
    asignarValores(users)
  })

  .catch(error => console.error("Error al cargar datos:", error));


function asignarValores(u) {
  users = u
}



/* botones */

const botonLogout = document.getElementById('btnLogout');
const botonAgregar = document.getElementById('btnAltaMascota');
const botonReserva = document.getElementById('btnReserva');

/* eventos */
const olvidarPass = document.getElementById('olvidarPass');


olvidarPass.addEventListener('click', () => {
  Swal.fire("usa jperez, pass123");

  document.getElementById("username").value = 'jperez  ';
  document.getElementById("password").value = 'pass123';

  console.log("valor", document.getElementById("username").value)
  console.log("pass", document.getElementById("password").value)
}
)


/* Funcion login*/
document.getElementById('panel').style.display = 'none';
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnLogin').addEventListener('click', login);
});


function login() {
  const username = document.getElementById("username").value;
  const password = hash(document.getElementById("password").value);
  let mensaje = ""

  cliente = users.find((u) => u["usuario"] === username && u["contrasenia"] === password)

  if (!cliente) {
    Swal.fire("El usuario no existe");

  }
  if (cliente !== (null && undefined)) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    console.log(loggedInUser)
    if (loggedInUser === username) {

       mensaje = "Ya estás logueado como " + loggedInUser;
    }
    else {
      localStorage.setItem("User", JSON.stringify(cliente));
      localStorage.setItem("loggedInUser", cliente.usuario);
      mensaje = "Inicio de sesión exitoso!";

    }
    Swal.fire(mensaje);
    mostrarPanel()
  }
}



/* funcion logout*/

botonLogout.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('User');
  cliente = null;
  document.getElementById('panel').style.display = 'none';
  document.getElementById('login').style.display = 'block';
  document.getElementById("message").textContent = "";
  document.getElementById("message").textContent = "";
})


function mostrarPanel() {
  const men = cliente.nombre + " " + cliente.apellido
  document.getElementById('clienteNombre').textContent = men;
  document.getElementById('login').style.display = 'none';
  document.getElementById('panel').style.display = 'block';
  buscarMascotasActuales();
  actualizarMascotas();
  
}

/*agregar*/

botonAgregar.addEventListener('click', () => {
  const nombre = document.getElementById('nombreMascota').value.trim();
  const tipo = document.getElementById('tipoMascota').value;
  if (!nombre) return Swal.fire('Ingresá el nombre de la mascota') 
  const mascotas = obtenerMascotas();
  mascotas.push({ nombre, tipo });
  guardarMascotas(mascotas);
  actualizarMascotas();
});


function buscarMascotasActuales() {
  const cont = document.getElementById('listaMascotas');
  cont.innerHTML = '';

  const select = document.getElementById('mascotaTurno');
  select.innerHTML = '';


  guardarMascotas(cliente["mascotas"])
  obtenerMascotas()

}

/*gestion de mascotas*/
function obtenerMascotas() {
  return JSON.parse(localStorage.getItem(`mascotas_${cliente.usuario}`) || '[]');
}

function guardarMascotas(mascotas) {
  localStorage.setItem(`mascotas_${cliente.usuario}`, JSON.stringify(mascotas));
}


function eliminarMascota(index) {
  const mascotas = obtenerMascotas();
  mascotas.splice(index, 1);
  console.log(mascotas)
  guardarMascotas(mascotas);
  actualizarMascotas();
}

function actualizarMascotas() {
  const cont = document.getElementById('listaMascotas');
  cont.innerHTML = '';

  const select = document.getElementById('mascotaTurno');
  select.innerHTML = '';

  obtenerMascotas().forEach((mascota, i) => {
    const div = document.createElement('div');
    div.className = 'mascota-item';

    const nombreHTML = document.createElement('strong');
    nombreHTML.textContent = mascota.nombre;

    const tipoHTML = document.createTextNode(` (${mascota.tipo})`);

    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.addEventListener('click', () => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Eliminar",
        text: "Vas a Borrar a " + mascota.nombre,
        showCancelButton: true,
        confirmButtonText: "Elininar",
        cancelButtonText: "Cancelar",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {

          swalWithBootstrapButtons.fire({
            title: "Eliminado",
            text: "mascota " + mascota.nombre + " fue eliminada",
                      
          });
          eliminarMascota(i)
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelado",
            text: "mascota " + mascota.nombre + " sigue igual",
           
          });
        }
      });
    } 
   
  
  );

    div.appendChild(nombreHTML);
    div.appendChild(tipoHTML);
    div.appendChild(btn);
    cont.appendChild(div);

    const opt = document.createElement('option');
    opt.value = mascota.nombre;
    opt.textContent = mascota.nombre;
    select.appendChild(opt);
  });

}

/*turno*/

botonReserva.addEventListener('click', () => {

  reservarTurno()


});



function obtenerTurnos() {
  //return JSON.parse(localStorage.getItem(`turnos_${cliente.usuario}`) || '[]');
  try {
    const data = localStorage.getItem(`turnos_${cliente?.usuario}`);
    const parsed = JSON.parse(data || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error al obtener turnos:", e);
    return [];
  }
}

function guardarTurnos(turnos) {
  localStorage.setItem(`turnos_${cliente.usuario}`, JSON.stringify(turnos));
}

function reservarTurno() {
  const fecha = document.getElementById('fechaTurno').value;
  const mascota = document.getElementById('mascotaTurno').value;
  console.log("fecha y mascota", fecha + mascota)
  

  if(fecha < ahora.format()) return Swal.fire('La fecha no puede ser menor a la fecha actual');
  if(!esDiaHabil(fecha)) return Swal.fire('La fecha no es dia habil, escoja otra fecha')
  if (!fecha || !mascota) return Swal.fire('Completá todos los campos');

  //alert('Completá todos los campos');

  const turnos = obtenerTurnos();
  const duplicados = turnos.find((t) => t["fecha"] === fecha && t["mascota"] === mascota)
  if (!duplicados) turnos.push({ fecha, mascota });
  guardarTurnos(turnos);
  actualizarTurnos();
  if (duplicados) return Swal.fire(mascota + ' ya tiene un turno reservado para la día: ' + dayjs(fecha).format('dddd')+ ' ' + dayjs(fecha).format('DD/MM/YYYY'));
   
}



function actualizarTurnos() {
  const cont = document.getElementById('listaTurnos');
  cont.innerHTML = '<h4>Turnos reservados</h4>';
  obtenerTurnos().forEach((turno, i) => {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    div.textContent = `${dayjs(turno.fecha).format('DD/MM/YYYY')} - ${dayjs(turno.fecha).format('dddd')} - ${turno.mascota}`;
    cont.appendChild(div);

    btn.textContent = 'Eliminar';
    btn.addEventListener('click', () => {
      /*Esta seguro que quiere eliminar*/

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Eliminar",
        text: "Vas a eliminar un turno",
        showCancelButton: true,
        confirmButtonText: "Elininar",
        cancelButtonText: "Cancelar",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {

          swalWithBootstrapButtons.fire({
            title: "Eliminado",
            text: "tu turno fue eliminado",            
          });
          eliminarTurno(i)
        } else if (
          
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelado",
            text: "tu turno sigue igual",
           });
        }
      });


      
    });
    div.appendChild(btn);
  });


}

 function eliminarTurno(index) {
    console.log(index)
    const turnos = obtenerTurnos();
    if(turnos.legth === 0) {console.log("no tiene turnos reservados")}
    turnos.splice(index, 1);
    guardarTurnos(turnos);
    actualizarTurnos();
 }

function esDiaHabil(diaTurno) {
      return (dayjs(diaTurno).day() !== 0 && dayjs(diaTurno).day() !==  6)
    
}

