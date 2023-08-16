// 8x8 Hidden layers max
let topologia = [2,1];
svg_grafos_canvas_w = 800;
svg_grafos_canvas_h = 600;

dibujar();
Dibujo.inicializar("#resultado", "svg2", 400, 400);



function dibujar() {
    // limpiamos todos los elementos visuales (svg)
    Utilidades.removeAllChildNodes(document.querySelector('#nn'));
    // estructura de matrizes representando una red neuronal
    nn = Cerebro.inicializar(topologia);
    // representacion en D3 de la red neuronal
    Dibujo.inicializar("#nn", "svg1", svg_grafos_canvas_w, svg_grafos_canvas_h );
    let grafo = Cerebro.datosGrafo(nn);
    Dibujo.grafo(grafo);
    Dibujo.resultado();
}