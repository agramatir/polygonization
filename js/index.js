window.onload = function () {
	var width = 1300, height = 700, points, bnd = [], selected = [], feasiblePoints = [], selectedPoint, selectedEdge, solution, numPoints, solutionGreedy;


	document.getElementById("next").onclick = execute;
	document.getElementById("minimal").onclick = executeGreedy;
	document.getElementById("generate").onclick = initialize;


	function getRandomPoints(n) {
		var mX=50, mY=50;//margin;
		return d3.range(0,n).map(function(d){ 
			return {i:d, x:mX+Math.round(Math.random()*(width-2*mX)), y:mY+Math.round(Math.random()*(height-2*mY))};
			});
	}

	function initialize() {	
		numPoints = document.getElementById("num-points").value;
		points=getRandomPoints(numPoints);
		execute();		
	}

	function execute() {
		d3.select("svg").remove();
		d3.select("body").append("svg").attr("width",width).attr("height",height);
		d3.select("svg").append("line").attr("class","sweepline");
		d3.select("svg").append("polyline");
		d3.select("svg").append("polyline").attr("class", "selected");
		d3.select("svg").append("line").attr("class","ray")
		
		d3.select("svg").selectAll(".points").data(points).enter().append("circle").attr("class","points")
			.attr("cx",function(d){ return d.x}).attr("cy",function(d){ return d.y})
			.attr("r",6);

		solution = new SteadyGrowth(points);
		bnd = solution.buildInitialTriangle();
		console.log(bnd);

		d3.selectAll(".points").filter(function(d){ 
			return bnd.indexOf(d) != -1;
		}).transition().delay(500).style("fill","red");		

		while(bnd.length != numPoints) nextIteration();

		selectedEdge = null;
		selected = [];
		selectedPoint = null;

		var area = solution.area(bnd);
		document.getElementById("area").innerHTML = area;

		redrawBoundary();
	}


	function executeGreedy() {
		d3.select("svg").remove();
		d3.select("body").append("svg").attr("width",width).attr("height",height);
		d3.select("svg").append("line").attr("class","sweepline");
		d3.select("svg").append("polyline");
		d3.select("svg").append("polyline").attr("class", "selected");
		d3.select("svg").append("line").attr("class","ray")
		
		d3.select("svg").selectAll(".points").data(points).enter().append("circle").attr("class","points")
			.attr("cx",function(d){ return d.x}).attr("cy",function(d){ return d.y})
			.attr("r",6);

		solutionGreedy = new SteadyGrowthGreedy(points);
		bnd = solutionGreedy.buildInitialTriangle();
		console.log(bnd);

		d3.selectAll(".points").filter(function(d){ 
			return bnd.indexOf(d) != -1;
		}).transition().delay(500).style("fill","red");		

		while(bnd.length != numPoints) nextIterationGreedy();

		selectedEdge = null;
		selected = [];
		selectedPoint = null;

		var area = solutionGreedy.area(bnd);
		document.getElementById("area").innerHTML = area;

		redrawBoundary();
	}

	function nextIteration() {
		//redrawBoundary();
		feasiblePoints = solution.feasiblePoints(bnd);
		selectedPoint = solution.selectFeasiblePoint(feasiblePoints);
		selected = solution.visibleEdges(bnd, selectedPoint);
		//console.log(selected);
		selectedEdge = solution.selectEdge(selected);
		//console.log(selectedEdge);
		solution.addPointToSolution(bnd, selectedPoint, selectedEdge);
		//redrawBoundary();
		/*setTimeout(function(){
			
			redrawBoundary();
		}, 3000);*/
	}

	function nextIterationGreedy() {

		[selectedPoint, selectedEdge] = solutionGreedy.selectPointAndEdge(bnd);
		solution.addPointToSolution(bnd, selectedPoint, selectedEdge);
	}

	function redrawBoundary(t){
	setTimeout(function(){
		d3.select("polyline")
			.attr("points",function(){ var r=[]; bnd.forEach( function(d){ 
				r.push(""+points[d.i].x+','+points[d.i].y);
			});
			r.push(""+points[bnd[0].i].x+','+points[bnd[0].i].y);
			return r.join(" ");
		});

		d3.select(".selected")
			.attr("points",function(){ var r=[]; selected.forEach( function(d){ 
				r.push(""+points[d.A.i].x+','+points[d.A.i].y);
				r.push(""+points[d.B.i].x+','+points[d.B.i].y);
			});
			return r.join(" ");
		});

		d3.selectAll(".points")
			.filter(function(d){ return bnd.indexOf(d.i) == -1;}).style("fill","steelblue");
		d3.selectAll(".points")
			.filter(function(d){ return bnd.indexOf(d.i) != -1;}).style("fill","red");
		d3.selectAll(".points")
			.filter(function(d){ return feasiblePoints.indexOf(d) != -1;}).style("fill","green");
		d3.selectAll(".points")
			.filter(function(d){ return d == selectedPoint}).style("fill","yellow");


		if(selectedEdge)
			d3.select(".sweepline").attr("x1",selectedEdge.A.x).attr("y1",selectedEdge.A.y)
				.attr("x2",selectedEdge.B.x).attr("y2",selectedEdge.B.y);
		else
			d3.select(".sweepline").attr("x1",null).attr("y1",null)
				.attr("x2",null).attr("y2",null);

	},t);
}

}











