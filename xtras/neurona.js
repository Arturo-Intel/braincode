let input = [
    [0,0],
    [0,1],
    [1,0],
    [1,1]

];

let output = [ 
    0,
    0,
    0,
    1
];

let neurona = {
    pesos: [],
    sesgo: null,
    lr: 0.001,
    init: function (n_pesos){
        for(let i =0; i<n_pesos;i++) {
            this.pesos[i] = Math.random() * (0.5 + 0.5) - 0.5;
        }
        this.sesgo = Math.random() * (0.5 + 0.5) - 0.5;
    },
    salida(input) {
        let salida = 0;
        for(let ii = 0; ii < input.length; ii++) {
            salida += this.pesos[ii] * input[ii];
        }
        salida += this.sesgo;
        
        if(salida < 1){
            salida = 0;
        }else {
            salida = 1; 
        }

        return salida;
    },
    train(epochs, data_input, data_output) {
        for(let i=0; i < epochs; i++) {
            let errorEpoch = 0;
            for(let j =0; j < data_input.length; j++) {
                let currentInput = data_input[j];
                let currentOutput = data_output[j];
                let salida = this.salida(currentInput);
                let error = currentOutput - salida;
                errorEpoch += Math.abs(error);
                this.ajustePesos(error, currentInput);
            }
            //console.log(errorEpoch/data_input.length);
        }
    }, 
    ajustePesos(error, currentInput) {
        for( let i = 0; i <this.pesos.length; i++) {
            let ajuste = error * this.lr * currentInput[i];
            this.pesos[i] += ajuste;
        }
        let ajuste = error * this.lr * 1;
        this.sesgo += ajuste;
    }
};

neurona.init(2);
neurona.train(2000, input, output);
for(let i=0; i< input.length; i++){
    console.log("************************");
    console.log("Entrada: ");
    console.log(input[i]);
    console.log("Salida: ");
    console.log(neurona.salida(input[i]));
    console.log("Salida Esperada");
    console.log(output[i]);
}

