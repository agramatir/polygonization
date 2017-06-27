function intersects(x1,y1,x2,y2,x3,y3,x4,y4,precision) {
  var intPt,x,y,result = false, 
    p = precision || 6,
    denominator = (x1 - x2)*(y3 - y4) - (y1 -y2)*(x3 - x4);
  if (denominator == 0) {
    // check both segments are Coincident, we already know 
    // that these two are parallel 
    if (fix((y3 - y1)*(x2 - x1),p) == fix((y2 -y1)*(x3 - x1),p)) {
      // second segment any end point lies on first segment
      result = intPtOnSegment(x3,y3,x1,y1,x2,y2,p) ||
        intPtOnSegment(x4,y4,x1,y1,x2,y2,p);
    }
  } else {
    x = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4))/denominator;
    y = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4))/denominator;
    // check int point (x,y) lies on both segment 
    result = intPtOnSegment(x,y,x1,y1,x2,y2,p) 
      && intPtOnSegment(x,y,x3,y3,x4,y4,p);
  }
  return result;
} 

function intPtOnSegment(x,y,x1,y1,x2,y2,p) {
  return fix(Math.min(x1,x2),p) <= fix(x,p) && fix(x,p) <= fix(Math.max(x1,x2),p) 
    && fix(Math.min(y1,y2),p) <= fix(y,p) && fix(y,p) <= fix(Math.max(y1,y2),p); 
}

// fix to the precision
function fix(n,p) {
  return parseInt(n * Math.pow(10,p));
}