"use strict";

// Variables: let y const
let edad = 18;
console.log("Edad:",edad);
//console.log(edad.constructor.name);
edad = 27;
console.log("Nueva edad: "+edad);

const centro = "CPIFP Alan Turing";
console.log("Centro:",centro);

let puntos= 0;
puntos =+ 10;
console.log("Puntos =",puntos);

// Tipos primitivos y operaciones básicas
const a = 10;
const b = 3;
console.log("Suma:", a + b);
console.log("Resta:", a - b);
console.log("Multiplicación:", a * b);
console.log("División:", a / b);
console.log("Resto (Módulo):", a % b);
console.log("Potenciación:", a ** b);
console.log("Parte entera:", Math.trunc(a/b));


// Tipod primitivos y manejo de Strings

const nombre = "Alfredo";
const apellidos = "Codes Sánchez";
console.log("Hola " + nombre);
console.log(`Nombre: ${nombre} - Apellidos: ${apellidos}`);

// Operadores de comparación
console.log(5>3);

// Operador de identidad (===) --> Comparar valor y tipo
console.log(5 == 5);
console.log(5 == "5");

console.log(5 === "5");

const precio = 99;
const unidades = 4;

console.log(`Precio: ${precio}€ - Unidades: ${unidades} - Total: ${precio*unidades}€`);

// Arrays
const juegos = ["Zelda", "Counter-Striker", "Minecraft"];
console.log("Array completo:", juegos.toString());
console.log("Cantidad:",juegos.length);
console.log("Primer elemento:",juegos[0]);

// Añadir elementos
juegos.push("Fortnite");
console.log("Array completo:", juegos.toString());

// Eliminar elementos
const eliminado = juegos.pop();
console.log("Juegos eliminados:", eliminado);
console.log("Array completo:", juegos.toString());

// Arrays mixtos
const mixto = ["hola", 23, true, {nombre : "Ana"}, [1, 2, 3]];

console.log("Mixto:",mixto);
console.log(`Elmento 0 (${mixto[0].constructor.name}): ${mixto[0]}`);
console.log(`Elmento 1 (${mixto[1].constructor.name}): ${mixto[1]}`);
console.log(`Elmento 2 (${mixto[2].constructor.name}): ${mixto[2]}`);
console.log(`Elmento 3 (${mixto[3].constructor.name}): ${mixto[3].nombre}`);
console.log(`Elmento 4 (${mixto[4].constructor.name}): ${mixto[4]}`);

// Objetos
const alumno = {
    nombre: "Ana",
    curso: "1º DAW",
    edad: 16,
    repetidor: false
};

console.log("Alumno:", alumno);
console.log("Nombre:", alumno.nombre);
console.log("Curso:", alumno.curso);
console.log("Edad:", alumno.edad);
console.log("Repetidor:", alumno.repeditor);
console.log("Nombre:",alumno.nombre+" María");

alumno.nombre = "Ana María"
console.log("Nuevo Nombre:", alumno.nombre);

const productos = {
    nombre: "Portátil",
    precio: 334,
    stock: 34
}

console.log(`Producto: ${productos.nombre} - Precio: ${productos.precio}€ - Stock: ${productos.stock}.`);

// Funciones. Si no hay return, devuelve undefined

function total(precio,unidades) {
    return precio * unidades;
}

console.log("Total 9.99 x 3 =", total(9.99,3));

// Función declarada como expresión (como valor de una variable)
const saludar = function (nombre) {
    return `Hola ${nombre}`;
}

console.log(saludar("Alfredo"));

// Función arrow o flecha: en JS moderno
const func = function () {
    return "Función tradicional.";
};

const func2 = () => {
    //cuerpo de la función
    return "Función flecha";
};

const suma = (a,b) => {
    return a+b;
};

const total2 = (precio,unidades) => precio * unidades;


console.log("Función tradicional:", func);
console.log("Función flecha:", func2);
console.log("Suma:", suma(4,10));
console.log("Total2:", total2(34.43,5));

// Mini reto: función que recibe un objeto y devuelve un template string
function etiquetaProducto(prod) {
    return `${prod.nombre} - ${prod.precio}€`;
};

console.log(etiquetaProducto({nombre: "Ratón", precio: 12.99}));

// Crear un array de 3 objetos productos (nombre/precio)
// y una función que devuelva el precio total sumado
// (aquí puedes hscerlo simple: sumar 3 elementos a mano, sin bucles si no quieres entrar).

