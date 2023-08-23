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
        // Array dimension checker
        // Returns:
        //   false when array dimensions are different
        //   an Array when is rectangular 0d (i.e. an object) or >=1d
        arrayDimension : (a) => {
            // Make sure it is an array
            if (a instanceof Array) {
                // First element is an array
                var sublength = Matematicas.arrayDimension(a[0]);
                if (sublength === false) {
                    // Dimension is different
                    return false;
                } else {
                    // Compare every element to make sure they are of the same dimensions
                    for (var i = 1; i < a.length; i++) {
                        var _sublength = Matematicas.arrayDimension(a[i]);
                        // HACK: compare arrays...
                        if (_sublength === false || sublength.join(",") != _sublength.join(",")) {
                            // If the dimension is different (i.e. not rectangular)
                            return false;
                        }
                    }
                    // OK now it is "rectangular" (could you call 3d "rectangular"?)
                    return [a.length].concat(sublength);
                }
            } else {
                // Not an array
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
