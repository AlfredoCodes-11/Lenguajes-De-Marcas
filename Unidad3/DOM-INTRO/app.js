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
