var Cerebro = function(t,e) {
  // Representación de las neuronas agrupadas por capas.  
  // Dentro de una capa aplicamos las mismas operaciones a todas las neuronas dentro de ella
  class CapaNeuronal {
    constructor(n_conn, n_neur) {
      this.b = Matematicas.matrixRand(1, n_neur);       // BIAS: tantos como neuronas en la capa
      this.W = Matematicas.matrixRand(n_conn, n_neur);  // tantas cnx como # neuronas hubiera en la capa anterior 
                                                        // y # de neuronas en la capa actual
    }
  };

  function propagacionHaciaDelante(red_neuronal, salidas){
    // Propagacion hacia delante (forwardPass)
    // Devuelve una matriz con las salidas de la MLP [Z,a]
    // Z = Wi.Xi + b <- suma ponderada
    // a = FuncionDeActivacion(Z) <- aplicaion de la funcion de activacion a la suma ponderada
    // podemos usar esta función para realizar predicción 

    // recorremos todos las capas de nuestra red neuronal
    for(const [i] of red_neuronal.entries()) {

      //*** Calculamos la suma ponderada de la capa[i] utilizando el valor de la Z de la capa anterior
      //*** multiplcado matricialmente por el peso (W) de la capa[i]
      //*** mas el sesgo (b) de la capa[i]
      let Z = []; 
      temp = Matematicas.matrixMult(salidas[salidas.length-1][1], red_neuronal[i].W); 
      Z = Matematicas.matrixSum(temp,red_neuronal[i].b)
      
      //*** Aplicamos la función de activación a los valores de la capa[i] */
      let a = Utilidades.aplicar(Z, func_act)

      // Agregamos al arreglo salidas la Z y el resultado de la funcion de activacion 
      salidas.push([Z, a]);
    }
    return salidas
  };


  function propagacionHaciaAtras(red_neuronal, salidas) {
    // Propagacion hacia atras (backward pass)
    // Utilizamos las derivadas parciales de los paramatros W y b respecto al coste (error)
    // Actualiza los pesos (W) y sesgos (b) de la red neuronal 

    // Calculamos las deltas de las capas
    deltas = [];
    
    // Recorremos la red neuronal de atras hacia adelante
    // Nos apoyamos de un arreglo con los indices al reves (rev)
    rev = Matematicas.rango(0, red_neuronal.length).reverse();
    
    for(let indice = 0; indice < rev.length; indice++ ) {
      a = salidas[rev[indice] + 1][1]; // valores de activacion de la capa anterior
      
      if(rev[indice] == red_neuronal.length - 1) {
        // Calculamos la delta en la última capa
        // dL = dC/daL . daL/DZL
        // funcion de coste: diferencia entre el valor esperado y el obtenido

        aa = Matematicas.l2_cost_d(a, Y); // derivada de la funcion de coste
        bb = Utilidades.aplicar(a, func_act_d); // derivada de la funcion de activacion 
        
        let r = Matematicas.matrixProd(aa,bb);
        deltas.unshift(r); // lo guardamos en la primera posicion del arreglo deltas
      
        
      } else {
        // Calcular delta respecto a la capa previa
        // dl-1 = Wldl . dal-1/dZl-1
        //deltas[0] @ _W.T * neural_net[l].act_f[1](a)
        aa = Matematicas.matrixMult(deltas[0], Matematicas.matrixTranspose(_W)); // W por delta anterior
        bb = Utilidades.aplicar(a, func_act_d); // derivada de la funcion de activacion 
        r = Matematicas.matrixProd(aa,bb)
        deltas.unshift(r);
      }
      
      // Como vamos a actualizar los parametros W y b en el mismo ciclo qen el que calculamos las dereivadas
      // usaremos una variable auxiliar para no sobre escribir estos
      _W = red_neuronal[rev[indice]].W;

      // Descenso del gradiente
      // Optimizar los parametros de nuestra red usando las deltas previamente calculadas
      // Usamos la taza de aprendizaje (LR) para determina en que grado estaremos actualizando nustros parametros W y b
      // un valor muy grande de LR puede hacer que la red nunca converja, llendoce al infinito y produciendo un gradient exploding
      // un valor muy pequeño de LR puede hacer que el proceso de entrenamiento sea demasiado lento

      // la derivada parcial de delta
      mediaDelta = Matematicas.media(deltas[0])
      
      // optimizando el coste en función del sesgo (b)
      for(let i = 0; i <  red_neuronal[rev[indice]].b.length; i++){
        red_neuronal[rev[indice]].b[0][i] =  red_neuronal[rev[indice]].b[0][i] - mediaDelta * LR; 
      }
     
      // optimizando el coste en función del peso (W)
      bb = Matematicas.matrixMult(Matematicas.matrixTranspose(salidas[rev[indice]][1]), deltas[0]); 
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
        if (i < topologia.length -1) {
          nn.push(new CapaNeuronal(e, topologia[i+1]))
        }
      }
      console.log(nn)
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
          datos.push({"color": color ,"label": label, "layer": i+1, "Ws": e.W[j]});
        }
      }
      
      //agregamos la salida
      datos.push({"color": "salmon", "label": "o", "layer": topologia.length});
      
      return datos;
    },
    entrenar: (red_neuronal, X, entrenar) => {
      
      // salidas[suma ponderada (Z) de la capa anterior, función de activación a la salida (Z) de la capa anterior]
      // inicializamos la matriz de salidas [Nullo, datos de entrada]
      let salidas = [[NaN, X]];
      salidas = propagacionHaciaDelante(red_neuronal, salidas);
      if (entrenar) {
        propagacionHaciaAtras(red_neuronal, salidas);
      }
      return salidas[salidas.length -1 ][1];
    }
  } 
}();



