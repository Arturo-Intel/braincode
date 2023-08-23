(function () {
    if (!console) {
        console = {};
    }
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function (message) {
        var time = new Date(Date.now()).toLocaleTimeString();
        var timestamp = '[' + time + '] ';
        if (typeof message == 'object') {
            logger.innerHTML += timestamp + (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + '<br />';
        } else {
            logger.innerHTML += timestamp + message + '<br />';
        }
        logger.scrollTop = logger.scrollHeight;
        old(message);
    }
    document.getElementById("bDetener").style.display="none";
    
})();

// 8x8 Hidden layers max
let topologia = [2,1,1];
svg_grafos_canvas_w = 800;
svg_grafos_canvas_h = 600;
let nn;
console.log("Inicio");
dibujar();
Dibujo.inicializar("#resultado", "svg2", 400, 400);
const X = [[0,0],[1,1],[0,1],[1,0]]; // valores de entrada
const Y = [[0],[1],[0],[0]];         // valores esperados
let LR = 0.01
let epocas = 0;
let loss =[] //?
let detenido = true;


function computar () {
  let pY = Cerebro.entrenar(nn, X, Y,  LR, true);
  detenido=true;
  if (epocas % 25 == 0) {
    loss.push(Matematicas.l2_cost(pY, Y));
    // for(const [i, x0] of _x0.entries()) { 
    //   for(const [j, x1] of _x1.entries()) {
    //     _Y[i][j] = entrenar(red_neuronal, [[x0, x1],[]], Y, LR, false)[0][0];
    //   }
    // }
  }
  epocas += 1;
}

function actualizar () {
    if(!detenido){
        
        computar();
        tmpStr = epocas.toString().padStart(5, '0');
        document.getElementById("epocasCounter").innerHTML = tmpStr.slice(0,2) + "," + tmpStr.slice(2);
        document.getElementById("loss").innerHTML = loss[loss.length-1];
    }
    requestAnimationFrame(actualizar);
}
function correr(){
    document.getElementById("bCorrer").style.display="none"
    document.getElementById("bDetener").style.display="block"
    detenido = false;
    epocas = 0;
    Dibujo.deshabilitar();
    console.log("correr")
}

function detener(){
    document.getElementById("bCorrer").style.display="block"
    document.getElementById("bDetener").style.display="none"
    detenido = true;
    Dibujo.habilitar();
    console.log("detener")
}

document.getElementById("bCorrer").onclick = correr;
document.getElementById("bDetener").onclick = detener;

window.requestAnimationFrame(actualizar);

function dibujar() {
    // limpiamos todos los elementos visuales (svg)
    Utilidades.removeAllChildNodes(document.querySelector('#nn'));
    // estructura de matrizes representando una red neuronal
    nn = Cerebro.inicializar(topologia);
    // representacion en D3 de la red neuronal
    Dibujo.inicializar("#nn", "svg1", svg_grafos_canvas_w, svg_grafos_canvas_h );
    let grafo = Cerebro.datosGrafo(nn);
    Dibujo.grafo(grafo);
    Dibujo.resultado();
}