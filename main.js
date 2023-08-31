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

// 8x8 Capas ocultas max

svg_grafos_canvas_w = 800;
svg_grafos_canvas_h = 600;
let nn;
let _grafo;

const Z = Utilidades.dataset_and(200, .3);
//const X = Z['X']
const X = [[0,0],[1,1],[0,1],[1,0]]; // valores de entrada
//const Y = Z['y']//
const Y = [[0],[1],[0],[0]];         // valores esperados


let topologia = [2,1,1];
let LR = 0.01
let epocas = 0;
let loss =[] //?
let detenido = true;
let func_act = Matematicas.sigm;
let func_act_d = Matematicas.sigm_d;

console.log("Inicio");
dibujar();


let _x= []
let _x1= []
let _y= []
let _y1= []

res = 100;
let _simX = Utilidades.linspace(0, 1, res);
let _simY = Utilidades.linspace(0, 1, res);
let _resY = new Array(res).fill(0).map(() => new Array(res).fill(0));

for(let i =0; i<X.length; i++){
    if (Y[i] == 0) {
        _x.push(X[i][0])
        _y.push(X[i][1])
    } else {
        _x1.push(X[i][0])
        _y1.push(X[i][1])
    }
}

Plotly.newPlot('resultado',[ {
    x: _simX,
    y: _simY,
    z: _resY,
    type: 'heatmap',
    //colorscale : [ [0, 'skyblue'], [1, 'salmon'] ], 
    
    
}, {
    x: _x,
    y: _y,
    mode: 'markers',
    type: 'scatter'
}, {
    x: _x1,
    y: _y1,
    mode: 'markers',
    type: 'scatter' 
}])


Plotly.newPlot( 'loss', [{
      x: [Matematicas.rango(0, loss.length)],
      y: loss,
      mode: 'lines'
    }] );

function  selecionarFunAct(control){

    if (control == "sigm"){
        func_act = Matematicas.sigm
        func_act_d = Matematicas.sigm_d
    } else if (control == "tanh") {
        func_act = Matematicas.tanh
        func_act_d = Matematicas.tanh_d
    }
}


function dibujarGrafica(){

    Plotly.animate('loss', {
        data: [{x: Matematicas.rango(0, loss.length), y: loss}]
    }, {

      transition: {
        duration: 0
      },
      frame: {
        duration: 0,
        redraw: false
      }
    });

    Plotly.relayout('loss', {   
        margin: { t: 20, b: 25, r:25, l:50} 
    })

    Plotly.redraw('resultado',[ {
        x: _simX,
        y: _simY,
        z: _resY,
        type: 'heatmap',
        
    }, {
        x: _x,
        y: _y,
        mode: 'markers',
        type: 'scatter'
    }, {
        x: _x1,
        y: _y1,
        mode: 'markers',
        type: 'scatter' 
    }])
   

}

function computar () {
  let pY = Cerebro.entrenar(nn, X, true);
  if (epocas % 5 == 0) {
    loss.push(Matematicas.l2_cost(pY, Y));
    
    for(const [i, simX] of _simX.entries()) { 
      for(const [j, simY] of _simY.entries()) {
        _resY[i][j] = Cerebro.entrenar(nn, [[simX, simY],[]], false)[0][0];
      }
    }
  }
  epocas += 1;
  //debug una sola ejecucuion
  //detenido=true;
}

function actualizar () {
    
    dibujarGrafica();
    if(!detenido){
        computar();

        _grafo = Cerebro.datosGrafo(nn);
        Dibujo.grafo(_grafo);
    
        tmpStr = epocas.toString().padStart(5, '0');
        document.getElementById("epocasCounter").innerHTML = tmpStr.slice(0,2) + "," + tmpStr.slice(2);
        document.getElementById("algo").innerHTML = loss[loss.length-1];
    }
    
    // if(!detenido && loss[loss.length-1] !== undefined && loss[loss.length-1] < 0.15){
    //     detenido = true
    //     console.log("-Fin-")
    // }
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
document.getElementById("sFunActivacion").addEventListener("change", (event) => {
    selecionarFunAct(event.target.value);
  });

window.requestAnimationFrame(actualizar);


function dibujar() {
    // limpiamos todos los elementos visuales (svg)
    Utilidades.removeAllChildNodes(document.querySelector('#nn'));
    // estructura de matrizes representando una red neuronal
    nn = Cerebro.inicializar(topologia);
    // representacion en D3 de la red neuronal
    Dibujo.inicializar("#nn", "svg1", svg_grafos_canvas_w, svg_grafos_canvas_h );
    _grafo = Cerebro.datosGrafo(nn);
    Dibujo.grafo(_grafo);
    Dibujo.agrupadores();
    Dibujo.habilitar();
}
