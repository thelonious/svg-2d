/*****
*
*   RelativeCurveto2.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
RelativeCurveto2.prototype             = new RelativePathSegment();
RelativeCurveto2.prototype.constructor = RelativeCurveto2;
RelativeCurveto2.superclass            = RelativePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function RelativeCurveto2(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("q", params, owner, previous);
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
RelativeCurveto2.prototype.getControlPoint = function() {
    return this.handles[0].point;
};


/*****
*
*   getIntersectionParams
*
*****/
RelativeCurveto2.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Bezier2",
        [
            this.previous.getLastPoint(),
            this.handles[0].point,
            this.handles[1].point
        ]
    );
};

