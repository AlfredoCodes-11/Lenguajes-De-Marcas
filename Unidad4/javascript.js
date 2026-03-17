const texto = '{"nombre":"Ana","edad":30}';


// Texto JSON <-> objeto JS : parsear
const persona = JSON.parse(texto);

// Objeto JS <-> texto JSON:
const alumno = {
    nombre: "Antonio",
    edad: 20,
    repedidor: false
};

const textoJSON = JSON.stringify(alumno);
console.log(textoJSON);