/*****
*
*   RelativeSmoothCurveto3.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
RelativeSmoothCurveto3.prototype             = new RelativePathSegment();
RelativeSmoothCurveto3.prototype.constructor = RelativeSmoothCurveto3;
RelativeSmoothCurveto3.superclass            = RelativePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function RelativeSmoothCurveto3(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("s", params, owner, previous);
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
RelativeSmoothCurveto3.prototype.getFirstControlPoint = function() {
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
RelativeSmoothCurveto3.prototype.getLastControlPoint = function() {
    return this.handles[0].point;
};


/*****
*
*   getIntersectionParams
*
*****/
RelativeSmoothCurveto3.prototype.getIntersectionParams = function() {
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

