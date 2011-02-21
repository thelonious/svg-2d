/*****
*
*   RelativeCurveto3.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
RelativeCurveto3.prototype             = new RelativePathSegment();
RelativeCurveto3.prototype.constructor = RelativeCurveto3;
RelativeCurveto3.superclass            = RelativePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function RelativeCurveto3(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("c", params, owner, previous);
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
RelativeCurveto3.prototype.getLastControlPoint = function() {
    return this.handles[1].point;
};


/*****
*
*   getIntersectionParams
*
*****/
RelativeCurveto3.prototype.getIntersectionParams = function() {
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

