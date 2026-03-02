const texto = '{"nombre":"Ana","edad":30}';

const persona = JSON.parse(texto);

const alumno = {
    nombre: "Antonio",
    edad: 20,
    repedidor: false
}

const textoJSON = JSON.stringify(alumno);