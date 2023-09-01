var Cerebro = function(t,e) {
    
  class CapaNeuronal {
    constructor(n_conn, n_neur) {
      this.b = Matematicas.matrixRand(1, n_neur);       //tantos como neuronas en la capa
      this.W = Matematicas.matrixRand(n_conn, n_neur);  //tantas cnx como # neuronas hubiera en la capa anterior y # de neuronas en la capa acutual
    }
  };

  function fordwardPass(red_neuronal, out){
    for(const [indice] of red_neuronal.entries()) {
      //z = out[-1][1] @ neural_net[l].W + neural_net[l].b
      let z = []; // suma ponderada
      temp = Matematicas.matrixMult(out[out.length-1][1], red_neuronal[indice].W); 
      z = Matematicas.matrixSum(temp,red_neuronal[indice].b)
      
      let a = [] // activacion
      for(let i = 0; i < z.length; i++){
        let aa = [];
        for(let j = 0; j < z[i].length; j++) {
          aa.push(func_act(z[i][j]));
        }
        a.push(aa);
      }
      out.push([z, a]);
    }
    return out
  };


  function backwardPass(red_neuronal, out) {
    deltas = [];
    rev = Matematicas.rango(0, red_neuronal.length).reverse();
    // Recorremos la red neuronal de atras hacia adelante
    for(let indice = 0; indice < rev.length; indice++ ) {
      z = out[rev[indice] + 1][0]; // suma ponderada de la capa anterior
      a = out[rev[indice] + 1][1]; // activacion de la capa anterior
      // Calcular delta de la última capa
      if(rev[indice] == red_neuronal.length -1) {
        // l2_cost[1](a, Y) * neural_net[l].act_f[1](a)
        aa = Matematicas.l2_cost_d(a, Y); // derivada de la funcion de coste
        bb = func_act_d(a); // derivada de la funcion de activacion 
        r = [];           
        r = Matematicas.matrixProd(aa,bb);
        deltas.unshift(r); // lo guardamos en la primera posicion del arreglo deltas
      // Calcular delta respecto a la capa previa
      } else {
        //deltas[0] @ _W.T * neural_net[l].act_f[1](a)
        aa = Matematicas.matrixMult(deltas[0], Matematicas.matrixTranspose(_W)); // W por delta anterior
        bb = func_act_d(a); // derivada de la funcion de activacion 
        r = Matematicas.matrixProd(aa,bb)
        deltas.unshift(r);
      }
      
      _W = red_neuronal[rev[indice]].W;

      // ********************
      //   Gradient descent
      // ********************
      mediaDelta = Matematicas.media(deltas[0])
      //neural_net[l].b = neural_net[l].b - np.mean(deltas[0], axis=0, keepdims=True) * lr
      for(let i = 0; i <  red_neuronal[rev[indice]].b.length; i++){
        red_neuronal[rev[indice]].b[0][i] =  red_neuronal[rev[indice]].b[0][i] - mediaDelta * LR; //GD para Bias
      }
      // neural_net[l].W = neural_net[l].W - out[l][1].T @ deltas[0] * lr
      bb = Matematicas.matrixMult(Matematicas.matrixTranspose(out[rev[indice]][1]), deltas[0]); 
      // W es un arreglo bidimencional ya que por cada nodo existen n pesos, donde n es la cantaidad de nodos en la siguiente capa
      // Cuando W[1][1] significa que es un solo nodo con una sola conexion 
      for(let i = 0; i <  red_neuronal[rev[indice]].W.length; i++){
        for(let j = 0; j <  red_neuronal[rev[indice]].W[i].length; j++) {
          red_neuronal[rev[indice]].W[i][j] = red_neuronal[rev[indice]].W[i][j] - bb[i][j] * LR;
        }
      }
    } 
  };
  return {
    inicializar: (topologia) => {
      console.log("Inicializando Red Neuronal => ["+ topologia+"]");
      let nn = [];
      for (const [i, e] of topologia.entries()) {
        if (i+1 < topologia.length) {
          nn.push(new CapaNeuronal(e, topologia[i+1]))
        }
      }
      return nn;
    },
    datosGrafo: (red_neuronal) =>{
      datos = [];
      for (const [i, e] of red_neuronal.entries()) {
        for (let j = 0; j < e.W.length; j++) {
          if( i == 0 ) {
            label = "i"+j;
            color = "#1f77b4";
          }else {
            label = "h"+j;
            color = "#999999";
          }
          datos.push({"color": color ,"label": label, "layer": i+1, "W": e.W[j][0]});
        }
      }
      //agregamos la salida
      datos.push({"color": "salmon", "label": "o", "layer": topologia.length});
      return datos;
    },
    entrenar: (red_neuronal, X, entrenar) => {
      
      let out = [[NaN, X]];
      out = fordwardPass(red_neuronal, out);
      if (entrenar) {
        backwardPass(red_neuronal, out);
      }
      return out[out.length -1 ][1];
    }
  } 
}();



