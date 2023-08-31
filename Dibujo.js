var Dibujo = function() {
    var svg, svg2;
    var width, height;
    var nodeSize = 20;
    let _nodes;
    //var color = d3.scale.category20();

    function agrupador (x, y, w , h, objId) {
        svg.append("rect")
        .attr("id", objId)
        .attr("x", x)
        .attr("y", y)
        .attr("width", w)
        .attr("height", h)
        .style("fill-opacity",0.1);
    }

    function agregaEntradaBoton() {
        if(topologia[0]+1 <= 8) {
            topologia[0] += 1;
            document.querySelector("#infoEntradas").innerHTML = topologia[0] + " nodos";
            dibujar();
        }
    }
    
    function agregaOcultaBoton() {
        if(topologia.length < 10) {
            topologia.splice(topologia.length-1, 0, 1);
            document.querySelector("#infoOcultas").innerHTML = topologia.length - 2 + " Capas Ocultas";
            document.getElementById("nodoOculto"+(topologia.length - 2)).style.display="block";
            dibujar();
        }
    }
    
    function agregarNodoOcultoBoton() {
        let i = parseInt(document.querySelector("#"+event.currentTarget.id).getAttribute("ori"));
        if(topologia.length > 2 && topologia[i] !== null){
            if(topologia[i] < 8 ){
                topologia[i] += 1;
                document.querySelector("#infoNodoOculto"+i).innerHTML = topologia[i] + " nodos";  
            }
        }
        dibujar();
    }
    
    function removerEntradaBoton() {
        if(topologia[0]-1 > 0) {
            topologia[0] -= 1;
            let tNodes= topologia[0] ==1? " nodo": " nodos"
            document.querySelector("#infoEntradas").innerHTML = topologia[0] + tNodes;  
            dibujar();
        }
    }
    
    function removerOcultaBoton() {
        if(topologia.length > 2) {
            topologia.splice(topologia.length -2, 1);
            let tCapa= topologia.length -2 ==1 ? " Capa Oculta": " Capas Ocultas"
            document.querySelector("#infoOcultas").innerHTML = topologia.length - 2 + tCapa;
            document.getElementById("nodoOculto"+(topologia.length - 1)).style.display="none";
            document.querySelector("#infoNodoOculto"+(topologia.length - 1)).innerHTML = "1 nodo";
            dibujar();
        }
    }
    
    function removerNodoOcultoBoton(){
        let i = parseInt(document.querySelector("#"+event.currentTarget.id).getAttribute("ori"));
        if(topologia.length > 2 && topologia[i] !== null){
            if (topologia[i] == 1){
                topologia.splice(i, 1);
                document.getElementById("nodoOculto"+(topologia.length - 1)).style.display="none";
            }else{
                topologia[i] -= 1;
            }
            let tNodes= topologia[i] == 1? " nodo": " nodos"
            document.querySelector("#infoNodoOculto"+i).innerHTML = topologia[i] + tNodes;
            let tCapa= topologia.length -2 ==1 ? " Capa Oculta": " Capas Ocultas"
            document.querySelector("#infoOcultas").innerHTML = topologia.length - 2 + tCapa;
            dibujar();
        }
    }
    
    function reiniciar(){
        topologia = [1,1];
        for(let i = 1; i <= 8 ; i++){
            document.querySelector("#infoNodoOculto"+i).innerHTML = "1 nodo";
            document.getElementById("nodoOculto"+i).style.display="none";
            document.querySelector("#infoEntradas").innerHTML = "1 nodo"
        }
        dibujar();
    }
    return {
        inicializar: (htmlObj, svgid, _width, _height) => {
            width = _width;
            height = _height;
            svg = d3.select(htmlObj).append("svg")
            .attr("id", svgid)
            .attr("width", width)
            .attr("height", height);
        },
        grafo: (nodes) => {
            var netsize = {};
            
            // obtenemos el tamaño de nuestras capas y lo anexamos a la estructura nodes
            nodes.forEach(function (d) {

                if(d.layer in netsize) {
                    netsize[d.layer] += 1;
                } else {
                    netsize[d.layer] = 1;
                }
                d["lidx"] = netsize[d.layer];
            });
            
            // obtenemos la capa con mas nodos y la usamos como referencia
            var largestLayerSize = Math.max.apply(
                null, Object.keys(netsize).map(function (i) { return netsize[i]; }));

            // calcular la distancia entre nodes
            var xdist = width / Object.keys(netsize).length,
                ydist = height / largestLayerSize;
            
            // calculamos x,y para cada nodo y lo agregamos a la estructura nodes
            nodes.map(function(d) {
                if (d.layer == 1) {
                    d["x"] = 40;
                } else if(d.label == "o") {
                    d["x"] = 760;
                } else {
                    d["x"] = (d.layer - 0.5) * xdist;
                }
                d["y"] = (d.lidx -0.5) * ydist ;
                //d["y"] = ( ( (d.lidx - 0.5) + ((largestLayerSize - netsize[d.layer]) /2 ) ) * ydist )+10 ;
            });

            // generamos las lineas que conectan dos nodos y los agregamos a la estructura links
            var links = [];
            nodes.map(function(d, i) {
                for (var n in nodes) {
                    if (d.layer + 1 == nodes[n].layer) {
                         links.push({"source": parseInt(i), "target": parseInt(n), "value": 1}) 
                    }
                }
            }).filter(function(d) { return typeof d !== "undefined"; });
            _nodes = nodes;
            // dibujamos las lineas usando los datos de la estructura links
            var link = svg.selectAll(".link")
                .data(links)
                .enter().append("line")
                .attr("class", "link")
                .attr("x1", function(d) { return nodes[d.source].x; })
                .attr("y1", function(d) { return nodes[d.source].y; })
                .attr("x2", function(d) { return nodes[d.target].x; })
                .attr("y2", function(d) { return nodes[d.target].y; })
                .style("stroke-width", function(d) { return Math.sqrt(d.value); });
            
            // svg.append("line")
            //     .attr("class", "link")
            //     .attr("x1", function(d) { return nodes[nodes.length-1].x; })
            //     .attr("y1", function(d) { return nodes[nodes.length-1].y; })
            //     .attr("x2", width)
            //     .attr("y2", function(d) { return nodes[nodes.length-1].y; })
            //     .style("stroke-width", 3);


            // dibujamos los nodos usando los datos de la estructura nodes
            var node = svg.selectAll(".node")
                .data(nodes)
                .enter().append("g")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")"; }
                );

            // funcion para dibujar un circulo de un color
            var circle = node.append("circle")
                .attr("class", "node")
                .attr("r", nodeSize)
                .style("fill", function(d) { return d.color; });

            // funcion para escribir el texto en el centro del nodo
            node.append("text")
                .attr("dx", "-.35em")
                .attr("dy", ".35em")
                .text(function(d) { return d.label; });

            
        },
        agrupadores: () => {
            agrupador(_nodes[0].x - 30, 10, 60, height, "groupRectEntrada");
            agrupador(90, 10, 620, height, "groupRectOculta");
            agrupador(_nodes[_nodes.length-1].x - 30, 10, 60, height, "groupRectOculta");
        },
        resultado: () => {
            var data = [10, 15, 20, 25, 30];
            var svg2 = d3.select("svg2")

            var xscale = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .range([0, width - 100]);

            var yscale = d3.scaleLinear()
                    .domain([0, d3.max(data)])
                    .range([height/2, 0]);

            var x_axis = d3.axisBottom()
                    .scale(xscale);

            var y_axis = d3.axisLeft()
                    .scale(yscale);

                svg2.append("g")
                .attr("transform", "translate(50, 10)")
                .call(y_axis);

            var xAxisTranslate = height/2 + 10;

            svg2.append("g")
                .attr("transform", "translate(50, " + xAxisTranslate  +")")
                .call(x_axis)

        },
        deshabilitar: () => {
            document.getElementById("bAgregaEntrada").onclick = 
            document.getElementById("bRemueveEntrada").onclick = 
            document.getElementById("bAgregaOcultas").onclick = 
            document.getElementById("bRemueveOcultas").onclick = 
            document.getElementById("bAgregaNodoOculto").onclick = 
            document.getElementById("bAgregaNodoOculto2").onclick = 
            document.getElementById("bAgregaNodoOculto3").onclick = 
            document.getElementById("bAgregaNodoOculto4").onclick = 
            document.getElementById("bAgregaNodoOculto5").onclick = 
            document.getElementById("bAgregaNodoOculto6").onclick = 
            document.getElementById("bAgregaNodoOculto7").onclick = 
            document.getElementById("bAgregaNodoOculto8").onclick = 
            document.getElementById("bRemueveNodoOculto").onclick = 
            document.getElementById("bRemueveNodoOculto2").onclick = 
            document.getElementById("bRemueveNodoOculto3").onclick = 
            document.getElementById("bRemueveNodoOculto4").onclick = 
            document.getElementById("bRemueveNodoOculto5").onclick = 
            document.getElementById("bRemueveNodoOculto6").onclick = 
            document.getElementById("bRemueveNodoOculto7").onclick = 
            document.getElementById("bRemueveNodoOculto8").onclick = 
            document.getElementById("bReiniciarEstructura").onclick = NaN;
        },
        habilitar: () => {
            document.getElementById("bAgregaEntrada").onclick = agregaEntradaBoton;
            document.getElementById("bRemueveEntrada").onclick = removerEntradaBoton;
            document.getElementById("bAgregaOcultas").onclick = agregaOcultaBoton;
            document.getElementById("bRemueveOcultas").onclick = removerOcultaBoton;
            document.getElementById("bAgregaNodoOculto").onclick = agregarNodoOcultoBoton;
            document.getElementById("bAgregaNodoOculto2").onclick = agregarNodoOcultoBoton;
            document.getElementById("bAgregaNodoOculto3").onclick = agregarNodoOcultoBoton;
            document.getElementById("bAgregaNodoOculto4").onclick = agregarNodoOcultoBoton;
            document.getElementById("bAgregaNodoOculto5").onclick = agregarNodoOcultoBoton;
            document.getElementById("bAgregaNodoOculto6").onclick = agregarNodoOcultoBoton;
            document.getElementById("bAgregaNodoOculto7").onclick = agregarNodoOcultoBoton;
            document.getElementById("bAgregaNodoOculto8").onclick = agregarNodoOcultoBoton;
            document.getElementById("bRemueveNodoOculto").onclick = removerNodoOcultoBoton;
            document.getElementById("bRemueveNodoOculto2").onclick = removerNodoOcultoBoton;
            document.getElementById("bRemueveNodoOculto3").onclick = removerNodoOcultoBoton;
            document.getElementById("bRemueveNodoOculto4").onclick = removerNodoOcultoBoton;
            document.getElementById("bRemueveNodoOculto5").onclick = removerNodoOcultoBoton;
            document.getElementById("bRemueveNodoOculto6").onclick = removerNodoOcultoBoton;
            document.getElementById("bRemueveNodoOculto7").onclick = removerNodoOcultoBoton;
            document.getElementById("bRemueveNodoOculto8").onclick = removerNodoOcultoBoton;

            document.getElementById("bReiniciarEstructura").onclick = reiniciar;
        }
    }
}();