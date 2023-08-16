var Utilidades = function(t,e){
    return {
        removeAllChildNodes:  (parent) => {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
}
}();