
function SteadyGrowth(points) {
	this.buildInitialTriangle = buildInitialTriangle;
	this.feasiblePoints = feasiblePoints;
	this.selectFeasiblePoint = selectFeasiblePoint;
	this.visibleEdges = visibleEdges;
	this.selectEdge = selectEdge;
	this.addPointToSolution = addPointToSolution;
	this.area = polygonArea;

	// Points are always in the correct order
	this.points = points;
}


function SteadyGrowthGreedy(points) {
	this.buildInitialTriangle = buildInitialTriangleGreedy;
	this.selectPointAndEdge = selectPointAndEdgeGreedy;
	this.addPointToSolution = addPointToSolution;
	this.area = polygonArea;

	// Points are always in the correct order
	this.points = points;
}



function buildInitialTriangle() {
	var points = this.points;
	var size = points.length;
	var result;
	var resultApproached = false;
	var pointInTriangleFound = false;
	while(!resultApproached) {
		result = [];
		for (var i = 0; result.length < 3; i++) {
			var candidate = Math.floor(Math.random() * size);
			for(var j = 0; j<result.length; j++)
				if(candidate == result[j].i) candidate = -1;
			if(candidate != -1) result.push(points[candidate]);
		}
		for(var i = 0; i<points.length; i++) {
			if(i == result[0].i || i == result[1].i || i == result[2].i)
				continue;
			pointInTriangleFound = isInTriangle(points[result[0].i], points[result[1].i], points[result[2].i], points[i]);
			if(pointInTriangleFound) break;
		}
		resultApproached = !pointInTriangleFound;			
	}
	if(!isLeftTurn(result[0], result[1], result[2])) 
	{
		var temp = result[0];
		result[0] = result[1];
		result[1] = temp;
	}
	return result;
	
}

function isInTriangle(A, B, C, point) {
	var area = triangleArea(A, B, C);
	var addArea = triangleArea(A, B, point) + triangleArea(B, C, point) + triangleArea(A, C, point);
	return (Math.abs(area - addArea) < 1 ? true : false);
}

function triangleArea(A, B, C) {
	return Math.abs((A.x*(B.y-C.y) + B.x*(C.y-A.y)+ C.x*(A.y-B.y))/2.0);
}


function containsPoint(points, test) {
  var result = false;
  for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
    if ((points[i].y > test.y) != (points[j].y > test.y) &&
        (test.x < (points[j].x - points[i].x) * (test.y - points[i].y) / (points[j].y-points[i].y) + points[i].x)) {
      result = !result;
     }
  }
  return result;
}

function feasiblePoints(currentPoints) {
	var possiblePoints = [];
	for (var i = 0; i<this.points.length; i++) {
		if(currentPoints.indexOf(this.points[i]) == -1)
			possiblePoints.push(this.points[i]);
	}
	var feasiblePoints = [];
	for(var i = 0; i<possiblePoints.length; i++) {
		var pointsToTest = currentPoints.slice();
		pointsToTest.push(possiblePoints[i]);
		var chContains = false;
		for(var j = 0; j<possiblePoints.length; j++) {
			if(i == j) continue;
			if(containsPoint(convexHull(pointsToTest), possiblePoints[j])) {
				chContains = true;
				break;
			}
		}
		if(!chContains) feasiblePoints.push(possiblePoints[i]);
	}
	return feasiblePoints;
}

function selectFeasiblePoint(feasiblePoints) {
	return feasiblePoints[Math.floor(Math.random() * feasiblePoints.length)];
}



// Returns a convex hull of the set of points in the correct format
function convexHull(points) {
	var convexHull = new ConvexHullGrahamScan();

	for(var i = 0; i<points.length; i++) {
		convexHull.addPoint(points[i].x, points[i].y);
	}
	var hullPoints = convexHull.getHull();
	return hullPoints;
}

function visibleEdgesOld(currentPoints, point) {
	var edges = [];
	for (var i = 0; i<currentPoints.length; i++) {
		if(isRightTurn(point, currentPoints[i], currentPoints[(i+1) % currentPoints.length]))
			edges.push({
				A: currentPoints[i],
				B: currentPoints[(i+1) % currentPoints.length]
			});
	}
	return edges;
}

function visibleEdges(currentPoints, point) {
	var edges = [];
	for (var i = 0; i<currentPoints.length; i++) {
		if(isPossibleEdge(currentPoints, currentPoints[i], currentPoints[(i+1)%currentPoints.length], point))
			edges.push({
				A: currentPoints[i],
				B: currentPoints[(i+1) % currentPoints.length]
			});
	}
	return edges;
}

function isPossibleEdge(currentPoints, i1, i2, point) {
	for (var i = 0; i<currentPoints.length; i++) {
		if(currentPoints[i] == i1) continue;
		if(currentPoints[(i+1) % currentPoints.length] == i1) {
			if(intersects(currentPoints[i].x,currentPoints[i].y, currentPoints[(i+1)%currentPoints.length].x, currentPoints[(i+1)%currentPoints.length].y,
				point.x, point.y, i2.x, i2.y)) return false;
			continue;
		}
		if(currentPoints[i] == i2) {
			if(intersects(currentPoints[i].x,currentPoints[i].y, currentPoints[(i+1)%currentPoints.length].x, currentPoints[(i+1)%currentPoints.length].y,
				point.x, point.y, i1.x, i1.y)) return false;
			continue;
		}
		if (intersects(currentPoints[i].x,currentPoints[i].y, currentPoints[(i+1)%currentPoints.length].x, currentPoints[(i+1)%currentPoints.length].y,
		 i1.x,i1.y,point.x,point.y) ||  intersects(currentPoints[i].x,currentPoints[i].y,currentPoints[(i+1)%currentPoints.length].x,currentPoints[(i+1)%currentPoints.length].y,
		 i2.x,i2.y,point.x,point.y)) return false;
	}
	return true;
}

function isLeftTurn(A, B, C) {
	return ((B.x - A.x)*(C.y - A.y) - (B.y - A.y)*(C.x - A.x) <= 0);
}

function isRightTurn(A, B, C) {
	return ((B.x - A.x)*(C.y - A.y) - (B.y - A.y)*(C.x - A.x) >= 0);
}

function selectEdge(possibleEdges) {
	return possibleEdges[Math.floor(Math.random() * possibleEdges.length)];
}

function addPointToSolution(currentPoints, point, selectEdge) {
	var index = currentPoints.indexOf(selectEdge.A);
	currentPoints.splice(index+1, 0, point);
}


function polygonArea(points) 
{ 
  var area = 0;         // Accumulates area in the loop
  var j = points.length-1;  // The last vertex is the 'previous' one to the first

  for (var i=0; i<points.length; i++)
    { area = area +  (points[j].x+points[i].x) * (points[j].y-points[i].y); 
      j = i;  //j is previous vertex to i
    }
  return Math.abs(area/2);
}

function buildInitialTriangleGreedy() {
	var minArea = 1e18;
	var solution = [];
	var points = this.points;
	var i = Math.floor(Math.random() * points.length);
	for (var j = 0; j<points.length; j++) {
		if(i == j) continue;
		for (var k = 0; k<points.length; k++) {
			if(i == k || j == k) continue;
			var triangle = [points[i], points[j], points[k]];
			var area = polygonArea(triangle);
			if(area < minArea) {
				solution = triangle;
				minArea = area;
			}
		}
	}
	if(!isLeftTurn(solution[0], solution[1], solution[2])) 
	{
		var temp = solution[0];
		solution[0] = solution[1];
		solution[1] = temp;
	}
	return solution;
}

function selectPointAndEdgeGreedy(currentPoints) {
	var possiblePoints = [];
	for (var i = 0; i<this.points.length; i++) {
		if(currentPoints.indexOf(this.points[i]) == -1)
			possiblePoints.push(this.points[i]);
	}
	var minArea = 1e18;
	var point, edge;
	for (var i =0; i<possiblePoints.length; i++) {
		var edges = visibleEdges(currentPoints, possiblePoints[i]);
		for (var j = 0; j<edges.length; j++) {
			var area = polygonArea(possiblePoints[i], edges[j].A, edges[j].B);
			if(area < minArea) {
				minArea = area;
				point = possiblePoints[i];
				edge = edges[j];
			}
		}
	}
	return [point, edge];
}

