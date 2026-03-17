



let victorias = 0;
let derrotas = 0;
let empates = 0;

//Array con las posibles elecciones
const elecciones = ["piedra", "papel", "tijera", "lagarto", "spock"];

//Objeto que guarda el icono de cada elección
const iconos = {
  piedra: "🪨",
  papel: "📄",
  tijera: "✂️",
  lagarto: "🦎",
  spock: "🖖",
};

//Diccionario con las jugadas segun cada elección
const reglas = {
  piedra: ["tijera", "lagarto"],
  papel: ["piedra", "spock"],
  tijera: ["papel", "lagarto"],
  lagarto: ["spock", "papel"],
  spock: ["tijera", "piedra"],
};





/** 
* @brief Inicializa el juego configurando los elementos, estados y eventos necesarios. 
* 
* Esta función prepara todo lo necesario para que el juego pueda comenzar, 
* incluyendo la configuración de la interfaz, los valores iniciales de los 
* jugadores y la vinculación de eventos a los controles. 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function inicializarJuego() { 
 
    victorias = 0;
    derrotas = 0;
    empates = 0;

    actualizarContadores();
    reiniciarDisplays();
    inicializarTooltips();

    const botones = document.querySelectorAll(".boton-eleccion-jugada");

    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click", () => {
            jugar(botones[i].id);
        });
    }

    const botonReiniciar = document.getElementById("boton-reiniciar");
    botonReiniciar.addEventListener("click", resetearJuego);


    const botonReglas = document.getElementById("boton-reglas");
    botonReglas.addEventListener("click", mostrarReglas);
}


/** 
* @brief Ejecuta una ronda del juego con la elección del usuario. 
* 
* Esta función realiza los siguientes pasos: 
* 1. Reinicia los displays del juego. 
* 2. Genera la elección de la CPU de forma aleatoria. 
* 3. Muestra la elección del usuario y de la CPU con animaciones. 
* 4. Calcula el resultado de la ronda. 
* 5. Muestra el resultado y actualiza los contadores correspondientes. 
* 
* @param {string} eleccionUsuario - La elección realizada por el usuario (por ejemplo: "piedra", "papel", "tijera"...). 
* @return {void} No devuelve ningún valor. 
*/ 
function jugar(eleccionUsuario) {
    
    reiniciarDisplays();
    //Obtenemos la eleccion de la cpu
    const eleccionCPU = obtenerEleccionCPU();
    
    //Contenedores de las jugadas
    const displayJugador = document.getElementById("jugada-jugador");
    const displayCPU = document.getElementById("jugada-cpu");

    //Se muestran las elecciones
    mostrarEleccion(displayJugador, eleccionUsuario, "TÚ");
    mostrarEleccion(displayCPU, eleccionCPU, "CPU");

    const resultado = calcularResultadoJugada(eleccionUsuario, eleccionCPU);

    mostrarResultadoJugada(resultado, eleccionUsuario, eleccionCPU);

}


/** 
* @brief Genera aleatoriamente la elección de la CPU. 
* 
* Esta función selecciona una opción al azar entre las disponibles y la devuelve. 
* 
* @return {string} La elección de la CPU (por ejemplo: "piedra", "papel" o "tijera"...). 
*/ 
function obtenerEleccionCPU() {

    const indice = Math.floor(Math.random() * elecciones.length);
    return elecciones[indice];

}



/** 
* @brief Muestra la elección de un jugador (jugador humano o CPU) en un display con icono y texto. 
* 
* Esta función limpia el contenido del display, aplica la clase 
* para animación/estilo y agrega los elementos que representan 
* la jugada seleccionada (emoji y texto) del jugador indicado. 
* 
* @param {HTMLElement} display - El contenedor donde se mostrará la elección. 
* @param {string} eleccion - La clave de la elección (por ejemplo: "piedra", "papel", "tijera"...). 
* @param {string} jugador - Nombre del jugador que realizó la elección (por ejemplo: "JUGADOR" o "CPU"). 
* @return {void} No devuelve ningún valor. 
*/ 
function mostrarEleccion(display, eleccion, jugador) {

    display.innerHTML = "";
    //añadimos la clase active
    display.classList.add("active");

    const icono = document.createElement("div");
    icono.classList.add("icono-jugada-grande");
    icono.textContent = iconos[eleccion];

    const texto = document.createElement("div");
    texto.classList.add("texto-jugada");
    //Ponemos la primera letra en mayúscula y concatenamos el resto
    texto.textContent = eleccion.charAt(0).toUpperCase() + eleccion.slice(1);
    
    //Insertamos icono y texto
    display.appendChild(icono);
    display.appendChild(texto);

}



/** 
* @brief Reinicia los displays del juego a su estado inicial. 
* 
* Esta función restablece el contenido de los displays del usuario y de la CPU, 
* elimina cualquier clase de animación activa y restablece el mensaje de resultado 
* al texto predeterminado "¡Batalla!". 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function reiniciarDisplays() {

    const displayJugador = document.getElementById("jugada-jugador");
    const displayCPU = document.getElementById("jugada-cpu");
    const mensaje = document.getElementById("mensaje-resultado");

    //Ponemos los placeholder en ?
    displayJugador.innerHTML = '<span class="placeholder">?</span>';
    displayCPU.innerHTML = '<span class="placeholder">?</span>';

    displayJugador.classList.remove("active");
    displayCPU.classList.remove("active");

    mensaje.textContent = "¡Batalla!";
    mensaje.classList.remove("ganador", "perdedor", "empate");

}



/** 
* @brief Calcula el resultado de una ronda entre el usuario y la CPU. 
* 
* Esta función compara la elección del usuario con la elección de la CPU 
* y determina si la ronda termina en victoria, derrota o empate según 
* las reglas del juego. 
* 
* @param {string} usuario - La elección del usuario (por ejemplo: "piedra", "papel", "tijera"...). 
* @param {string} cpu - La elección de la CPU (por ejemplo: "piedra", "papel", "tijera"...). 
* @return {string} El resultado de la ronda: "victoria", "derrota" o "empate". 
*/ 
function calcularResultadoJugada(usuario, cpu) { 
    if (usuario === cpu) {
        return "empate";
    }

    let gana = false;
    for (let i = 0; i < reglas[usuario].length; i++) {
        if (reglas[usuario][i] === cpu) {
            gana = true;
        }
    }
    if (gana) return "victoria";

    return "derrota";
}



/** 
* @brief Muestra el resultado de una ronda en la interfaz del juego. 
* 
* Esta función actualiza el mensaje de resultado según si el usuario ganó, 
* perdió o empató, aplica la clase correspondiente para estilos y 
* actualiza los contadores de victorias, derrotas o empates. 
* 
* @param {string} resultado - Resultado de la ronda: "victoria", "derrota" o "empate". 
* @param {string} usuario - Elección del usuario (por ejemplo: "piedra", "papel", "tijera"...). 
* @param {string} cpu - Elección de la CPU (por ejemplo: "piedra", "papel", "tijera"...). 
* @return {void} No devuelve ningún valor. 
*/ 
function mostrarResultadoJugada(resultado, usuario, cpu) {

    const mensaje = document.getElementById("mensaje-resultado");

    mensaje.classList.remove("ganador", "perdedor", "empate");

    if (resultado === "victoria") {
        mensaje.textContent = "¡Has ganado!";
        mensaje.classList.add("ganador");
        victorias++;
    } 
    else if (resultado === "derrota") {
        mensaje.textContent = "Has perdido...";
        mensaje.classList.add("perdedor");
        derrotas++;
    } 
    else {
        mensaje.textContent = "¡Empate!";
        mensaje.classList.add("empate");
        empates++;
    }

  actualizarContadores();

}



/** 
* @brief Actualiza los contadores de victorias, derrotas y empates en la interfaz. 
* 
* Esta función refleja los valores actuales de las variables globales 
* `victorias`, `derrotas` y `empates` en los elementos del DOM correspondientes. 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function actualizarContadores() { 
    document.getElementById("victorias").textContent = victorias;
    document.getElementById("derrotas").textContent = derrotas;
    document.getElementById("empates").textContent = empates;
}



/** 
* @brief Inicializa los tooltips de los botones de elección. 
* 
* Esta función recorre todos los botones de elección, obtiene la jugada 
* asociada a cada uno y configura el atributo `title` para mostrar 
* un tooltip indicando qué opciones vence esa jugada. 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function inicializarTooltips() { 
    const botones = document.querySelectorAll(".boton-eleccion-jugada");

    for (let i = 0; i < botones.length; i++) {
        const jugada = botones[i].id;
        let venceA = "";

        for (let j = 0; j < reglas[jugada].length; j++) {
            const op = reglas[jugada][j];
            // Primera letra en mayúscula y concatenamos el resto
            venceA += op.charAt(0).toUpperCase() + op.slice(1);
            if (j < reglas[jugada].length - 1) {
                venceA += " y ";
            }
        }
        botones[i].title = `Vence a: ${venceA}`;
    }
}


/** 
* @brief Muestra las reglas completas del juego en la consola. 
* 
* Esta función imprime un resumen de todas las reglas del juego, 
* indicando qué jugada vence a cuáles otras. 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function mostrarReglas() { 
 
    /*const claves = Object.keys(reglas);

    console.log("***REGLAS DEL JUEGO***");

    for (let i = 0; i < claves.length; i++) {
        const jugada = claves[i];
        let venceA = "";
        for (let j = 0; j < reglas[jugada].length; j++) {
            const op = reglas[jugada][j];
            venceA += op.charAt(0).toUpperCase() + op.slice(1);
            if (j < reglas[jugada].length - 1) {
                venceA += " y ";
            }
        }
        console.log(`${jugada.charAt(0).toUpperCase() + jugada.slice(1)} vence a: ${venceA}`);
    }*/

}


/** 
* @brief Reinicia el juego a su estado inicial. 
* 
* Esta función realiza las siguientes acciones: 
* - Restablece los contadores de victorias, derrotas y empates a cero. 
* - Reinicia los displays del juego. 
* - Actualiza los contadores en la interfaz. 
* - Muestra un mensaje temporal indicando que el juego ha sido reiniciado. 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function resetearJuego() { 
    victorias = 0;
    derrotas = 0;
    empates = 0;

    reiniciarDisplays();
    actualizarContadores();

    const mensaje = document.getElementById("mensaje-resultado");
    mensaje.textContent = "¡Empezamos de nuevo!";

}


/** 
* @brief Maneja las pulsaciones de teclas para jugar o reiniciar el juego. 
* 
* Este listener escucha los eventos de teclado (`keydown`) y realiza las siguientes acciones: 
* - Asocia las teclas numéricas '1' a '5' a las elecciones del juego: "piedra", "papel", "tijera", "lagarto" o "spock". 
* - La tecla 'r' reinicia el juego. 
* - La tecla 's' muestra las reglas del juego. 
* 
* @param {KeyboardEvent} event - El evento de pulsación de tecla. 
*/ 
document.addEventListener('keydown', (event) => {
    //Objeto con los números y sus corrspondientes elecciones
    const teclas = {
            "1": "piedra",
            "2": "papel",
            "3": "tijera",
            "4": "lagarto",
            "5": "spock"
    };

    if (teclas[event.key]) {
        jugar(teclas[event.key]);
    } else if (event.key === "r") {
        resetearJuego();
    } else if (event.key === "s") {
        mostrarReglas();
    }
});

// Se espera a que el DOM esté completamente cargado antes de inicializar el juego
document.addEventListener("DOMContentLoaded", inicializarJuego);