/*****
*
*   RelativeSmoothCurveto2.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
RelativeSmoothCurveto2.prototype             = new RelativePathSegment();
RelativeSmoothCurveto2.prototype.constructor = RelativeSmoothCurveto2;
RelativeSmoothCurveto2.superclass            = RelativePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function RelativeSmoothCurveto2(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("t", params, owner, previous);
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
RelativeSmoothCurveto2.prototype.getControlPoint = function() {
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
RelativeSmoothCurveto2.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Bezier2",
        [
            this.previous.getLastPoint(),
            this.getControlPoint(),
            this.handles[0].point
        ]
    );
};

