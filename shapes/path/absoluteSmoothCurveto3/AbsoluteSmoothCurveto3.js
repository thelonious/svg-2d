/*****
*
*   AbsoluteSmoothCurveto3.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
AbsoluteSmoothCurveto3.prototype             = new AbsolutePathSegment();
AbsoluteSmoothCurveto3.prototype.constructor = AbsoluteSmoothCurveto3;
AbsoluteSmoothCurveto3.superclass            = AbsolutePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function AbsoluteSmoothCurveto3(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("S", params, owner, previous);
    }
}


/*****
*
*   get/set methods
*
*****/

/*****
*
*   getFirstControlPoint
*
*****/
AbsoluteSmoothCurveto3.prototype.getFirstControlPoint = function() {
    var lastPoint = this.previous.getLastPoint();
    var point;
    
    if ( this.previous.command.match(/^[SsCc]$/) ) {
        var lastControl = this.previous.getLastControlPoint();
        var diff        = lastControl.subtract(lastPoint);

        point = lastPoint.subtract(diff);
    } else {
        point = lastPoint;
    }

    return point;
};


/*****
*
*   getLastControlPoint
*
*****/
AbsoluteSmoothCurveto3.prototype.getLastControlPoint = function() {
    return this.handles[0].point;
};


/*****
*
*   getIntersectionParams
*
*****/
AbsoluteSmoothCurveto3.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Bezier3",
        [
            this.previous.getLastPoint(),
            this.getFirstControlPoint(),
            this.handles[0].point,
            this.handles[1].point
        ]
    );
};

