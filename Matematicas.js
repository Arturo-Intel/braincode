var Matematicas = function(t,e){
    // privadas 
    var private_var;
    function private_function() {
    }
    
    return {
    // publicas
        // regresa el promedio de los valores dentro del vector
        media: (v) => {
            let t = 0;
            for(let i = 0; i < v.length; i++) {
                t += v[i];
            }
            return t/v.length;
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
            // si N.length es 1 => multiplcarlo por cada elemento de M
            // si no hacer una multiplicacion de matrices 
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
        // Funciones de activacion
        sigm: (t) => {
            let r = 1 / (1 + Math.exp(-t));
            return r
        },
        //coste - Error cuadratico medio
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
        }
    }
}();
