/*****
*
*   RelativeClosePath.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
RelativeClosePath.prototype             = new RelativePathSegment();
RelativeClosePath.prototype.constructor = RelativeClosePath;
RelativeClosePath.superclass            = RelativePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function RelativeClosePath(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("z", params, owner, previous);
    }
}


/*****
*
*   get/set methods
*
*****/

/*****
*
*   getLastPoint
*
*****/
RelativeClosePath.prototype.getLastPoint = function() {
    var current = this.previous;
    var point;

    while ( current ) {
        if ( current.command.match(/^[mMzZ]$/) ) {
            point = current.getLastPoint();
            break;
        }
        current = current.previous;
    }

    return point;
};


/*****
*
*   getIntersectionParams
*
*****/
RelativeClosePath.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Line",
        [
            this.previous.getLastPoint(),
            this.getLastPoint()
        ]
    );
};

