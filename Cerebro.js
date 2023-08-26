var Cerebro = function(t,e) {
    var fun_act = "sigm"
    class CapaNeuronal {
        constructor(n_conn, n_neur, act_f, act_f_d) {
            this.act_f = act_f;
            //this.act_f_d = act_f_d;
            this.b = Matematicas.matrixRand(1, n_neur);       //tantos como neuronas en la capa
            this.W = Matematicas.matrixRand(n_conn, n_neur);  //tantas cnx como # neuronas hubiera en la capa anterior y # de neuronas en la capa acutual
        }
    };

    function fordwardPass(red_neuronal, out){
        for(const [l, capa] of red_neuronal.entries()) {
            //z = out[-1][1] @ neural_net[l].W + neural_net[l].b
            //z = [];
            let z = Matematicas.matrixMult(out[out.length-1][1], red_neuronal[l].W); 
            //z = matrizVectorOp(temp,red_neuronal[l].b, "+");
            a =[];
            for(let i = 0; i < z.length; i++){
                let aa = [];
                // funcion de activación
                aa.push(Matematicas.sigm(z[i]));
                a.push(aa);
            }
            out.push([z, a]);
        }
        
        return out;
    };


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
        entrenar: (red_neuronal, X, Y, lr, entrenar) => {
            let out = [[NaN, X]];
            out = fordwardPass(red_neuronal, out);
            console.log(out);
            if (entrenar) {
                //backwardPass(out);
                //descensoGradiente(out);
            }
            return out[out.length -1 ][1];
        }

    } 
}();


