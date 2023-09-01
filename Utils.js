var Utilidades = function(t,e){
    return {
        removeAllChildNodes:  (parent) => {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }, 
        linspace : (startValue, stopValue, cardinality) => {
            var arr = [];
            var step = (stopValue - startValue) / (cardinality - 1);
            for (var i = 0; i < cardinality; i++) {
              arr.push(Math.round((startValue + (step * i)) * 100) / 100);
            }
            return arr;
        },
        random_normal_dist : () => {
          let u = 0, v = 0;
          while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
          while(v === 0) v = Math.random();
          let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
          num = num / 10.0 + 0.5; // Translate to 0 -> 1
          if (num > 1 || num < 0) return Utilidades.random_normal_dist() // resample between 0 and 1
          return num
        },
        dataset_and: () => {
          _X = [[0,0],[0,1], [1,0], [1,1]]
          y = [[0],[0],[0],[1]]
          
          return {
            X: _X, 
            y: y
          }
        },
        dataset_or: () => {
          _X = [[0,0],[0,1], [1,0], [1,1]]
          y = [[0],[1],[1],[1]]
          
          return {
            X: _X, 
            y: y
          }
        },
        dataset_xor: () => {
          _X = [[0,1],[0,0], [1,1], [1,0]]
          y = [[1],[0],[0],[1]]
          
          return {
            X: _X, 
            y: y
          }
        },
        dos_circulos: (steps, noise=false) =>{
          let n_steps_o = Math.floor(steps /2)
          let n_steps_i = steps - n_steps_o
          let linspace_o = Utilidades.linspace(0, 2 * Math.PI, n_steps_o)
          let linspace_i = Utilidades.linspace(0, 2 * Math.PI, n_steps_i)
          
          let o_circ_x = []
          let o_circ_y = []

          let i_circ_x = []
          let i_circ_y = []
          
          let _X =  []

          for (let i = 0; i< linspace_o.length ; i++){
            o_circ_x= (-0.8 + .3 * Math.cos(linspace_o[i]))
            o_circ_y= (-0.8 + .3 * Math.sin(linspace_o[i]))
            _X.push([o_circ_x, o_circ_y])
          }

          for (let i = 0; i< linspace_i.length ; i++){
            i_circ_x= (0.7 + .3 * Math.cos(linspace_i[i]))
            i_circ_y= (0.7 + .3 * Math.sin(linspace_i[i]))
            _X.push([i_circ_x, i_circ_y])
          }


          if (noise) {
            for(let i=0;i<_X.length;i++){
              for(let j=0;j<_X[i].length;j++){
                _X[i][j] += Utilidades.random_normal_dist()
              }
            }
          }

          let y = Array.from(Array(n_steps_o), () => 0).concat(Array.from(Array(n_steps_i), () => 1))
          for(let i=0;i<y.length;i++){
            y[i] = [y[i]]
          }

          return {
            X: _X, 
            y: y
          }
        },
        circulo : (steps, factor, noise=false) => {
          let n_steps_o = Math.floor(steps /2)
          let n_steps_i = steps - n_steps_o
          let linspace_o = Utilidades.linspace(0, 2 * Math.PI, n_steps_o)
          let linspace_i = Utilidades.linspace(0, 2 * Math.PI, n_steps_i)
          
          let _X =  []
          
          let o_circ_x = []
          let o_circ_y = []
          let i_circ_x = []
          let i_circ_y = []
          for (let i = 0; i< linspace_o.length ; i++){
            o_circ_x= (Math.cos(linspace_o[i]))
            o_circ_y= (Math.sin(linspace_o[i]))
            _X.push([o_circ_x, o_circ_y])
          }
          for (let i = 0; i< linspace_i.length ; i++){
            i_circ_x= (Math.cos(linspace_i[i])*factor)
            i_circ_y= (Math.sin(linspace_i[i])*factor)
            _X.push([i_circ_x, i_circ_y])
          }

          let y = Array.from(Array(n_steps_o), () => 0).concat(Array.from(Array(n_steps_i), () => 1))
          for(let i=0;i<y.length;i++){
            y[i] = [y[i]]
          }
          if (noise) {
            for(let i=0;i<_X.length;i++){
              for(let j=0;j<_X[i].length;j++){
                _X[i][j] += Utilidades.random_normal_dist()
              }
            }
          }
          
          return {
            X:_X, 
            y: y
          }
        }

}
}();

