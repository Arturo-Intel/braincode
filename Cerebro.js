var Cerebro = function(t,e) {
    var fun_act = "none"
    class CapaNeuronal {
        constructor(n_conn, n_neur, act_f, act_f_d) {
            this.act_f = act_f;
            //this.act_f_d = act_f_d;
            this.b = Matematicas.matrixRand(1, n_neur);       //tantos como neuronas en la capa
            this.W = Matematicas.matrixRand(n_conn, n_neur);  //tantas cnx como # neuronas hubiera en la capa anterior y # de neuronas en la capa acutual
        }
    };

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

    function fordwardPass(red_neuronal, out){
        for(const [l, capa] of red_neuronal.entries()) {
            //z = out[-1][1] @ neural_net[l].W + neural_net[l].b
            z = [];
            temp = Matematicas.matrixMult(out[out.length-1][1], red_neuronal[l].W); 
            z = Matematicas.matrixSum(temp,red_neuronal[l].b)
            
            //a = neural_net[l].act_f[0](z)
            a =[];
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
        for(let l = 0; l < rev.length; l++ ) {
          z = out[rev[l] + 1][0];
          a = out[rev[l] + 1][1];
          
          if(rev[l] == red_neuronal.length -1) {
            // Computo del error de la ultima capa
            // l2_cost[1](a, Y) * neural_net[l].act_f[1](a)
            aa = Matematicas.l2_cost_d(a, Y);
            bb = func_act_d(a);
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
            
            r = Matematicas.matrixProd(aa,bb,"*");
            deltas.unshift(r);
            
          } else {
            // Calcular delta respecto a capa previa
            // deltas[0] @ _W.T * neural_net[l].act_f[1](a)
            aa = Matematicas.matrixMult(deltas[0], Matematicas.matrixTranspose(_W));
            bb = func_act_d(a);
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
          bb = [[Matematicas.media(deltas[0])]]
          for(let i = 0; i <  red_neuronal[rev[l]].b.length; i++){
            red_neuronal[rev[l]].b[0][i] =  red_neuronal[rev[l]].b[0][i] - bb[0][0] * LR;
          }
    
          // neural_net[l].W = neural_net[l].W - out[l][1].T @ deltas[0] * lr
          bb = Matematicas.matrixMult(Matematicas.matrixTranspose(out[rev[l]][1]), deltas[0]); 
          for(let i = 0; i <  red_neuronal[rev[l]].W.length; i++){
            for(let j = 0; j <  red_neuronal[rev[l]].W[i].length; j++) {
              red_neuronal[rev[l]].W[i][j] =  red_neuronal[rev[l]].W[i][j] - bb[i][j] * LR;
            }
          }
          
        }
    }


    return {
        inicializar: (topologia) =>{
            console.log("Inicializando Red Neuronal => ["+ topologia+"]");
            let nn = [];
            for (const [i, e] of topologia.entries()) {
                if (i+1 < topologia.length) {
                    nn.push(new CapaNeuronal(e, topologia[i+1], Matematicas.l2_cost))
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
                    datos.push({"color": color ,"label": label, "layer": i+1});
                }
            }
            //agregamos la salida
            datos.push({"color": "salmon", "label": "o", "layer": topologia.length});
            return datos;
        },
        entrenar: (red_neuronal, entrenar) => {
            let out = [[NaN, X]];
            out = fordwardPass(red_neuronal, out);
            if (entrenar) {
                backwardPass(red_neuronal, out);
            }
            return out[out.length -1 ][1];
        }

    } 
}();



