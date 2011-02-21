/*****
*
*   RelativeMoveto.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
RelativeMoveto.prototype             = new RelativePathSegment();
RelativeMoveto.prototype.constructor = RelativeMoveto;
RelativeMoveto.superclass            = RelativePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function RelativeMoveto(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("m", params, owner, previous);
    }
}


/*****
*
*   toString
*
*   override toString since moveto's do not have shortcuts
*
*****/
RelativeMoveto.prototype.toString = function() {
    return "m" + this.handles[0].point.toString();
};

