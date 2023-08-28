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
        }
}
}();