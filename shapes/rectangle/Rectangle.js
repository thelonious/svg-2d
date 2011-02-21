/*****
*
*   Rectangle.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   Setup inheritance
*
*****/
Rectangle.prototype             = new Shape();
Rectangle.prototype.constructor = Rectangle;
Rectangle.superclass            = Shape.prototype;


/*****
*
*   constructor
*
*****/
function Rectangle(svgNode) {
    if ( arguments.length > 0 ) {
        this.init(svgNode);
    }
}


/*****
*
*   init
*
******/
Rectangle.prototype.init = function(svgNode) {
    if ( svgNode.localName == "rect" ) {
        // Call superclass method
        Rectangle.superclass.init.call(this, svgNode);

        // Init properties
        var x      = parseFloat( svgNode.getAttributeNS(null, "x") );
        var y      = parseFloat( svgNode.getAttributeNS(null, "y") );
        var width  = parseFloat( svgNode.getAttributeNS(null, "width")  );
        var height = parseFloat( svgNode.getAttributeNS(null, "height") );

        this.p1     = new Handle(x, y, this);               // top-left
        this.p2     = new Handle(x+width, y+height, this);  // bottom-right
    } else {
        throw new Error("Rectangle.init: Invalid SVG Node: " + svgNode.localName);
    }
};


/*****
*
*   realize
*
*****/
Rectangle.prototype.realize = function() {
    if ( this.svgNode != null ) {
        this.p1.realize();
        this.p2.realize();

        this.p1.show(false);
        this.p2.show(false);

        this.svgNode.addEventListener("mousedown", this, false);
    }
};


/*****
*
*   refresh
*
*****/
Rectangle.prototype.refresh = function() {
    var min = this.p1.point.min( this.p2.point );
    var max = this.p1.point.max( this.p2.point );

    this.svgNode.setAttributeNS(null, "x", min.x);
    this.svgNode.setAttributeNS(null, "y", min.y);
    this.svgNode.setAttributeNS(null, "width",  max.x - min.x);
    this.svgNode.setAttributeNS(null, "height", max.y - min.y);
};



/*****
*
*   registerHandles
*
*****/
Rectangle.prototype.registerHandles = function() {
    mouser.register(this.p1);
    mouser.register(this.p2);
};


/*****
*
*   unregisterHandles
*
*****/
Rectangle.prototype.unregisterHandles = function() {
    mouser.unregister(this.p1);
    mouser.unregister(this.p2);
};


/*****
*
*   selectHandles
*
*****/
Rectangle.prototype.selectHandles = function(select) {
    this.p1.select(select);
    this.p2.select(select);
};


/*****
*
*   showHandles
*
*****/
Rectangle.prototype.showHandles = function(state) {
    this.p1.show(state);
    this.p2.show(state);
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
Rectangle.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Rectangle",
        [ this.p1.point, this.p2.point ]
    );
};
