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
        // regresa un matriz MxN con valores aleatorios entre -1 y 1
        matrixRand: (M, N) => {
            let a = new Array(M);
            for(let i = 0; i<a.length; i++){
                a[i] = new Array(N);
                a[i] = a[i].fill(0).map(() => Math.random() * 2 - 1);
            }
            return a;
        }
    }
}();
