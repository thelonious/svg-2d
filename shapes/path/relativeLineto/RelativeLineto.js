/*****
*
*   RelativeLineto.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
RelativeLineto.prototype             = new RelativePathSegment();
RelativeLineto.prototype.constructor = RelativeLineto;
RelativeLineto.superclass            = RelativePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function RelativeLineto(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("l", params, owner, previous);
    }
}


/*****
*
*   toString
*
*   override to handle case when Moveto is previous command
*
*****/
RelativeLineto.prototype.toString = function() {
    var points  = new Array();
    var command = "";
    var lastPoint;
    var point;

    if ( this.previous )
        lastPoint = this.previous.getLastPoint();
    else
        lastPoint = new Point(0,0);

    point = this.handles[0].point.subtract( lastPoint );
    
    if ( this.previous.constructor != this.constuctor )
        if ( this.previous.constructor != RelativeMoveto )
            cmd = this.command;

    return cmd + point.toString();
};


/*****
*
*   get/set methods
*
*****/

/*****
*
*   getIntersectionParams
*
*****/
RelativeLineto.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Line",
        [
            this.previous.getLastPoint(),
            this.handles[0].point
        ]
    );
};

