/*****************************************************************************/
/* Módulo profesional: Lenguajes de marcas y sistemas de gestión información */
/* Unidad didáctica 04 - Definición y validación de JSON                     */
/* Alumno: Nombre y Apellidos                                                */
/*****************************************************************************/

/* Endpoints */
const URL_PERSONAJES = "https://thesimpsonsapi.com/api/characters";
const URL_PERSONAJE_ID = "https://thesimpsonsapi.com/api/characters/";
const URL_CDN_500 = "https://cdn.thesimpsonsapi.com/500";

/* Variables globales */
let idActual = 1;
let totalPersonajes = 0;

/* Elementos del DOM */
const btnPrimero = document.getElementById("btnPrimero");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnUltimo = document.getElementById("btnUltimo");

const imagenPersonaje = document.getElementById("imagenPersonaje");
const nombrePersonaje = document.getElementById("nombrePersonaje");
const edadPersonaje = document.getElementById("edadPersonaje");
const estadoPersonaje = document.getElementById("estadoPersonaje");
const generoPersonaje = document.getElementById("generoPersonaje");
const ocupacionPersonaje = document.getElementById("ocupacionPersonaje");
const descripcionPersonaje = document.getElementById("descripcionPersonaje");
const frasesPersonaje = document.getElementById("frasesPersonaje");
const contadorPersonaje = document.getElementById("contadorPersonaje");


/* Ejecuta la inicialización una vez que el DOM está completamente cargado */
document.addEventListener('DOMContentLoaded', () => {
    /* Inicio: obtener el total de personajes y pintar el primero */
    cargarTotalPersonajes();
    mostrarPersonajeActual();
    //TODO

    /* Botones de navegación */
    if (btnPrimero) {
        btnPrimero.addEventListener("click", function () {
            idActual = 1;
            mostrarPersonajeActual();
        });
    }

    if(btnAnterior) {
        btnAnterior.addEventListener("click", function () {
            if (idActual > 1) {
                idActual--;
                mostrarPersonajeActual();
            }
        });
    }

    if (btnSiguiente) {
        btnSiguiente.addEventListener("click", function () {
            if (idActual < totalPersonajes) {
                idActual++;
                mostrarPersonajeActual();
            }
        });
    }

    if (btnUltimo) {
        btnUltimo.addEventListener("click", function () {
            idActual = totalPersonajes;
            mostrarPersonajeActual();
        });
    }
});

/**
 * Carga y muestra el personaje actual.
 */
function mostrarPersonajeActual() {
    obtenerPersonajePorId(idActual);
}

/**
 * Obtiene los datos de un personaje a partir de su ID.
 * @param {number} id ID del personaje.
 */
function obtenerPersonajePorId(id) {
    fetch(URL_PERSONAJE_ID + id)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error("No se pudo cargar el personaje cuyo ID es "+id);

            }
            return reponse.json();
        })
        .then(personaje => {
            nombrePersonaje.textContent = personaje.name;
            edadPersonaje.textContent = "Edad: "+personaje.age;
            estadoPersonaje.textContent = personaje.status;
            generoPersonaje.textContent = personaje.gender;
            ocupacionPersonaje.textContent = personaje.occupation;
            descripcionPersonaje.textContent = personaje.description;
            pintarFrases(personaje.phrases);
            imagenPersonaje.src = URL_CDN_500 + personaje.portrait_path;
            imagenPersonaje.alt = personaje.name
                ? "Imagen de " + personaje.name: "Imagen del personaje"
            contadorPersonaje.textContent = "Personaje " + idActual + " de " + totalPersonajes;
        })
}

function cargarTotalPersonajes(){
    fetch(URL_PERSONAJES)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error("No se pudo obtener el total de personajes");

            }
            return reponse.json();
        })
        .then (data => {
            totalPersonajes = data.count;
        })
        .catch(error => {
            console.error(error);
            totalPersonajes=0;
        })
}

function pintarFrases(frases){
    frasesPersonaje.innerHTML="";
}
