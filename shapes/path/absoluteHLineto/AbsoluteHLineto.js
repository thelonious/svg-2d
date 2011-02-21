/*****
*
*   AbsoluteHLineto.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
AbsoluteHLineto.prototype             = new AbsolutePathSegment();
AbsoluteHLineto.prototype.constructor = AbsoluteHLineto;
AbsoluteHLineto.superclass            = AbsolutePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function AbsoluteHLineto(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("H", params, owner, previous);
    }
}


/*****
*
*   init
*
*****/
AbsoluteHLineto.prototype.init = function(command, params, owner, previous) {
    var prevPoint = previous.getLastPoint();
    var point = new Array();

    point.push( params.pop(), prevPoint.y );
    AbsoluteHLineto.superclass.init.call(this, command, point, owner, previous);
};


/*****
*
*   toString
*
*****/
AbsoluteHLineto.prototype.toString = function() {
    var points  = new Array();
    var command = "";
    
    if ( this.previous.constructor != this.constuctor )
        command = this.command;

    return command + this.handles[0].point.x;
};

