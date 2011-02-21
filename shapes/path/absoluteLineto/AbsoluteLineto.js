/*****
*
*   AbsoluteLineto.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
AbsoluteLineto.prototype             = new AbsolutePathSegment();
AbsoluteLineto.prototype.constructor = AbsoluteLineto;
AbsoluteLineto.superclass            = AbsolutePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function AbsoluteLineto(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("L", params, owner, previous);
    }
}


/*****
*
*   toString
*
*   override to handle case when Moveto is previous command
*
*****/
AbsoluteLineto.prototype.toString = function() {
    var points  = new Array();
    var command = "";
    
    if ( this.previous.constructor != this.constuctor )
        if ( this.previous.constructor != AbsoluteMoveto )
            command = this.command;

    return command + this.handles[0].point.toString();
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
AbsoluteLineto.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Line",
        [
            this.previous.getLastPoint(),
            this.handles[0].point
        ]
    );
};

