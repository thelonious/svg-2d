/*****
*
*   AbsoluteCurveto2.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
AbsoluteCurveto2.prototype             = new AbsolutePathSegment();
AbsoluteCurveto2.prototype.constructor = AbsoluteCurveto2;
AbsoluteCurveto2.superclass            = AbsolutePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function AbsoluteCurveto2(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("Q", params, owner, previous);
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
AbsoluteCurveto2.prototype.getControlPoint = function() {
    return this.handles[0].point;
};


/*****
*
*   getIntersectionParams
*
*****/
AbsoluteCurveto2.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Bezier2",
        [
            this.previous.getLastPoint(),
            this.handles[0].point,
            this.handles[1].point
        ]
    );
};

