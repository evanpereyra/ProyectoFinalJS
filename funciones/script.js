/*
**********************
Entrega Final curso de JavaScript

Pereyra Evangelina 

tema: Veterinaria 
**********************
*/



import { cargarDatosClientes, cargarDatosMascotas } from "../datos/datos.js";
import { hash} from "../metodos/metodo.js"


 
 
AbortController
 let cliente = null;
 var users 

 /*tomar cliente con fetch*/
 //const url= './datos/datos.json'
  const url= './datos/usuario.json'
/*const res = fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    return response.json(); // Parsea la respuesta como JSON
  })
  .then((data) => {
    // Maneja la respuesta JSON
    console.log("Respuesta del servidor:", data);
    // Aquí puedes usar los datos recibidos del servidor
  })
  .catch((error) => {
    // Maneja errores de la petición
    console.error("Error:", error);
  });
 */


  fetch(url)
      .then(response => response.json())
      .then(users => {
        console.log("usuarios", users)
        asignarValores(users)
      })
        
      .catch(error => console.error("Error al cargar datos:", error));
   

   function asignarValores(u){
        users = u
   }   

  

 /* botones */

const botonLogout = document.getElementById('btnLogout');
const botonAgregar = document.getElementById('btnAltaMascota');
const botonReserva = document.getElementById('btnReserva');



 /* Funcion login*/
document.getElementById('panel').style.display = 'none';
 document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnLogin').addEventListener('click', login);
});


 function login() {
  const username = document.getElementById("username").value;
  const password = hash(document.getElementById("password").value);
  const message = document.getElementById("message");
   
  
  cliente = users.find((u) => u["usuario"] === username && u["contrasenia"] === password)

  if (!cliente) { 
    Swal.fire("El usuario no existe");
    
  }
  if (cliente !== null && undefined){
  message.textContent = "Inicio de sesión exitoso!"

  console.log(cliente)
  const loggedInUser = localStorage.getItem("loggedInUser");
  console.log(loggedInUser)
  if (loggedInUser === username) {
     document.getElementById("message").textContent = "Ya estás logueado como " + loggedInUser; // mensaje afuera
     
  }
  else {
 
  
    console.log(cliente)

    localStorage.setItem("User", JSON.stringify(cliente));
    localStorage.setItem("loggedInUser", cliente.usuario);
    message.textContent = "Inicio de sesión exitoso!";
 
  }

   mostrarPanel()
}
 }



/* funcion logout*/

botonLogout.addEventListener('click' , () => {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('User');
  cliente = null;
  document.getElementById('panel').style.display = 'none';
  document.getElementById('login').style.display = 'block';
  document.getElementById("message").textContent = ""; 
  document.getElementById("message").textContent = ""; 
})


function mostrarPanel() {
      const men =cliente.nombre + " "+ cliente.apellido
      document.getElementById('clienteNombre').textContent = men;
      document.getElementById('login').style.display = 'none';
      document.getElementById('panel').style.display = 'block';
      buscarMascotasActuales();
      actualizarMascotas();
  //    actualizarTurnos();
}

/*agregar*/

botonAgregar.addEventListener('click' , () =>{
  const nombre = document.getElementById('nombreMascota').value.trim();
  const tipo = document.getElementById('tipoMascota').value;
  if (!nombre) return alert('Ingresá el nombre de la mascota');

  const mascotas = obtenerMascotas();
  mascotas.push({ nombre, tipo });
  guardarMascotas(mascotas);
  actualizarMascotas();
});


function buscarMascotasActuales(){
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
      localStorage.setItem(`mascotas_${cliente.usuario}` , JSON.stringify(mascotas));
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
  btn.addEventListener('click', () => eliminarMascota(i));

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

botonReserva.addEventListener('click' , () => {
  
  reservarTurno()


});



function obtenerTurnos() {
      return JSON.parse(localStorage.getItem(`turnos_${cliente.usuario}`) || '[]');
    }

function guardarTurnos(turnos) {
      localStorage.setItem(`turnos_${cliente.usuario}`, JSON.stringify(turnos));
    }

function reservarTurno() {
      const fecha = document.getElementById('fechaTurno').value;
      const mascota = document.getElementById('mascotaTurno').value;
      console.log("fecha y mascota", fecha + mascota)
      if (!fecha || !mascota) return alert('Completá todos los campos');

   //   const turnos = obtenerTurnos() ?? [];
      const turnos = [];
      turnos.push({fecha, mascota});
      guardarTurnos(turnos);
      actualizarTurnos();
    }

    function actualizarTurnos() {
      const cont = document.getElementById('listaTurnos');
      cont.innerHTML = '<h4>Turnos reservados</h4>';
      obtenerTurnos().forEach((turno ,i) => {
        const div = document.createElement('div');
        const btn = document.createElement('button');
        div.textContent = `${turno.fecha} - ${turno.mascota}`;
        cont.appendChild(div);
         
         btn.textContent = 'Eliminar';
         btn.addEventListener('click', () => eliminarTurno(i));
         div.appendChild(btn);
      });
    }
    

    function eliminarTurno(index) {
       const turnos = obtenerTurnos();
       if(turnos.legth === 0) {console.log("no tiene turnos reservados")}
       turnos.splice(index, 1);
       guardarTurnos();

       actualizarTurnos();
     }


     /* Confirmar la reserva*/
/*Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success"
    });
  }
});
*/
/*estilos*/
