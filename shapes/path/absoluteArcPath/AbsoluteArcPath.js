/*****
*
*   AbsoluteArcPath.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
AbsoluteArcPath.prototype             = new AbsolutePathSegment();
AbsoluteArcPath.prototype.constructor = AbsoluteArcPath;
AbsoluteArcPath.superclass            = AbsolutePathSegment.prototype;


/*****
*
*   constructor
*
*****/
function AbsoluteArcPath(params, owner, previous) {
    if ( arguments.length > 0 ) {
        this.init("A", params, owner, previous);
    }
}


/*****
*
*   init
*
*****/
AbsoluteArcPath.prototype.init = function(command, params, owner, previous) {
    var point = new Array();
    var y = params.pop();
    var x = params.pop();

    point.push( x, y );
    AbsoluteArcPath.superclass.init.call(this, command, point, owner, previous);

    this.rx        = parseFloat( params.shift() );
    this.ry        = parseFloat( params.shift() );
    this.angle     = parseFloat( params.shift() );
    this.arcFlag   = parseFloat( params.shift() );
    this.sweepFlag = parseFloat( params.shift() );
};


/*****
*
*   toString
*
*   override to handle case when Moveto is previous command
*
*****/
AbsoluteArcPath.prototype.toString = function() {
    var points  = new Array();
    var command = "";
    
    if ( this.previous.constructor != this.constuctor )
        command = this.command;

    return command +
        [
            this.rx, this.ry,
            this.angle, this.arcFlag, this.sweepFlag,
            this.handles[0].point.toString()
        ].join(",");
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
AbsoluteArcPath.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Ellipse",
        [
            this.getCenter(),
            this.rx, this.ry
        ]
    );
};


/*****
*
*   getCenter
*
*****/
AbsoluteArcPath.prototype.getCenter = function() {
    var startPoint = this.previous.getLastPoint();
    var endPoint   = this.handles[0].point;
    var rx         = this.rx;
    var ry         = this.ry;
    var angle      = this.angle * Math.PI / 180;
    var c          = Math.cos(angle);
    var s          = Math.sin(angle);
    var TOLERANCE  = 1e-6;

    var halfDiff = startPoint.subtract(endPoint).divide(2);
    var x1p = halfDiff.x *  c + halfDiff.y * s;
    var y1p = halfDiff.x * -s + halfDiff.y * c;

    var x1px1p = x1p*x1p;
    var y1py1p = y1p*y1p;
    var lambda = ( x1px1p / (rx*rx) ) + ( y1py1p / (ry*ry) );
    if ( lambda > 1 ) {
        var factor = Math.sqrt(lambda);

        rx *= factor;
        ry *= factor;
    }
    
    var rxrx = rx*rx;
    var ryry = ry*ry;
    var rxy1 = rxrx * y1py1p;
    var ryx1 = ryry * x1px1p;
    var factor = (rxrx*ryry - rxy1 - ryx1) / (rxy1 + ryx1);

    if ( Math.abs(factor) < TOLERANCE ) factor = 0;
    
    var sq = Math.sqrt(factor);

    if ( this.arcFlag == this.sweepFlag ) sq = -sq;
    var mid = startPoint.add(endPoint).divide(2);
    var cxp = sq *  rx*y1p / ry;
    var cyp = sq * -ry*x1p / rx;

    return new Point2D(
        cxp*c - cyp*s + mid.x,
        cxp*s + cyp*c + mid.y
    );
};
