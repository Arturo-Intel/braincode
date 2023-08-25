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
                var pedazo = Matematicas.arrayDimension(a[0]);
                if (pedazo === false) {
                    // la dimension es diferente
                    return false;
                } else {
                    // Compara cada elemento para asegurarnos que son de la misma dimension
                    for (var i = 1; i < a.length; i++) {
                        var _pedazo = Matematicas.arrayDimension(a[i]);
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
        // multiplicacion de matriz
        matrixMult: (M, N) => {
            // si N.length es 1 => multiplcarlo por cada elemento de M
            // si no hacer una multiplicacion de matrices 
            console.log(Matematicas.arrayDimension(M) + " x "+ Matematicas.arrayDimension(N));
            //console.log("N=> " + N.length)

            //return r;
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
