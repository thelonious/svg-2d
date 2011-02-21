/*****
*
*   AbsoluteCurveto3.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
AbsoluteCurveto3.prototype             = new AbsolutePathSegment();
AbsoluteCurveto3.prototype.constructor = AbsoluteCurveto3;
AbsoluteCurveto3.superclass            = AbsolutePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function AbsoluteCurveto3(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("C", params, owner, previous);
    }
}


/*****
*
*   get/set methods
*
*****/

/*****
*
*   getLastControlPoint
*
*****/
AbsoluteCurveto3.prototype.getLastControlPoint = function() {
    return this.handles[1].point;
};


/*****
*
*   getIntersectionParams
*
*****/
AbsoluteCurveto3.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Bezier3",
        [
            this.previous.getLastPoint(),
            this.handles[0].point,
            this.handles[1].point,
            this.handles[2].point
        ]
    );
};

