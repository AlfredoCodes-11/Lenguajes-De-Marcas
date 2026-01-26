"use strict";

const app = document.getElementById("app");
// const app = document.querySelector("#app");
const name = "1º DAW"

app.textContent = `Hola ${name}`;
//app.textContent = "<p>Hola Sergio</p>";
app.innerHTML = "<strong>Hola Sergio</strong>";
app.innerHTML = `
    <section>
        <p>Hola ${name}, espero que estéis aprediendo algo.
            <strong>Menos mal que empieza el finde.</strong>
        </p>
    </section>`;
// Métodos modernos para modificar contenido
console.log("Método moderno GET HTML: " + app.getHTML());
const cod = `<p><strong>setHTMLUnsafe</strong> es la alternativa moderna
    a innerHTML para modificar contenido HTML</p>`;
app.setHTMLUnsafe(cod);

// Crear elementos HTML
// Métodos createElement("etiquetas")
const seccion = document.createElement("section");
console.log("El elemento seccion aun no está conectado o insertado:", seccion.isConnected);
seccion.innerHTML = `<p>Estoy inyectando cófigo HTML a la sección</p>`;

// Añado la nueva sección al div cuyo id es app
app.appendChild(seccion);
console.log(seccion.isConnected);       //true porque ya está insertada

// Si quisiera clonar el elemento seccion
const copiaSeccion = seccion.cloneNode();
const copiaProfunda = seccion.cloneNode(true);

const container = document.querySelector(".container");
const parrafo = document.createElement("p");
parrafo.innerHTML = `Este es el primer párrafo`;
const articulo = document.createElement("article");
const negrita = document.createElement("strong");
negrita.textContent = `Este es el texto que aparecerá en negrita y en verde`;
container.appendChild(parrafo);
container.appendChild(articulo);
articulo.appendChild(negrita);
negrita.className = "green";