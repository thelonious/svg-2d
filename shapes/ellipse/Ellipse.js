/*****
*
*   Ellipse.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   Setup inheritance
*
*****/
Ellipse.prototype             = new Shape();
Ellipse.prototype.constructor = Ellipse;
Ellipse.superclass            = Shape.prototype;


/*****
*
*   constructor
*
*****/
function Ellipse(svgNode) {
    if ( arguments.length > 0 ) {
        this.init(svgNode);
    }
}


/*****
*
*   init
*
*****/
Ellipse.prototype.init = function(svgNode) {
    if ( svgNode == null || svgNode.localName != "ellipse" )
        throw new Error("Ellipse.init: Invalid localName: " + svgNode.localName);
    
    // Call superclass method
    Ellipse.superclass.init.call(this, svgNode);

    // Init properties
    var cx = parseFloat( svgNode.getAttributeNS(null, "cx") );
    var cy = parseFloat( svgNode.getAttributeNS(null, "cy") );
    var rx = parseFloat( svgNode.getAttributeNS(null, "rx") );
    var ry = parseFloat( svgNode.getAttributeNS(null, "ry") );

    // Create handles
    this.center  = new Handle(cx, cy, this);
    this.radiusX = new Handle(cx+rx, cy, this);
    this.radiusY = new Handle(cx, cy+ry, this);
};


/*****
*
*   realize
*
*****/
Ellipse.prototype.realize = function() {
    this.center.realize();
    this.radiusX.realize();
    this.radiusY.realize();

    //this.radiusX.constrain = Handle.CONSTRAIN_X;
    //this.radiusY.constrain = Handle.CONSTRAIN_Y;

    this.center.show(false);
    this.radiusX.show(false);
    this.radiusY.show(false);

    this.svgNode.addEventListener("mousedown", this, false);
};


/*****
*
*   refresh
*
*****/
Ellipse.prototype.refresh = function() {
    var rx = Math.abs(this.center.point.x - this.radiusX.point.x);
    var ry = Math.abs(this.center.point.y - this.radiusY.point.y);

    this.svgNode.setAttributeNS(null, "cx", this.center.point.x);
    this.svgNode.setAttributeNS(null, "cy", this.center.point.y);
    this.svgNode.setAttributeNS(null, "rx", rx);
    this.svgNode.setAttributeNS(null, "ry", ry);
};


/*****
*
*   registerHandles
*
*****/
Ellipse.prototype.registerHandles = function() {
    mouser.register(this.center);
    mouser.register(this.radiusX);
    mouser.register(this.radiusY);
};


/*****
*
*   unregisterHandles
*
*****/
Ellipse.prototype.unregisterHandles = function() {
    mouser.unregister(this.center);
    mouser.unregister(this.radiusX);
    mouser.unregister(this.radiusY);
};


/*****
*
*   selectHandles
*
*****/
Ellipse.prototype.selectHandles = function(select) {
    this.center.select(select);
    this.radiusX.select(select);
    this.radiusY.select(select);
};


/*****
*
*   showHandles
*
*****/
Ellipse.prototype.showHandles = function(state) {
    this.center.show(state);
    this.radiusX.show(state);
    this.radiusY.show(state);
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
Ellipse.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Ellipse",
        [
            this.center.point,
            parseFloat( this.svgNode.getAttributeNS(null, "rx") ),
            parseFloat( this.svgNode.getAttributeNS(null, "ry") )
        ]
    );
};
