"use strict";

// Endpoint base de la PokéAPI — patrón JS3: constante para la URL de la API
const ENDPOINT_POKEMON = "https://pokeapi.co/api/v2/pokemon/";

// Objeto diccionario para traducir nombres de stats — patrón JS2: objeto como diccionario
const NOMBRES_STAT = {
    "hp":               "HP",
    "attack":           "Ataque",
    "defense":          "Defensa",
    "special-attack":   "Atq. Esp.",
    "special-defense":  "Def. Esp.",
    "speed":            "Velocidad"
};


/**
 * @brief Inicializa la funcionalidad de la página buscador.
 *
 * Vincula los eventos de los botones de búsqueda, búsquedas rápidas
 * y la tecla Enter del input una vez que el DOM está completamente cargado.
 *
 * @return {void} No devuelve ningún valor.
 */
function inicializarBuscador() {

    const btnBuscar        = document.getElementById("btnBuscar");
    const inputBusqueda    = document.getElementById("inputBusqueda");
    const botonesRapidos   = document.querySelectorAll(".boton-secundario");

    // Evento click en el botón principal de búsqueda — patrón JS4: addEventListener con arrow
    btnBuscar.addEventListener("click", () => {
        const termino = inputBusqueda.value.trim().toLowerCase();
        if (termino === "") {
            mostrarMensaje("Escribe un nombre o número de Pokémon.", false);
            return;
        }
        buscarPokemon(termino);
    });

    // Evento keydown para buscar al pulsar Enter — patrón JS4: addEventListener con keydown
    inputBusqueda.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const termino = inputBusqueda.value.trim().toLowerCase();
            if (termino !== "") {
                buscarPokemon(termino);
            }
        }
    });

    // Eventos click en los botones de acceso rápido — patrón JS2: bucle for con índice
    for (let i = 0; i < botonesRapidos.length; i++) {
        botonesRapidos[i].addEventListener("click", () => {
            // Acceso con corchetes a atributo data — patrón JS2: notación con corchetes
            const pokemon = botonesRapidos[i].getAttribute("data-pokemon");
            inputBusqueda.value = pokemon;
            buscarPokemon(pokemon);
        });
    }
}


/**
 * @brief Construye dinámicamente la URL del endpoint para un Pokémon concreto.
 *
 * @param {string} termino - Nombre o número del Pokémon a buscar.
 * @return {string} La URL completa del endpoint.
 */
function construirURL(termino) {
    // Construcción dinámica de la URL — patrón JS1: concatenación con template literal
    return `${ENDPOINT_POKEMON}${termino}`;
}


/**
 * @brief Realiza la petición HTTP a la PokéAPI y muestra los datos del Pokémon.
 *
 * Usa fetch() con .then() para consumir la promesa y .catch() para gestionar
 * errores de red o respuesta no válida.
 *
 * @param {string} termino - Nombre o número del Pokémon a buscar.
 * @return {void} No devuelve ningún valor.
 */
function buscarPokemon(termino) {

    // Informamos al usuario de que la petición está en curso
    mostrarMensaje("Buscando...", false);
    ocultarCard();

    // Construimos la URL dinámicamente con el término introducido
    const url = construirURL(termino);

    // Petición HTTP — patrón JS2/JS3: fetch + .then + .catch
    fetch(url)
        .then(response => {
            // Comprobamos si la respuesta es correcta — patrón JS2: response.ok
            if (!response.ok) {
                throw new Error(`Pokémon no encontrado. Código HTTP: ${response.status}`);
            }
            // Convertimos el body a JSON — patrón JS2: response.json()
            return response.json();
        })
        .then(data => {
            // data es ya un objeto JS con los datos del Pokémon
            mostrarPokemon(data);
        })
        .catch(error => {
            // Gestionamos errores de red o throw anterior — patrón JS2/JS3: .catch
            mostrarMensaje(`No se encontró ningún Pokémon con "${termino}".`, true);
            console.error("Error en buscarPokemon:", error);
        });
}


/**
 * @brief Muestra los datos del Pokémon en el DOM.
 *
 * Rellena todos los elementos de la card con la información
 * recibida de la API: número, nombre, imagen, tipos, stats,
 * altura, peso, experiencia base y habilidades.
 *
 * @param {Object} data - Objeto con los datos del Pokémon devueltos por la API.
 * @return {void} No devuelve ningún valor.
 */
function mostrarPokemon(data) {

    ocultarMensaje();

    // Número de Pokédex — patrón JS1: String + template literal
    const numeroPokemon = document.getElementById("numeroPokemon");
    numeroPokemon.textContent = `#${String(data.id).padStart(3, "0")}`;

    // Nombre con primera letra en mayúscula — patrón JS2: charAt + slice
    const nombrePokemon = document.getElementById("nombrePokemon");
    nombrePokemon.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);

    // Imagen — patrón JS3: img.src e img.alt
    const imagenPokemon = document.getElementById("imagenPokemon");
    imagenPokemon.src = data.sprites.other["official-artwork"].front_default;
    imagenPokemon.alt = `Imagen oficial de ${data.name}`;

    // Tipos, stats y habilidades
    mostrarTipos(data.types);
    mostrarStats(data.stats);
    mostrarHabilidades(data.abilities);

    // Altura y peso — la API devuelve decímetros y hectogramos
    document.getElementById("alturaPokemon").textContent = `${data.height / 10} m`;
    document.getElementById("pesoPokemon").textContent   = `${data.weight / 10} kg`;
    document.getElementById("expPokemon").textContent    = data.base_experience;

    mostrarCard();
}


/**
 * @brief Renderiza los badges de tipo del Pokémon en el DOM.
 *
 * @param {Array} tipos - Array de objetos tipo devuelto por la API.
 * @return {void} No devuelve ningún valor.
 */
function mostrarTipos(tipos) {

    const contenedor = document.getElementById("tiposPokemon");
    contenedor.innerHTML = "";

    // Bucle for con índice — patrón JS2
    for (let i = 0; i < tipos.length; i++) {
        const nombreTipo = tipos[i].type.name;

        // Creamos el badge con createElement — patrón JS3
        const badge = document.createElement("span");
        badge.textContent = nombreTipo.charAt(0).toUpperCase() + nombreTipo.slice(1);
        badge.className   = `badge-tipo tipo-${nombreTipo}`;

        contenedor.appendChild(badge);
    }
}


/**
 * @brief Renderiza las barras de estadísticas base del Pokémon.
 *
 * @param {Array} stats - Array de objetos stat devuelto por la API.
 * @return {void} No devuelve ningún valor.
 */
function mostrarStats(stats) {

    const contenedor = document.getElementById("statsPokemon");
    contenedor.innerHTML = "";

    for (let i = 0; i < stats.length; i++) {
        const nombreStat = stats[i].stat.name;
        const valorStat  = stats[i].base_stat;

        // El valor máximo posible de un stat es 255
        const porcentaje = Math.floor((valorStat / 255) * 100);

        // Usamos el diccionario para traducir el nombre — patrón JS2: acceso con corchetes
        const nombreTraducido = NOMBRES_STAT[nombreStat] || nombreStat;

        // Construimos la fila con createElement e innerHTML — patrón JS3
        const fila = document.createElement("div");
        fila.className = "fila-stat";
        fila.innerHTML = `
            <span class="nombre-stat">${nombreTraducido}</span>
            <span class="valor-stat">${valorStat}</span>
            <div class="barra-fondo">
                <div class="barra-relleno" style="width: ${porcentaje}%"></div>
            </div>
        `;

        contenedor.appendChild(fila);
    }
}


/**
 * @brief Renderiza los badges de habilidades del Pokémon.
 *
 * @param {Array} habilidades - Array de objetos ability devuelto por la API.
 * @return {void} No devuelve ningún valor.
 */
function mostrarHabilidades(habilidades) {

    const contenedor = document.getElementById("habilidadesPokemon");
    contenedor.innerHTML = "";

    for (let i = 0; i < habilidades.length; i++) {
        const nombreHabilidad = habilidades[i].ability.name;

        const badge = document.createElement("span");
        badge.textContent = nombreHabilidad.charAt(0).toUpperCase() + nombreHabilidad.slice(1);
        badge.className   = "badge-habilidad";

        contenedor.appendChild(badge);
    }
}


/**
 * @brief Muestra un mensaje de estado en la interfaz.
 *
 * @param {string} texto   - El texto del mensaje a mostrar.
 * @param {boolean} esError - Si es true aplica estilo de error.
 * @return {void} No devuelve ningún valor.
 */
function mostrarMensaje(texto, esError) {
    const mensaje = document.getElementById("mensajeBuscador");
    mensaje.textContent = texto;
    // Asignamos className completo — patrón JS3: elemento.className
    mensaje.className = esError ? "mensaje-estado mensaje-error" : "mensaje-estado";
}


/**
 * @brief Oculta el mensaje de estado.
 *
 * @return {void} No devuelve ningún valor.
 */
function ocultarMensaje() {
    const mensaje = document.getElementById("mensajeBuscador");
    mensaje.className = "mensaje-estado oculto";
}


/**
 * @brief Muestra la card del Pokémon quitando la clase oculto.
 *
 * @return {void} No devuelve ningún valor.
 */
function mostrarCard() {
    const card = document.getElementById("cardPokemon");
    card.className = "card-pokemon";
}


/**
 * @brief Oculta la card del Pokémon añadiendo la clase oculto.
 *
 * @return {void} No devuelve ningún valor.
 */
function ocultarCard() {
    const card = document.getElementById("cardPokemon");
    card.className = "card-pokemon oculto";
}


// Inicializamos cuando el DOM esté completamente cargado — patrón JS2/JS3: DOMContentLoaded
document.addEventListener("DOMContentLoaded", inicializarBuscador);
