/*****
*
*   AbsoluteSmoothCurveto2.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
AbsoluteSmoothCurveto2.prototype             = new AbsolutePathSegment();
AbsoluteSmoothCurveto2.prototype.constructor = AbsoluteSmoothCurveto2;
AbsoluteSmoothCurveto2.superclass            = AbsolutePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function AbsoluteSmoothCurveto2(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("T", params, owner, previous);
    }
}


/*****
*
*   get/set methods
*
*****/

/*****
*
*   getControlPoint
*
*****/
AbsoluteSmoothCurveto2.prototype.getControlPoint = function() {
    var lastPoint = this.previous.getLastPoint();
    var point;
    
    if ( this.previous.command.match(/^[QqTt]$/) ) {
        var ctrlPoint = this.previous.getControlPoint();
        var diff      = ctrlPoint.subtract(lastPoint);

        point = lastPoint.subtract(diff);
    } else {
        point = lastPoint;
    }

    return point;
};


/*****
*
*   getIntersectionParams
*
*****/
AbsoluteSmoothCurveto2.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Bezier2",
        [
            this.previous.getLastPoint(),
            this.getControlPoint(),
            this.handles[0].point
        ]
    );
};

