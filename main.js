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

let expectedLoss = 0.05;
let dataSet = Utilidades.dataset_and();
let X = [] // valores de entrada
let Y = [] // valores esperados

let p =  2;
let topologia = [p,2,1];

let LR = 0.1
let epocas = 0;
let loss =[] 
let detenido = true;
let func_act = Matematicas.sigm;
let func_act_d = Matematicas.sigm_d;

let _x= []
let _x1= []
let _y= []
let _y1= []

let _simX = []
let _simY = []
let _resY = []
let resultado_layout =  []
var loss_layout = []

var coloresResultado = [
    [0, '#f18c91'],    
    [1, '#8dc091']
  ];

console.log("Inicializando estructuras");
inicializar_fondo();
console.log("Inicio");
dibujar();

function inicializar_fondo() {
    loss = [];
    X = dataSet['X'] 
    Y = dataSet['y'] 
    let res = 100;
    _simX = Utilidades.linspace(-.5, 1.5, res);
    _simY = Utilidades.linspace(-.5, 1.5, res);
    _resY = new Array(res).fill(0).map(() => new Array(res).fill(0));

    _x= []
    _x1= []
    _y= []
    _y1= []

    for(let i =0; i<X.length; i++){
        if (Y[i] == 0) {
            _x.push(X[i][0])
            _y.push(X[i][1])
        } else {
            _x1.push(X[i][0])
            _y1.push(X[i][1])
        }
    }


    resultado_layout =  [{
        x: _simX,
        y: _simY,
        z: _resY,
        zmin: 0,
        zmax: 1,
        type: 'heatmap',
        colorscale : coloresResultado,
        showscale : false
    }, {
        x: _x,
        y: _y,
        mode: 'markers',
        type: 'scatter',
        showlegend: false,
        marker: { color: "red", size : 10 }
    }, {
        x: _x1,
        y: _y1,
        mode: 'markers',
        type: 'scatter',
        showlegend: false,
        marker: { color: "green", size : 10 } 
    }]

    Plotly.newPlot('resultado', resultado_layout,{margin: { t: 20, b: 25, r:25, l:50}})
    
    loss_layout = [{
        x: Matematicas.rango(0, loss.length),
        y: loss,
        mode: 'lines',
        
    }]
    Plotly.newPlot( 'loss', loss_layout, {margin: { t: 20, b: 25, r:25, l:50}});
    
}


function seleccionarDataSet(control){
    switch (control) {
        case "and":
            dataSet = Utilidades.dataset_and();
            break;
        case "or":
            dataSet = Utilidades.dataset_or();
            break;
        case "xor":
            dataSet = Utilidades.dataset_xor();
            break;
        case "circulos":
            dataSet = Utilidades.circulo(300, .3, true);
            break;
    }    
    inicializar_fondo();
}


function  selecionarFunAct(control){

    if (control == "sigm"){
        func_act = Matematicas.sigm
        func_act_d = Matematicas.sigm_d
    } else if (control == "tanh") {
        func_act = Matematicas.tanh
        func_act_d = Matematicas.tanh_d
    }
}


function actualizarGrafica(){

    Plotly.animate('loss', 
      [{
        data: [{x: Matematicas.rango(0, loss.length),
                y: loss
              }] 
      }], 
      {
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

    Plotly.redraw('resultado', resultado_layout)
   

}

function computar () {
  let pY = Cerebro.entrenar(nn, X, true);
  if (epocas % 5 == 0) {
    loss.push(Matematicas.l2_cost(pY, Y));
    
    for(const [i, simX] of _simX.entries()) { 
      for(const [j, simY] of _simY.entries()) {
        _resY[i][j] = Cerebro.entrenar(nn, [[simX, simY],[]], false)[0][0];
        if(_resY[i][j] < 0.5){
            _resY[i][j] = 0
        }else if (_resY[i][j] >= 0.5){
            _resY[i][j] = 1
        }
      }
    }
  }
  epocas += 1;
  //debug una sola ejecucuion
  //detenido=true;
}

function actualizar () {
    
    actualizarGrafica();
    if(!detenido){
        LR = document.getElementById("lr").value
        computar();

        _grafo = Cerebro.datosGrafo(nn);
        Dibujo.grafo(_grafo);
    
        tmpStr = epocas.toString().padStart(5, '0');
        document.getElementById("epocasCounter").innerHTML = tmpStr.slice(0,2) + "," + tmpStr.slice(2);
        document.getElementById("algo").innerHTML = "Error: " +  loss[loss.length-1];
    }
    
    if(!detenido && loss[loss.length-1] !== undefined && loss[loss.length-1] < expectedLoss){
        detener()
        console.log("-Fin-")
    }
    requestAnimationFrame(actualizar);
}
function correr(){
    document.getElementById("bCorrer").style.display="none"
    document.getElementById("bDetener").style.display="block"
    detenido = false;
    epocas = 0;
    

    inicializar_fondo();
    dibujar()
    
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

tmp=  p>1?"s":""
document.querySelector("#infoEntradas").innerHTML = topologia[0] + " nodo" + tmp;

document.getElementById("bCorrer").onclick = correr;
document.getElementById("bDetener").onclick = detener;
document.getElementById("sFunActivacion").addEventListener("change", (event) => {
    selecionarFunAct(event.target.value);
});
document.getElementById("sDataSets").addEventListener("change", (event) => {
    seleccionarDataSet(event.target.value);
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
