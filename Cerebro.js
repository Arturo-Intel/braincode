var Cerebro = function(t,e) {
    var fun_act = "sigm"
    class CapaNeuronal {
        constructor(n_conn, n_neur, act_f, act_f_d) {
            this.act_f = act_f;
            //this.act_f_d = act_f_d;
            this.b = Matematicas.matrixRand(1, n_neur);       //tantos como neuronas en la capa
            this.W = Matematicas.matrixRand(n_conn, n_neur);  //tantas cnx como # neuronas hubiera en la capa anterior y # de neuronas en la capa acutual
        }
    }
    return {
        inicializar: function(topologia) {
            let nn = [];
            for (const [i, e] of topologia.entries()) {
                if (i+1 < topologia.length) {
                    nn.push(new CapaNeuronal(e, topologia[i+1], fun_act))
                }
            }
            return nn;
        },
        datosGrafo: function(red_neuronal){
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
        }
    } 
}();


