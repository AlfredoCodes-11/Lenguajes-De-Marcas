"use strict";

// Endpoints de la PokéAPI — patrón JS3: constantes para las URLs
const ENDPOINT_LISTA = "https://pokeapi.co/api/v2/pokemon";
const ENDPOINT_TIPO  = "https://pokeapi.co/api/v2/type/";

// Variables globales de estado — patrón JS1: variables con let
let paginaActual      = 1;
let offsetActual      = 0;
let totalPokemon      = 0;
let filtrando         = false;

// Cantidad de Pokémon por página
const POKEMON_POR_PAGINA = 20;


/**
 * @brief Inicializa la página de listado.
 *
 * Configura los eventos de los botones de paginación y el select de tipo,
 * carga los tipos disponibles en el select y lanza la primera página.
 *
 * @return {void} No devuelve ningún valor.
 */
function inicializarLista() {

    const btnSiguiente = document.getElementById("btnSiguiente");
    const btnAnterior  = document.getElementById("btnAnterior");
    const selectTipo   = document.getElementById("selectTipo");

    // Evento click en botón siguiente — patrón JS4: addEventListener con arrow
    btnSiguiente.addEventListener("click", () => {
        offsetActual += POKEMON_POR_PAGINA;
        paginaActual++;
        cargarListaPokemon();
    });

    // Evento click en botón anterior — patrón JS4: referencia a función nombrada
    btnAnterior.addEventListener("click", () => {
        offsetActual -= POKEMON_POR_PAGINA;
        paginaActual--;
        cargarListaPokemon();
    });

    // Evento change en el select de filtro por tipo
    selectTipo.addEventListener("change", () => {
        const tipoSeleccionado = selectTipo.value;
        offsetActual = 0;
        paginaActual = 1;

        if (tipoSeleccionado === "") {
            // Sin filtro: volvemos al listado general
            filtrando = false;
            cargarListaPokemon();
        } else {
            // Con filtro: cargamos los Pokémon del tipo seleccionado
            filtrando = true;
            cargarPokemonPorTipo(tipoSeleccionado);
        }
    });

    // Cargamos los tipos en el select y arrancamos la primera página
    cargarTipos();
    cargarListaPokemon();
}


/**
 * @brief Construye dinámicamente la URL del endpoint de lista con paginación.
 *
 * @param {number} limit  - Cantidad de Pokémon a obtener.
 * @param {number} offset - Posición desde la que empezar.
 * @return {string} La URL completa con los parámetros de búsqueda.
 */
function construirURLLista(limit, offset) {
    // Construimos la URL con parámetros dinámicamente — patrón JS1: template literal
    return `${ENDPOINT_LISTA}?limit=${limit}&offset=${offset}`;
}


/**
 * @brief Construye dinámicamente la URL del endpoint de un tipo concreto.
 *
 * @param {string} tipo - Nombre del tipo.
 * @return {string} La URL completa del endpoint de tipo.
 */
function construirURLTipo(tipo) {
    return `${ENDPOINT_TIPO}${tipo}`;
}


/**
 * @brief Carga y muestra una página del listado general de Pokémon.
 *
 * Realiza una petición al endpoint de lista y luego lanza una petición
 * individual por cada Pokémon para obtener su imagen y tipos.
 *
 * @return {void} No devuelve ningún valor.
 */
function cargarListaPokemon() {

    const mensajeLista  = document.getElementById("mensajeLista");
    const listaPokemons = document.getElementById("listaPokemons");

    // Informamos al usuario y limpiamos el grid
    mensajeLista.textContent = "Cargando Pokémon...";
    mensajeLista.className   = "mensaje-estado";
    listaPokemons.innerHTML  = "";

    actualizarBotonesPaginacion();

    // Construimos la URL con los parámetros de paginación actuales
    const url = construirURLLista(POKEMON_POR_PAGINA, offsetActual);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar la lista. Código HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            totalPokemon = data.count;

            // Actualizamos el mensaje con el número de resultados
            mensajeLista.textContent = `Mostrando ${data.results.length} de ${totalPokemon} Pokémon`;

            // Cargamos cada Pokémon individualmente para tener imagen y tipos
            // Bucle for con for...of — patrón JS2: for con índice
            for (let i = 0; i < data.results.length; i++) {
                cargarDatosMiniCard(data.results[i].url, listaPokemons);
            }

            actualizarBotonesPaginacion();
            actualizarInfoPagina();
        })
        .catch(error => {
            mensajeLista.textContent = "Error al cargar el listado de Pokémon.";
            mensajeLista.className   = "mensaje-estado mensaje-error";
            console.error("Error en cargarListaPokemon:", error);
        });
}


/**
 * @brief Carga los datos individuales de un Pokémon para su mini card.
 *
 * @param {string}      url        - URL del endpoint del Pokémon concreto.
 * @param {HTMLElement} contenedor - El grid donde insertar la mini card.
 * @return {void} No devuelve ningún valor.
 */
function cargarDatosMiniCard(url, contenedor) {

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar Pokémon. Código HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            crearMiniCard(data, contenedor);
        })
        .catch(error => {
            console.error("Error al cargar mini card:", error);
        });
}


/**
 * @brief Crea y añade una mini tarjeta de Pokémon al grid.
 *
 * @param {Object}      data       - Datos del Pokémon obtenidos de la API.
 * @param {HTMLElement} contenedor - El grid donde insertar la mini card.
 * @return {void} No devuelve ningún valor.
 */
function crearMiniCard(data, contenedor) {

    // Construimos el HTML de los badges de tipo con un bucle for
    let htmlTipos = "";
    for (let i = 0; i < data.types.length; i++) {
        const nombreTipo = data.types[i].type.name;
        // Concatenamos el HTML de cada badge — patrón JS1: template literal
        htmlTipos += `<span class="mini-badge-tipo tipo-${nombreTipo}">${nombreTipo}</span>`;
    }

    // Creamos la card con createElement e innerHTML — patrón JS3
    const card = document.createElement("div");
    card.className = "mini-card";
    card.innerHTML = `
        <span class="mini-card-numero">#${String(data.id).padStart(3, "0")}</span>
        <img
            class="mini-card-imagen"
            src="${data.sprites.front_default}"
            alt="Imagen de ${data.name}"
        />
        <span class="mini-card-nombre">${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</span>
        <div class="mini-card-tipos">${htmlTipos}</div>
    `;

    contenedor.appendChild(card);
}


/**
 * @brief Carga los tipos disponibles de la PokéAPI y rellena el select.
 *
 * @return {void} No devuelve ningún valor.
 */
function cargarTipos() {

    const selectTipo = document.getElementById("selectTipo");

    fetch(ENDPOINT_TIPO)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar tipos. Código HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Recorremos el array de tipos y creamos las opciones — patrón JS2: for + createElement + appendChild
            for (let i = 0; i < data.results.length; i++) {
                const nombreTipo = data.results[i].name;

                const opcion = document.createElement("option");
                opcion.value       = nombreTipo;
                // Primera letra en mayúscula — patrón JS2: charAt + slice
                opcion.textContent = nombreTipo.charAt(0).toUpperCase() + nombreTipo.slice(1);

                selectTipo.appendChild(opcion);
            }
        })
        .catch(error => {
            console.error("Error al cargar tipos:", error);
        });
}


/**
 * @brief Carga los Pokémon de un tipo concreto y los muestra en el grid.
 *
 * @param {string} tipo - Nombre del tipo seleccionado.
 * @return {void} No devuelve ningún valor.
 */
function cargarPokemonPorTipo(tipo) {

    const mensajeLista  = document.getElementById("mensajeLista");
    const listaPokemons = document.getElementById("listaPokemons");

    mensajeLista.textContent = `Cargando Pokémon de tipo ${tipo}...`;
    mensajeLista.className   = "mensaje-estado";
    listaPokemons.innerHTML  = "";

    // Ocultamos paginación al filtrar por tipo
    document.getElementById("btnSiguiente").style.display = "none";
    document.getElementById("btnAnterior").style.display  = "none";
    document.getElementById("infoPagina").style.display   = "none";

    // Construimos la URL del tipo dinámicamente
    const url = construirURLTipo(tipo);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar tipo. Código HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const pokemonDelTipo = data.pokemon;

            // Validamos que el array tenga datos — patrón JS3: Array.isArray + length
            if (!Array.isArray(pokemonDelTipo) || pokemonDelTipo.length === 0) {
                throw new Error("No se encontraron Pokémon para este tipo.");
            }

            mensajeLista.textContent = `${pokemonDelTipo.length} Pokémon de tipo ${tipo}`;

            // Mostramos solo los primeros POKEMON_POR_PAGINA para no saturar
            const limite = Math.min(POKEMON_POR_PAGINA, pokemonDelTipo.length);
            for (let i = 0; i < limite; i++) {
                cargarDatosMiniCard(pokemonDelTipo[i].pokemon.url, listaPokemons);
            }
        })
        .catch(error => {
            mensajeLista.textContent = `Error al cargar Pokémon de tipo ${tipo}.`;
            mensajeLista.className   = "mensaje-estado mensaje-error";
            console.error("Error en cargarPokemonPorTipo:", error);
        });
}


/**
 * @brief Actualiza el estado habilitado/deshabilitado de los botones de paginación.
 *
 * @return {void} No devuelve ningún valor.
 */
function actualizarBotonesPaginacion() {

    const btnAnterior  = document.getElementById("btnAnterior");
    const btnSiguiente = document.getElementById("btnSiguiente");
    const infoPagina   = document.getElementById("infoPagina");

    // Restauramos visibilidad por si venimos de un filtro de tipo
    btnAnterior.style.display  = "";
    btnSiguiente.style.display = "";
    infoPagina.style.display   = "";

    // Desactivamos anterior en la primera página — patrón JS1: comparación con ===
    btnAnterior.disabled  = (offsetActual === 0);
    // Desactivamos siguiente si no quedan más Pokémon
    btnSiguiente.disabled = (offsetActual + POKEMON_POR_PAGINA >= totalPokemon);
}


/**
 * @brief Actualiza el texto informativo de página actual / total.
 *
 * @return {void} No devuelve ningún valor.
 */
function actualizarInfoPagina() {
    const infoPagina   = document.getElementById("infoPagina");
    const totalPaginas = Math.ceil(totalPokemon / POKEMON_POR_PAGINA);
    // Template literal — patrón JS1
    infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
}


// Inicializamos cuando el DOM esté completamente cargado — patrón JS2/JS3: DOMContentLoaded
document.addEventListener("DOMContentLoaded", inicializarLista);
