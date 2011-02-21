/*****
*
*   Circle.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   Setup inheritance
*
*****/
Circle.prototype             = new Shape();
Circle.prototype.constructor = Circle;
Circle.superclass            = Shape.prototype;


/*****
*
*   constructor
*
*****/
function Circle(svgNode) {
    if ( arguments.length > 0 ) {
        this.init(svgNode);
    }
}


/*****
*
*   init
*
******/
Circle.prototype.init = function(svgNode) {
    if ( svgNode.localName == "circle" ) {
        // Call superclass method
        Circle.superclass.init.call(this, svgNode);

        // Init properties
        var cx = parseFloat( svgNode.getAttributeNS(null, "cx") );
        var cy = parseFloat( svgNode.getAttributeNS(null, "cy") );
        var r  = parseFloat( svgNode.getAttributeNS(null, "r")  );

        this.center = new Handle(cx, cy, this);
        this.last   = new Point2D(cx, cy);
        this.radius = new Handle(cx+r, cy, this);
    } else {
        throw new Error("Circle.init: Invalid SVG Node: " + svgNode.localName);
    }
};


/*****
*
*   realize
*
*****/
Circle.prototype.realize = function() {
    if ( this.svgNode != null ) {
        this.center.realize();
        this.radius.realize();

        this.center.show(false);
        this.radius.show(false);

        this.svgNode.addEventListener("mousedown", this, false);
    }
};


/*****
*
*   translate
*
*****/
Circle.prototype.translate = function(delta) {
    this.center.translate(delta);
    this.radius.translate(delta);
    this.refresh();
};


/*****
*
*   refresh
*
*****/
Circle.prototype.refresh = function() {
    var r = this.radius.point.distanceFrom(this.center.point);

    this.svgNode.setAttributeNS(null, "cx", this.center.point.x);
    this.svgNode.setAttributeNS(null, "cy", this.center.point.y);
    this.svgNode.setAttributeNS(null, "r", r);
};


/*****
*
*   registerHandles
*
*****/
Circle.prototype.registerHandles = function() {
    mouser.register(this.center);
    mouser.register(this.radius);
};


/*****
*
*   unregisterHandles
*
*****/
Circle.prototype.unregisterHandles = function() {
    mouser.unregister(this.center);
    mouser.unregister(this.radius);
};


/*****
*
*   selectHandles
*
*****/
Circle.prototype.selectHandles = function(select) {
    this.center.select(select);
    this.radius.select(select);
};


/*****
*
*   showHandles
*
*****/
Circle.prototype.showHandles = function(state) {
    this.center.show(state);
    this.radius.show(state);
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
Circle.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Circle",
        [
            this.center.point,
            parseFloat( this.svgNode.getAttributeNS(null, "r") )
        ]
    );
};
