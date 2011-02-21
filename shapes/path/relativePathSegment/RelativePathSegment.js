/*****
*
*   RelativePathSegment.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
RelativePathSegment.prototype             = new AbsolutePathSegment();
RelativePathSegment.prototype.constructor = RelativePathSegment;
RelativePathSegment.superclass            = AbsolutePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function RelativePathSegment(command, params, owner, previous) {
    if ( arguments.length > 0 )
        this.init(command, params, owner, previous);
}


/*****
*
*   init
*
*****/
RelativePathSegment.prototype.init = function(command, params, owner, previous) {
    this.command  = command;
    this.owner    = owner;
    this.previous = previous;
    this.handles  = new Array();

    var lastPoint;
    if ( this.previous )
        lastPoint = this.previous.getLastPoint();
    else
        lastPoint = new Point2D(0,0);

    var index = 0;
    while ( index < params.length ) {
        var handle = new Handle(
            lastPoint.x + params[index],
            lastPoint.y + params[index+1],
            owner
        );

        this.handles.push( handle );
        index += 2;
    }
};


/*****
*
*   toString
*
*****/
RelativePathSegment.prototype.toString = function() {
    var points    = new Array();
    var command   = "";
    var lastPoint;

    if ( this.previous )
        lastPoint = this.previous.getLastPoint();
    else
        lastPoint = new Point2D(0,0);

    if ( this.previous == null || this.previous.constructor != this.constructor )
        command = this.command;

    for ( var i = 0; i < this.handles.length; i++ ) {
        var point = this.handles[i].point.subtract( lastPoint );

        points.push( point.toString() );
    }
    
    return command + points.join(" ");
};
