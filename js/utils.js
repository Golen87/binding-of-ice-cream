
// Return angle from point to point
function pointAngle(x1, y1, x2, y2) {
    return Math.atan2(y2-y1, x2-x1) * 57.29577951308232;
}

// Return angle from point to point
function pointDistance(x1, y1, x2, y2) {
    return Math.sqrt((y2-y1)*(y2-y1) + (x2-x1)*(x2-x1));
}
