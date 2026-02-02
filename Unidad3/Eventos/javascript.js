"use strict";
const nombre = "Sergio";

// Gestión de eventos
// 1ª forma: atributo HTML (❌ no recomendable)

// function saludar() {
//    const texto = document.querySelector(".salida");
//    texto.textContent = `Salida: Hola ${nombre}`;
// }

// 2º forma: API JS setAttribute - Añadimos el atributo HTML
// const boton = document.getElementById("btn");

// boton.setAttribute("onclick","saludar()");
// function saludar() {
//     const texto = document.querySelector(".salida");
//     texto.textContent = `Salida: Hola ${nombre}`;
// }

// 3ª forma: addEventListener ✅ (la mejor)
// const boton = document.getElementById("btn");
// const texto = document.querySelector(".salida");

// boton.addEventListener("click", () => {
//     texto.textContent = `Salida: Hola ${nombre}`;
// });

// Formas de pasar la función a addEventListener
// A) Función definida aparte y pasar referencia (la “clásica”)
// const boton = document.getElementById("btn");
// const texto = document.querySelector(".salida");

// function saludar() {
//     texto.textContent = `Salida: Hola ${nombre}`;
// }

// boton.addEventListener("click", saludar);

// B) El error típico: poner () (se ejecuta al cargar, no al click)
// boton.addEventListener("click", saludar());  //❌ MAL
// boton.addEventListener("click", saludar);    //✅ BIEN

// C) Función anónima (muy común)
// boton.addEventListener("click", function () {
//     texto.textContent = `Salida: Hola ${nombre}`;
// });

// D) Función flecha (de las más usadas actualmente)
// boton.addEventListener("click", () => {
//     texto.textContent = `Salida: Hola ${nombre}`;
// });º                                 
// ¿Y si hace falta pasarle parámetros?
// function suma(num1, num2) {
//     texto.textContent = num1+num2;
// }
// boton.addEventListener("click", () => suma(4,6));

// Variante con función anónima
// boton.addEventListener("click", function () {
//     suma(7,8);
// });
const boton = document.getElementById("btn");
const bootnReset = document.getElementById("btnReset");
const texto = document.querySelector(".salida");
let contador = 0;

// boton.addEventListener("click", () => {
//     contador++;
//     texto.textContent = `Salida: has hecho ${contador} click(s)`;
// });

// bootnReset.addEventListener("click", () => {
//     contador=0;
//     texto.textContent = `Salida: contador a ${contador}`;
// });

/*function clicar(){
    texto.textContent = `Salida: has hecho ${boton} click(s)`
}*/

/**Mini reto (avanzado): Combinar evento click + array para mostrar mensajes distintos
*segun el click.
* Cada click muetra el siguiente mensaje de un array
* Cuando llegue el final, vuelve al princinpio (ciclico)
* Si reset, muestra mensaje "Salida: (aun nada)".
*/

const mensajes = ["Primer mensaje", "Segundo mensaje", "Tercer mensaje", "Cuarto mensaje"];

boton.addEventListener("click", () => {
    if (contador < mensajes.length){
        texto.textContent = `${mensajes[contador]}`;
        contador++;
    } else {
        contador=0;
    }
});

bootnReset.addEventListener("click", () => {
    texto.textContent = `Salida: (aun nada)`;
});
