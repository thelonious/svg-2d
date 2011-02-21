/*****
*
*   AbsoluteMoveto.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
AbsoluteMoveto.prototype             = new AbsolutePathSegment();
AbsoluteMoveto.prototype.constructor = AbsoluteMoveto;
AbsoluteMoveto.superclass            = AbsolutePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function AbsoluteMoveto(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("M", params, owner, previous);
    }
}


/*****
*
*   toString
*
*   override toString since moveto's do not have shortcuts
*
*****/
AbsoluteMoveto.prototype.toString = function() {
    return "M" + this.handles[0].point.toString();
};

