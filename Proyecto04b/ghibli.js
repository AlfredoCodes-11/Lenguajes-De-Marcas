"use strict";

// URL de la API
const ENDPOINT = "https://ghibliapi.vercel.app/films";

// Variable global donde guardamos las películas una vez cargadas
let peliculasCargadas = [];


/**
 * @brief Detecta en qué página estamos y lanza la función correspondiente.
 *
 * Comprueba qué elementos existen en el DOM para saber
 * en qué página estamos y llamar a su función de inicio.
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

    if (document.getElementById("tablaRanking") !== null) {
        inicializarRanking();
    }

}


/* ================================================
   INICIO (index.html)
   ================================================ */

/**
 * @brief Inicializa la página de inicio.
 *
 * Pide las películas a la API y cuando las recibe
 * llama a mostrarResumen y mostrarTop4 para pintarlas.
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
            // Guardamos los datos en la variable global
            peliculasCargadas = data;

            // Ocultamos el mensaje de carga
            mensaje.className = "mensaje-estado oculto";

            // Mostramos el resumen y el top 4
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
 * la más reciente y la de mejor puntuación RT.
 *
 * @param {Array} peliculas - Array de películas devuelto por la API.
 * @return {void} No devuelve ningún valor.
 */
function mostrarResumen(peliculas) {

    // Empezamos asumiendo que la primera película es la más antigua, reciente y mejor
    let masAntigua  = peliculas[0];
    let masReciente = peliculas[0];
    let mejorRT     = peliculas[0];

    // Recorremos el resto del array para encontrar los valores reales
    for (let i = 1; i < peliculas.length; i++) {

        if (Number(peliculas[i].release_date) < Number(masAntigua.release_date)) {
            masAntigua = peliculas[i];
        }

        if (Number(peliculas[i].release_date) > Number(masReciente.release_date)) {
            masReciente = peliculas[i];
        }

        if (Number(peliculas[i].rt_score) > Number(mejorRT.rt_score)) {
            mejorRT = peliculas[i];
        }

    }

    // Rellenamos la tabla con los resultados
    document.getElementById("totalPeliculas").textContent   = peliculas.length;
    document.getElementById("peliculaAntigua").textContent  = masAntigua.title + " (" + masAntigua.release_date + ")";
    document.getElementById("peliculaReciente").textContent = masReciente.title + " (" + masReciente.release_date + ")";
    document.getElementById("mejorPuntuacion").textContent  = mejorRT.title + " — " + mejorRT.rt_score + "/100";

    // Mostramos la tabla
    document.getElementById("tablaResumen").className = "tabla";

}


/**
 * @brief Muestra las 4 películas con mejor puntuación RT.
 *
 * Busca las 4 películas con mayor rt_score recorriendo
 * el array 4 veces, una por cada posición del top.
 *
 * @param {Array} peliculas - Array de películas devuelto por la API.
 * @return {void} No devuelve ningún valor.
 */
function mostrarTop4(peliculas) {

    const contenedor = document.getElementById("gridTop");
    contenedor.innerHTML = "";

    // Llevamos un registro de los índices ya usados para no repetir
    const indicesUsados = [];

    // Repetimos 4 veces, una por cada posición del top
    for (let posicion = 0; posicion < 4; posicion++) {

        // Buscamos el índice de la película con mayor rt_score que no hayamos usado ya
        let indiceMejor = -1;

        for (let i = 0; i < peliculas.length; i++) {

            // Comprobamos si este índice ya fue usado
            let yaUsado = false;
            for (let j = 0; j < indicesUsados.length; j++) {
                if (indicesUsados[j] === i) {
                    yaUsado = true;
                }
            }

            if (yaUsado) {
                continue;
            }

            // Si no tenemos candidata todavía, esta es la primera
            if (indiceMejor === -1) {
                indiceMejor = i;
            }

            // Si tiene mejor puntuación que la candidata actual, la sustituimos
            if (Number(peliculas[i].rt_score) > Number(peliculas[indiceMejor].rt_score)) {
                indiceMejor = i;
            }

        }

        // Guardamos el índice como ya usado
        indicesUsados[posicion] = indiceMejor;

        // Creamos la card de esta película
        const pelicula = peliculas[indiceMejor];

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
                    RT Score: ${pelicula.rt_score}/100
                </p>
            </div>
        `;

        contenedor.appendChild(card);

    }

    // Mostramos el grid
    contenedor.className = "grid-peliculas";

}


/* ================================================
   LISTA (lista.html)
   ================================================ */

/**
 * @brief Inicializa la página de listado de películas.
 *
 * Pide las películas a la API y cuando las recibe
 * llama a mostrarLista para pintarlas.
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


/* ================================================
   RANKING (ranking.html)
   ================================================ */

/**
 * @brief Inicializa la página de ranking.
 *
 * Pide las películas a la API, muestra el orden por defecto
 * (más nueva a más antigua) y vincula los eventos de los botones.
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
 * Usa el algoritmo de selección: en cada vuelta busca el mayor año
 * entre los elementos restantes y lo coloca en su posición.
 *
 * @return {void} No devuelve ningún valor.
 */
function mostrarRankingNuevaAntigua() {

    // Copiamos el array para no modificar el original
    const copia = [];
    for (let i = 0; i < peliculasCargadas.length; i++) {
        copia[i] = peliculasCargadas[i];
    }

    // Ordenamos de mayor a menor año (más nueva primero)
    for (let i = 0; i < copia.length - 1; i++) {
        let indiceMayor = i;

        for (let j = i + 1; j < copia.length; j++) {
            if (Number(copia[j].release_date) > Number(copia[indiceMayor].release_date)) {
                indiceMayor = j;
            }
        }

        // Intercambiamos si encontramos uno mayor
        if (indiceMayor !== i) {
            const temporal     = copia[i];
            copia[i]           = copia[indiceMayor];
            copia[indiceMayor] = temporal;
        }
    }

    mostrarTablaRanking(copia);

}


/**
 * @brief Ordena las películas de más antigua a más nueva y las muestra en la tabla.
 *
 * Usa el algoritmo de selección: en cada vuelta busca el menor año
 * entre los elementos restantes y lo coloca en su posición.
 *
 * @return {void} No devuelve ningún valor.
 */
function mostrarRankingAntiguaNueva() {

    // Copiamos el array para no modificar el original
    const copia = [];
    for (let i = 0; i < peliculasCargadas.length; i++) {
        copia[i] = peliculasCargadas[i];
    }

    // Ordenamos de menor a mayor año (más antigua primero)
    for (let i = 0; i < copia.length - 1; i++) {
        let indiceMenor = i;

        for (let j = i + 1; j < copia.length; j++) {
            if (Number(copia[j].release_date) < Number(copia[indiceMenor].release_date)) {
                indiceMenor = j;
            }
        }

        // Intercambiamos si encontramos uno menor
        if (indiceMenor !== i) {
            const temporal     = copia[i];
            copia[i]           = copia[indiceMenor];
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


// Iniciamos todo cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", inicializar);
