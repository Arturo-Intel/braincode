

//utils

function linspace(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(Math.round((startValue + (step * i)) * 100) / 100);
  }
  return arr;
}


const mean = a => {
  let t = 0;
  for(let i = 0; i < a.length; i++) {
    for(let j = 0; j < a[i].length; j++){
      t += a[i][j];
    }
  }
  return t/a.length;
}

//coste - Error cuadratico medio
l2_cost = (Yp=array, Yr=array) => { //mean( (Yp - Yr) ** 2)
  t = []
  for(let i = 0; i < Yp.length; i++) {
    tt = []
    for(let j = 0; j < Yp[i].length; j++){
      tt.push((Yp[i][j]-Yr[i][j])**2);
    }
    t.push(tt);
  }
  return mean(t);
}

l2_cost_d = (Yp=array, Yr=array) => { //(Yp - Yr)
  t = []
  for(let i = 0; i < Yp.length; i++) {
    tt = []
    for(let j = 0; j < Yp[i].length; j++){
      tt.push(Yp[i][j]-Yr[i][j]);
    }
    t.push(tt);
  }
  return t;
}

rand = (t, e) => {
  let a = new Array(t);
  for(let i = 0; i<a.length; i++){
    a[i] = new Array(e);
    a[i] = a[i].fill(0).map(() => Math.random() * 2 - 1);
  }
  return a;
}

function multiplyMatrix(a, b) {
  const tB = transpose(b);

  // Return the matrix (array of rows)
  return a.map((row_a) => {
  
    // Return the rows with the values (array of values where the length
    // will be the number of columns of 'b', which is the same as
    // the length of `tB` (transposed `b`))
    return tB.map((row_b) => {

      // Return the sum of the products, which is the final value itself
      // (therefore, defines the columns)
      return row_a.reduce((carry, value_of_a, index_of_column_of_a) => {
        
        // Because we transposed `b` the value in b that corresponds to a specific
        // value in `a` will have the same `column_index`.
        const corresponding_b = row_b[index_of_column_of_a];

        return carry + (value_of_a * corresponding_b);
      }, 0);
    });
  });
}
  
function transpose(m) {
  return Object.keys(m[0]).map(columnIndex => {
    return m.map(row => row[columnIndex])
  });
}

// range [start, end)
range = array = (start, end, step = 1) =>{
  var range = [];
  while (step > 0 ? end > start : end <= start) {
    range.push(start);
    start += step;
  }
  return range;
}
 

// Funciones de activacion
sigm = t => 1 / (1 + Math.exp(-t));
sigm_d = t => { //t * (1 - t);
  r = []
  for(let i = 0; i < t.length; i++) {
    tt = []
    for(let j = 0; j < t[i].length; j++) {
      tt.push(t[i][j] * (1 - t[i][j]));
    }
    r.push(tt);
  }
  return r;
}

matrizVectorOp = (aa, bb, simbol) => {
  r = [];
  if(simbol=== undefined){
    throw new Error("simbol requerido"); 
  }
  for(let i = 0; i < aa.length; i++){
    let rr = [];
    for(let j = 0; j < aa[i].length; j++) {
      let t ;
      if(aa.length != bb.length){
        t = bb.length;
      } else {
        t = bb[i].length;
      }

        for(let k = 0; k < t; k++) {
          switch(simbol) {
            case "+" :
              rr.push(aa[i][j] + bb[k][j]);
              break;
            case "-" :
              rr.push(aa[i][j] - bb[k][j]);
              break;
            case "*" :
              rr.push(aa[i][j] * bb[k][j]);
              break;
            default:
              throw new Error("simbol no reconocido");
          }
        }

    }
    r.push(rr);
  }
  return r;
}


// Generate values

//AND
const X = [[0,0],[1,1],[0,1],[1,0]]; // valores de entrada
const Y = [[0],[1],[0],[0]];         // valores esperados

//XOR
//const X = [[0,0],[0,1],[1,0],[1,1]]; // valores de entrada
//const Y = [[0],[1],[1],[0]];         // valores esperados



class CapaNeuronal {
    constructor(n_conn, n_neur, act_f, act_f_d) {
        this.act_f = act_f;
        this.act_f_d = act_f_d;
        this.b = rand(1, n_neur);       //tantos como neuronas en la capa
        this.W = rand(n_conn, n_neur);  //tantas cnx como # neuronas hubiera en la capa anterior y # de neuronas en la capa acutual
    }
}


function crea_rn(topologia, act_f, act_f_d) {
    let nn = [];
    for (const [l, capa] of topologia.entries()) {
        if (l+1 < topologia.length) {
            nn.push(new CapaNeuronal(capa, topologia[l+1], act_f, act_f_d))
        }
    }
    return nn;
};


function entrenar(red_neuronal, X, Y, l2_cost, lr, entrenar) {

  // *******************
  //    Forward pass
  // *******************

  let out = [[NaN, X]];
  for(const [l, capa] of red_neuronal.entries()) {
    //z = out[-1][1] @ neural_net[l].W + neural_net[l].b
    z = [];
    temp = multiplyMatrix(out[out.length-1][1], red_neuronal[l].W); 

    z = matrizVectorOp(temp,red_neuronal[l].b, "+");
    // for(let i = 0; i < temp.length; i++){
    //   let zz = [];
    //   for(let j = 0; j < temp[i].length; j++) {
    //     for(let k = 0; k < red_neuronal[l].b.length; k++) {
    //       zz.push(temp[i][j] + red_neuronal[l].b[k][j]);
    //     }
    //   }
    //   z.push(zz);
    // }
    
    //a = neural_net[l].act_f[0](z)
    a =[];
    for(let i = 0; i < z.length; i++){
      let aa = [];
      for(let j = 0; j < z[i].length; j++) {
        aa.push(red_neuronal[l].act_f(z[i][j]));
      }
      a.push(aa);
    }
    out.push([z, a]);
  }

  if (entrenar) {
    
    // *******************
    //    Backward Pass
    // *******************
    
    deltas = [];
    rev = range(0, red_neuronal.length).reverse();
    // Recorremos la red neuronal de atras hacia adelante
    for(let l = 0; l < rev.length; l++ ) {
      z = out[rev[l] + 1][0];
      a = out[rev[l] + 1][1];
      
      if(rev[l] == red_neuronal.length -1) {
        // Computo del error de la ultima capa
        // l2_cost[1](a, Y) * neural_net[l].act_f[1](a)
        aa = l2_cost_d(a, Y);
        bb = red_neuronal[rev[l]].act_f_d(a);
        r = [];
        
        // for(let i = 0; i < aa.length; i++){
        //   let rr = [];
        //   for(let j = 0; j < aa[i].length; j++) {
        //     for(let k = 0; k < bb[i].length; k++) {
        //       rr.push(aa[i][j] * bb[k][j]);
        //     }
        //   }
        //   r.push(rr);
        // }
        
        r = matrizVectorOp(aa,bb,"*");
        deltas.unshift(r);
        
      } else {
        // Calcular delta respecto a capa previa
        // deltas[0] @ _W.T * neural_net[l].act_f[1](a)
        aa = multiplyMatrix(deltas[0], transpose(_W));
        bb = red_neuronal[rev[l]].act_f_d(a);
        r = [];
        for(let i = 0; i < aa.length; i++){
          let rr = [];
          for(let j = 0; j < aa[i].length; j++) {
              rr.push(aa[i][j] * bb[i][j]);
          }
          r.push(rr);
        }
        deltas.unshift(r);
      }

      _W = red_neuronal[rev[l]].W;
      
      // ********************
      //   Gradient descent
      // ********************
      // Actualizamos los parametros en funcion de los vectores gradientes 
      // neural_net[l].b = neural_net[l].b - np.mean(deltas[0], axis=0, keepdims=True) * lr
      bb = [[mean(deltas[0])]]
      for(let i = 0; i <  red_neuronal[rev[l]].b.length; i++){
        red_neuronal[rev[l]].b[0][i] =  red_neuronal[rev[l]].b[0][i] * bb[0][0] * lr;
      }

      // neural_net[l].W = neural_net[l].W - out[l][1].T @ deltas[0] * lr
      bb = multiplyMatrix(transpose(out[rev[l]][1]), deltas[0]); 
      for(let i = 0; i <  red_neuronal[rev[l]].W.length; i++){
        for(let j = 0; j <  red_neuronal[rev[l]].W[i].length; j++) {
          red_neuronal[rev[l]].W[i][j] =  red_neuronal[rev[l]].W[i][j] - bb[i][j] * lr;
        }
      }
      
    }
  }
  return out[out.length -1 ][1];
}

//const M = [[0,0],[1,1],[0,1],[1,0]]; // valores de entrada
//const N = [[0],[1],[0],[0]];         // valores esperados

// neuronas de entradas
let p = 2;
let LR = 0.01

topologia = [p, 4, 8, 16, 8, 4, 1];
red_neuronal = crea_rn(topologia, sigm, sigm_d);
//costes respecto al tiempo
loss=[]

for (i in range(0,100)){
  pY = entrenar(red_neuronal, X, Y, l2_cost, LR, true )
  if (i % 25 == 0) {
    
    loss.push(l2_cost(pY, Y));
  }
}
console.log(loss);

//red_neuronal = crea_rn(topologia, sigm, sigm_d);


// let epocas = 0;

// Plotly.newPlot('Error', [{
//   x: range(0, loss.length),
//   y: loss,
//   mode: 'lines'
// }] )

// res = 50;
// _x0 = linspace(-1.5, 1.5, res);
// _x1 = linspace(-1.5, 1.5, res);
// _Y = new Array(res).fill(0).map(() => new Array(res).fill(0));

// let xX = [] 
// let yY = []
// let xX2 = [] 
// let yY2 = []
// for(let i = 0; i< X.length; i++){
//   if(Y[i] == 1) {
//     xX.push(X[i][0]);
//     yY.push(X[i][1]);
//   } else {
//     xX2.push(X[i][0]);
//     yY2.push(X[i][1]);
//   }
// }

// var colorscaleValue = [
//   [0, 'skyblue'],
//   [1, 'salmon']
// ];
// const data1 = [
              
//               {x:xX, y:yY, type: 'scatter', mode: "markers", marker: { color: "skyblue", size : 12 }, showlegend: false},
//               {x:xX2, y:yY2, type: 'scatter', mode: "markers", marker: { color: "salmon", size : 12 }, showlegend: false},
//               {x:_x0, y:_x1, z:_Y, type: 'heatmap', colorscale : colorscaleValue, zsmooth : 'false' }
//               ];
// Plotly.newPlot("myPlot", data1);




// function compute () {
//   let pY = entrenar(red_neuronal, X, Y, l2_cost, LR, true);
  
//   if (epocas % 25 == 0) {
//     loss.push(l2_cost(pY, Y));
//     for(const [i, x0] of _x0.entries()) { 
//       for(const [j, x1] of _x1.entries()) {
//         _Y[i][j] = entrenar(red_neuronal, [[x0, x1],[]], Y, l2_cost, LR, false)[0][0];
//       }
//     }
//   }
//   epocas += 1;
// }

// function update () {

//   compute();
//   var updateLay = {
//     mode: 'lines'
//   };
  
//   Plotly.animate('Error', {
//     data: [{x: range(0, loss.length), y: loss}]
//     }, {

//       transition: {
//         duration: 0
//       },
//       frame: {
//         duration: 0,
//         redraw: false
//       },
//       xaxis: {
//         range: range(0, loss.length)
//       }
//     });
//   Plotly.relayout('Error', updateLay)
//   Plotly.update('myPlot');
//   Plotly.animate('myPlot', {
//     data: [
//           {x:xX, y:yY, type: 'scatter', mode: "markers", marker: { color: "skyblue", size : 12 }, showlegend: false},
//           {x:xX2, y:yY2, type: 'scatter', mode: "markers", marker: { color: "salmon", size : 12 }, showlegend: false},
//           {x:_x0, y:_x1, z:_Y, type: 'heatmap', colorscale : colorscaleValue, zsmooth : 'false', showscale : false},
          
//           //
          
//           ]
//     }
//   , {
//       transition: {
//         duration: 0
//       },
//       frame: {
//         duration: 0,
//         redraw: false
//       }
//     });
  
//   if(epocas < 2000){
//   //if(loss[loss.length-1] > 0.1){
//     requestAnimationFrame(update);
//   }else {
//     console.log("-fin-");
//   }
// }
// window.requestAnimationFrame(update);







