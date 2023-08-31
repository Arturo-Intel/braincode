var Matematicas = function(t,e){
    // privadas 
    var private_var;
    function private_function() {
    }
    
    return {
    // publicas
        // regresa el promedio de los valores dentro del vector
        media: (a) => {
            let t = 0;
            for(let i = 0; i < a.length; i++) {
              for(let j = 0; j < a[i].length; j++){
                t += a[i][j];
              }
            }
            return t/a.length;
        },
        // rango [inicio, final)
        rango: array = (inicio, final, paso = 1) =>{
            var rango = [];
            while (paso > 0 ? final > inicio : final <= inicio) {
                rango.push(inicio);
                inicio += paso;
            }
            return rango;
        },
        // Obtenemos un array con las dimensiones de la matriz (4x2, 3x4, etc)
        revisarDimension : (a) => {
            // Nos aseguramos primero que sea un array
            if (a instanceof Array) {
                // Verificar que el primer elemento es una array
                var pedazo = Matematicas.revisarDimension(a[0]);
                if (pedazo === false) {
                    // la dimension es diferente
                    return false;
                } else {
                    // Compara cada elemento para asegurarnos que son de la misma dimension
                    for (var i = 1; i < a.length; i++) {
                        var _pedazo = Matematicas.revisarDimension(a[i]);
                        if (_pedazo === false || pedazo.join(",") != _pedazo.join(",")) {
                            // Si la dimension es diferente, no es rectangular
                            return false;
                        }
                    }
                    // la dimension es igual, la matriz es rectangular
                    return [a.length].concat(pedazo);
                }
            } else {
                // No es un arreglo
                return [];
            }
        },
        // regresa un matriz MxN con valores aleatorios entre -1 y 1
        matrixRand: (M, N) => {
            let a = new Array(M);
            for(let i = 0; i<a.length; i++){
                a[i] = new Array(N);
                a[i] = a[i].fill(0).map(() => Math.random() * 2 - 1);

            }
            return a;
        },
        // Transpuesta de una matriz
        matrixTranspose: (m) => {
            var copy = [];
            for (var i = 0; i < m.length; ++i) {
                for (var j = 0; j < m[i].length; ++j) {
                    // skip undefined values to preserve sparse array
                    if (m[i][j] === undefined) continue;
                    // create row if it doesn't exist yet
                    if (copy[j] === undefined) copy[j] = [];
                    // swap the x and y coords for the copy
                    copy[j][i] = m[i][j];
                }
            }
            return copy;
        },
        // multiplicacion de matriz
        matrixMult: (M, N) => {
            let aRows = M.length;
            let aCols = M[0].length;
            let bCols = N[0].length;
            let result = new Array(aRows); 

            for (let r = 0; r < aRows; ++r) {
                const row = new Array(bCols);
                result[r] = row;
                const ar = M[r];
                for (let c = 0; c < bCols; ++c) {
                    let sum = 0;     
                    for (let i = 0; i < aCols; ++i) {
                        sum += ar[i] * N[i][c];
                    }
                    row[c] = sum;  

                }
            }

            return result;
        },
        matrixSum: (M, N) => {
            let res = []
            for(let i = 0; i < M.length; i++){
                let rr = [];
                for(let j = 0; j < M[i].length; j++) {
                    let t ;
                    if(M.length != N.length){
                      t = N.length;
                    } else {
                      t = N[i].length;
                    }
                    for(let k = 0; k < t; k++) {
                        rr.push(M[i][j] + N[k][j]);
                    }
                }
                res.push(rr)
            }
            return res;
        },
        matrixProd: (M, N) => {
            let res = []
            for(let i = 0; i < M.length; i++){
                let rr = [];
                for(let j = 0; j < M[i].length; j++) {
                  rr.push(M[i][j] * N[i][j]);
                }
                res.push(rr)
            }
            return res;
        },
        // Funciones de activacion
        sigm: (t) => {
            let r = 1 / (1 + Math.exp(-t));
            return r
        },
        // derivada de sigm
        sigm_d: (t) => { //t * (1 - t);
            r = []
            for(let i = 0; i < t.length; i++) {
              tt = []
              for(let j = 0; j < t[i].length; j++) {
                tt.push(t[i][j] * (1 - t[i][j]));
              }
              r.push(tt);
            }
            return r;
        },
        tanh: (t) => { 
            let r = (2 / (1 + Math.exp(-(2*t)))) - 1;
            return r
        },
        tanh_d: (t) => { // 1 - t ** 2
                        r = []
            for(let i = 0; i < t.length; i++) {
              tt = []
              for(let j = 0; j < t[i].length; j++) {
                tt.push(1 - t[i][j] ** 2);
              }
              r.push(tt);
            }
            return r;
        }, 
        //funcion de coste - Error cuadratico medio
        l2_cost: (Yp=array, Yr=array) => { //mean( (Yp - Yr) ** 2)
            t = []
            for(let i = 0; i < Yp.length; i++) {
                tt = []
                for(let j = 0; j < Yp[i].length; j++){
                    tt.push((Yp[i][j]-Yr[i][j])**2);
                }
                t.push(tt);
            }
            return Matematicas.media(t);
        },
        // derivada del error cuadratico medio
        l2_cost_d: (Yp=array, Yr=array) => { //(Yp - Yr)
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
    }
}();
