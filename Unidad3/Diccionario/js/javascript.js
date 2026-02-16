
// ELEMENTOS HTML DEL DOM
const selectProducto = document.getElementById("selectProducto");
const infoProducto = document.getElementById("infoProducto");
const tablaMenu = document.getElementById("tablaMenu");

// OBJETOS como DICCIONARIO (clave -> valor)
const carta = {
    cafe: { precio: 1.2, emoji: "☕", texto: "Café", alergenos: [] },
    te: { precio: 1.1, emoji: "🍵", texto: "Té chai", alergenos: [] },
    pitufo: { precio: 1.8, emoji: "🥪", texto: "Pitufo mixto", alergenos: ["gluten"]},
    donut: { precio: 2, emoji: "🍩", texto: "Donut", alergenos: ["gluten", "huevo"]}
  };

//Como acceder al valor de una clave . Notación preferidad -> con corchetes [] y sin punto
const producto = "pitufo";
//console.log(`Notación con punto -> El precio del ${producto} es ${carta.producto.precio}`); // Este no
console.log(`Notación con punto -> El precio del ${producto} es ${carta.pitufo.precio}`); // Este si
console.log(`Notación con corchetes -> El precio del ${producto} es ${carta[producto].precio}`);

// Método para obtener las claves de un objeto
const claves = Object.keys(carta);

// Rellenar el select
