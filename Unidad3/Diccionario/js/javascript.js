
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
/*for (i=0;i<claves.length;i++){
  console.log(carta[claves[i]].texto + carta[claves].emoji);
}*/

for (i=0;i<claves.length;i++){
  //1) Creo el elemento <option>
  const opcion = document.createElement("option");
  //2) Asignamos atributo value a la opción
  opcion.value= claves[i];
  //3) Añado contenido al <option> -> texto + emoji
  opcion.textContent = `${carta[claves[i]].texto} ${carta[claves[i]].emoji}`;
  //4) Insertamos el elemento dentro de select
  selectProducto.appendChild(opcion);
}

/*for(const clave of claves){
  console.log(carta[clave].texto + carta[clave].emoji);
}*/