"use strict";

// ENOPOINT para la API
const ENDPOINT = "https://ghibliapi.vercel.app/films";

// Variable para guardar las peliculas cuando se carguen
let peliculasCargadas = [];


/**
 * @brief Compruba en que pag estamos e inicia la funcion de dicha pag
 *
 *
 * @return {void} No devuelve ningún valor.
 */
function inicializar() {

    if (document.getElementById("tablaResumen") !== null) {
        inicializarInicio();
    }

    if (document.getElementById("listaPeliculas") !== null) {
        inicializarLista();
    }

    if (document.getElementById("listaPersonajes") !== null) {
        inicializarPersonajes();
    }

    if (document.getElementById("tablaRanking") !== null) {
        inicializarRanking();
    }

}


/*
   ***INICIO***
*/

/**
 * @brief Inicializa la página de inicio.
 *
 * Pide las películas a la API y cuando las recibe
 * llama a mostrarResumen y mostrarTop4 para mostrarlas.
 *
 * @return {void} No devuelve ningún valor.
 */
function inicializarInicio() {

    const mensaje = document.getElementById("mensajeResumen");
    mensaje.textContent = "Cargando datos...";
    mensaje.className = "mensaje-estado mensaje-cargando";

    fetch(ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al conectar con la API. Código: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            peliculasCargadas = data;
            mensaje.className = "mensaje-estado oculto";
            mostrarResumen(data);
            mostrarTop4(data);
        })
        .catch(error => {
            mensaje.textContent = "Error al cargar los datos: " + error.message;
            mensaje.className = "mensaje-estado mensaje-error";
            console.error(error);
        });

}


/**
 * @brief Muestra la tabla de resumen en la página de inicio.
 *
 * Recorre el array de películas buscando la más antigua,
 * la más reciente y la de mejor puntuación.
 *
 * @param {Array} peliculas - Array de películas devuelto por la API.
 * @return {void} No devuelve ningún valor.
 */
function mostrarResumen(peliculas) {

    let masAntigua = peliculas[0];
    let masReciente = peliculas[0];
    let mejorPuntuacion = peliculas[0];

    for (let i = 1; i < peliculas.length; i++) {
        // Covierto a números los valores del array
        const añoPelicula = peliculas[i].release_date * 1;
        const añoAntigua = masAntigua.release_date * 1;
        const añoReciente = masReciente.release_date * 1;
        const puntPelicula = peliculas[i].rt_score * 1;
        const puntMejor = mejorPuntuacion.rt_score * 1;

        if (añoPelicula < añoAntigua) {
            masAntigua = peliculas[i];
        }
        if (añoPelicula > añoReciente) {
            masReciente = peliculas[i];
        }
        if (puntPelicula > puntMejor) {
            mejorPuntuacion = peliculas[i];
        }

    }

    document.getElementById("totalPeliculas").textContent = peliculas.length;
    document.getElementById("peliculaAntigua").textContent = masAntigua.title + " (" + masAntigua.release_date + ")";
    document.getElementById("peliculaReciente").textContent = masReciente.title + " (" + masReciente.release_date + ")";
    document.getElementById("mejorPuntuacion").textContent = mejorPuntuacion.title + " — " + mejorPuntuacion.rt_score + "/100";

    document.getElementById("tablaResumen").className = "tabla";

}


/**
 * @brief Muestra las 4 películas con mejor puntuación.
 *
 * Busco las 4 mejores peliculas por puntacion,.
 *
 * @param {Array} peliculas - Array de películas devuelto por la API.
 * @return {void} No devuelve ningún valor.
 */
function mostrarTop4(peliculas) {

    const contenedor = document.getElementById("gridTop");
    contenedor.innerHTML = "";

    const titulosUsados = [];

    for (let posicion = 0; posicion < 4; posicion++) {

        let tituloMejor = -1;

        for (let i = 0; i < peliculas.length; i++) {


            let yaUsado = false;
            for (let j = 0; j < titulosUsados.length; j++) {
                if (titulosUsados[j] === i) {
                    yaUsado = true;
                }
            }

            if (yaUsado) {
                continue;
            }

     
            if (tituloMejor === -1) {
                tituloMejor = i;
            }

     
            if (peliculas[i].rt_score * 1 > peliculas[tituloMejor].rt_score * 1) {
                tituloMejor = i;
            }

        }


        titulosUsados[posicion] = tituloMejor;

        const pelicula = peliculas[tituloMejor];

        const card = document.createElement("div");
        card.className = "card-pelicula";

        card.innerHTML = `
            <img
                src="${pelicula.image}"
                alt="Cartel de la película ${pelicula.title}"
            />
            <div class="card-pelicula-info">
                <p class="card-pelicula-titulo">${posicion + 1}. ${pelicula.title}</p>
                <p class="card-pelicula-meta">
                    Director: ${pelicula.director}<br>
                    Año: ${pelicula.release_date}<br>
                    Puntuación: ${pelicula.rt_score}/100
                </p>
            </div>
        `;

        contenedor.appendChild(card);

    }

    contenedor.className = "grid-peliculas";

}


/*
   ***LISTA***
*/

/**
 * @brief Inicializa la página de listado de películas.
 *
 * Pide las películas a la API y cuando las recibe
 * llama a mostrarLista para mostrarlas.
 *
 * @return {void} No devuelve ningún valor.
 */
function inicializarLista() {

    const mensaje = document.getElementById("mensajeLista");
    mensaje.textContent = "Cargando películas...";
    mensaje.className = "mensaje-estado mensaje-cargando";

    fetch(ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al conectar con la API. Código: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            peliculasCargadas = data;
            mensaje.className = "mensaje-estado oculto";
            mostrarLista(data);
        })
        .catch(error => {
            mensaje.textContent = "Error al cargar las películas: " + error.message;
            mensaje.className = "mensaje-estado mensaje-error";
            console.error(error);
        });

}


/**
 * @brief Crea y muestra las tarjetas de todas las películas en el grid.
 *
 * @param {Array} peliculas - Array de películas devuelto por la API.
 * @return {void} No devuelve ningún valor.
 */
function mostrarLista(peliculas) {

    const contenedor = document.getElementById("listaPeliculas");
    contenedor.innerHTML = "";

    for (let i = 0; i < peliculas.length; i++) {

        const pelicula = peliculas[i];

        const card = document.createElement("div");
        card.className = "card-pelicula";

        card.innerHTML = `
            <img
                src="${pelicula.image}"
                alt="Cartel de la película ${pelicula.title}"
            />
            <div class="card-pelicula-info">
                <p class="card-pelicula-titulo">${pelicula.title}</p>
                <p class="card-pelicula-meta">
                    Director: ${pelicula.director}<br>
                    Año: ${pelicula.release_date}<br>
                    Duración: ${pelicula.running_time} min<br>
                    RT Score: ${pelicula.rt_score}/100
                </p>
            </div>
        `;

        contenedor.appendChild(card);

    }

}


/* 
   ***RANKING***
*/

/**
 * @brief Inicializa la página de ranking.
 *
 * Pide las películas a la API, muestra en orden de la mas nueva a la mas antigua.
 *
 * @return {void} No devuelve ningún valor.
 */
function inicializarRanking() {

    const mensaje = document.getElementById("mensajeRanking");
    mensaje.textContent = "Cargando ranking...";
    mensaje.className = "mensaje-estado mensaje-cargando";

    fetch(ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al conectar con la API. Código: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            peliculasCargadas = data;
            mensaje.className = "mensaje-estado oculto";

            // Mostramos el orden por defecto al cargar la página
            mostrarRankingNuevaAntigua();

            // Botón: más nueva a más antigua
            const btnNuevaAntigua = document.getElementById("btnNuevaAntigua");
            btnNuevaAntigua.addEventListener("click", () => {
                mostrarRankingNuevaAntigua();
            });

            // Botón: más antigua a más nueva
            const btnAntiguaNueva = document.getElementById("btnAntiguaNueva");
            btnAntiguaNueva.addEventListener("click", () => {
                mostrarRankingAntiguaNueva();
            });

        })
        .catch(error => {
            mensaje.textContent = "Error al cargar el ranking: " + error.message;
            mensaje.className = "mensaje-estado mensaje-error";
            console.error(error);
        });

}


/**
 * @brief Ordena las películas de más nueva a más antigua y las muestra en la tabla.
 *
 * Utilizamos bucles para ir mostrando en orden de mas nueva a mas antigua
 *
 * @return {void} No devuelve ningún valor.
 */
function mostrarRankingNuevaAntigua() {

    const copia = [];
    for (let i = 0; i < peliculasCargadas.length; i++) {
        copia[i] = peliculasCargadas[i];
    }

    for (let i = 0; i < copia.length - 1; i++) {
        let indiceMayor = i;

        for (let j = i + 1; j < copia.length; j++) {
            if (copia[j].release_date * 1 > copia[indiceMayor].release_date * 1) {
                indiceMayor = j;
            }
        }

        if (indiceMayor !== i) {
            const temporal = copia[i];
            copia[i] = copia[indiceMayor];
            copia[indiceMayor] = temporal;
        }
    }

    mostrarTablaRanking(copia);

}


/**
 * @brief Ordena las películas de más antigua a más nueva y las muestra en la tabla.
 *
 * Utilizamos bucles para ir mostrando en orden de mas antigua a mas nueva
 *
 * @return {void} No devuelve ningún valor.
 */
function mostrarRankingAntiguaNueva() {

    const copia = [];
    for (let i = 0; i < peliculasCargadas.length; i++) {
        copia[i] = peliculasCargadas[i];
    }

    for (let i = 0; i < copia.length - 1; i++) {
        let indiceMenor = i;

        for (let j = i + 1; j < copia.length; j++) {
            if (copia[j].release_date * 1 < copia[indiceMenor].release_date * 1) {
                indiceMenor = j;
            }
        }

        if (indiceMenor !== i) {
            const temporal = copia[i];
            copia[i] = copia[indiceMenor];
            copia[indiceMenor] = temporal;
        }
    }

    mostrarTablaRanking(copia);

}


/**
 * @brief Rellena la tabla de ranking con el array de películas recibido.
 *
 * @param {Array} peliculas - Array de películas ya ordenadas.
 * @return {void} No devuelve ningún valor.
 */
function mostrarTablaRanking(peliculas) {

    const cuerpo = document.getElementById("cuerpoRanking");
    cuerpo.innerHTML = "";

    for (let i = 0; i < peliculas.length; i++) {

        const pelicula = peliculas[i];

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${pelicula.title}</td>
            <td>${pelicula.director}</td>
            <td>${pelicula.release_date}</td>
            <td>${pelicula.running_time} min</td>
            <td>${pelicula.rt_score}/100</td>
        `;

        cuerpo.appendChild(fila);

    }

    document.getElementById("tablaRanking").className = "tabla";

}


document.addEventListener("DOMContentLoaded", inicializar);


/* 
   ***PERSONAJES***
*/

// Endpoints para personajes y películas
const ENDPOINT_PERSONAJES = "https://ghibliapi.vercel.app/people";
const ENDPOINT_FILMS      = "https://ghibliapi.vercel.app/films";

// Variables globales para esta página
let personajesCargados = [];
let filmsCargados      = [];


/**
 * @brief Inicializa la página de personajes.
 *
 * Pide los personajes y las películas a la API.
 * Primero carga las películas y cuando las tiene
 * carga los personajes, para poder cruzar los datos.
 *
 * @return {void} No devuelve ningún valor.
 */
function inicializarPersonajes() {

    const mensaje = document.getElementById("mensajePersonajes");
    mensaje.textContent = "Cargando personajes...";
    mensaje.className = "mensaje-estado mensaje-cargando";

    // Primero pedimos las películas para tener los títulos disponibles
    fetch(ENDPOINT_FILMS)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar películas. Código: " + response.status);
            }
            return response.json();
        })
        .then(dataFilms => {

            filmsCargados = dataFilms;

            // Ahora que tenemos las películas, pedimos los personajes
            return fetch(ENDPOINT_PERSONAJES);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar personajes. Código: " + response.status);
            }
            return response.json();
        })
        .then(dataPersonajes => {


            personajesCargados = dataPersonajes;

            mensaje.className = "mensaje-estado oculto";

            mostrarPersonajes(dataPersonajes);
        })
        .catch(error => {
            mensaje.textContent = "Error al cargar los datos: " + error.message;
            mensaje.className = "mensaje-estado mensaje-error";
            console.error(error);
        });

}


/**
 * @brief Crea y muestra las tarjetas de todos los personajes.
 *
 * Cada tarjeta tiene un listener de click que llama
 * a mostrarDetallePersonaje con los datos del personaje.
 *
 * @param {Array} personajes - Array de personajes devuelto por la API.
 * @return {void} No devuelve ningún valor.
 */
function mostrarPersonajes(personajes) {

    const contenedor = document.getElementById("listaPersonajes");
    contenedor.innerHTML = "";

    for (let i = 0; i < personajes.length; i++) {

        const personaje = personajes[i];

        const card = document.createElement("div");
        card.className = "card-personaje";

        card.innerHTML = `
            <p class="card-personaje-nombre">${personaje.name}</p>
            <p class="card-personaje-edad">Edad: ${personaje.age}</p>
        `;

        card.addEventListener("click", () => {
            mostrarDetallePersonaje(personaje);
        });

        contenedor.appendChild(card);

    }

}


/**
 * @brief Muestra el panel de detalle de un personaje al hacer click.
 *
 * Busca el título de la película del personaje cruzando
 * la URL que devuelve la API con el array de films cargado.
 *
 * @param {Object} personaje - Objeto personaje devuelto por la API.
 * @return {void} No devuelve ningún valor.
 */
function mostrarDetallePersonaje(personaje) {

    let tituloPelicula = "";

    for (let i = 0; i < filmsCargados.length; i++) {
        // Comparamos la URL del film con la primera URL del array films del personaje
        if (filmsCargados[i].url === personaje.films[0]) {
            tituloPelicula = filmsCargados[i].title;
        }
    }

    document.getElementById("detalleNombre").textContent = personaje.name;
    document.getElementById("detallePelicula").textContent = tituloPelicula;
    document.getElementById("detalleGenero").textContent = personaje.gender;
    document.getElementById("detalleEdad").textContent = personaje.age;
    document.getElementById("detalleOjos").textContent = personaje.eye_color;
    document.getElementById("detallePelo").textContent = personaje.hair_color;

    document.getElementById("panelDetalle").className = "tarjeta";


}
