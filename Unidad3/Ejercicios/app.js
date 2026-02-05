"use strict";

//Ejercicio 1

/*let nombre= "Alfredo";

const edad = 23;

const p = document.getElementById("salida");

p.textContent= `Mi nombre es ${nombre} y tengo ${edad} años`;*/


//Ejercicio 2

let a = 12;
let b = 5;

const suma = document.getElementById("suma");
suma.textContent = `${a} + ${b} = ${a+b}`;

const resta = document.getElementById("resta");
resta.textContent = `${a} - ${b} = ${a-b}`;

const producto = document.getElementById("producto");
producto.textContent = `${a} x ${b} = ${a*b}`;

const division = document.getElementById("division");
division.textContent = `${a} / ${b} = ${a/b}`;

const resto = document.getElementById("resto");
resto.textContent = `${a} % ${b} = ${a%b}`;

//Ejercicio 3

let edad = 19;

const p = document.getElementById("edad");

if (edad >= 18) {
    p.textContent=`Es mayor de edad`;
    p.className="mayor";
    
} else {
    p.textContent=`Es menor de edad`;
    p.className="menor";
}

//Ejercicio 4
let mes=3;

const meses = document.getElementById("mes");


switch (mes) {
    case 1:
        meses.textContent="Enero";
        
        break;
    case 2:
        meses.textContent="Febrero";
        
        break;
    case 3:
        meses.textContent="Marzo";
        
        break;
    case 4:
        meses.textContent="Abril";
        
        break;
    case 5:
        meses.textContent="Mayo";
        
        break;
    case 6:
        meses.textContent="Junio";
        
        break;
    case 7:
        meses.textContent="Julio";
        
        break;
    case 8:
        meses.textContent="Agosto";
        
        break;
    case 9:
        meses.textContent="Septiembre";
        
        break;
    case 10:
        meses.textContent="Octubre";
        
        break;
    case 11:
        meses.textContent="Noviembre";
        
        break;
    case 12:
        meses.textContent="Diciembre";
        
        break;

    default:
        meses.textContent="Número de mes introducido incorrecto.";
        
        break;
}


//Ejercicio 5

let numero=1;

let bucle = document.getElementById("numeros");
bucle.textContent=`${numero}`;
while (numero <11) {
    bucle.push(numero);
    bucle.textContent=`${numero}`;
}



//Ejercicio 6