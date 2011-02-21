/*****
*
*   Lever.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   setup inheritance
*
*****/
Lever.prototype             = new Shape();
Lever.prototype.constructor = Lever;
Lever.superclass            = Shape.prototype;


/*****
*
*   constructor
*
*****/
function Lever(x1, y1, x2, y2, owner) {
    if ( arguments.length > 0 ) {
        this.init(x1, y1, x2, y2, owner);
    }
}


/*****
*
*   init
*
*****/
Lever.prototype.init = function(x1, y1, x2, y2, owner) {
    // call superclass method
    Lever.superclass.init.call(this, null);

    // init properties
    this.point = new Handle(x1, y1, this);
    this.lever = new LeverHandle(x2, y2, this);
    this.owner = owner;
};


/*****
*
*   realize
*
*****/
Lever.prototype.realize = function() {
    if ( this.svgNode == null ) {
        var svgns = "http://www.w3.org/2000/svg";
        var line = svgDocument.createElementNS(svgns, "line");
        var parent;

        if ( this.owner != null && this.owner.svgNode != null ) {
            parent = this.owner.svgNode.parentNode;
        } else {
            parent = svgDocument.documentElement;
        }

        line.setAttributeNS(null, "x1", this.point.point.x);
        line.setAttributeNS(null, "y1", this.point.point.y);
        line.setAttributeNS(null, "x2", this.lever.point.x);
        line.setAttributeNS(null, "y2", this.lever.point.y);
        line.setAttributeNS(null, "stroke", "black");

        parent.appendChild(line);
        this.svgNode = line;
        
        this.point.realize();
        this.lever.realize();

        this.show( this.visible );
    }
};


/*****
*
*   refresh
*
*****/
Lever.prototype.refresh = function() {
    this.svgNode.setAttributeNS(null, "x1", this.point.point.x);
    this.svgNode.setAttributeNS(null, "y1", this.point.point.y);
    this.svgNode.setAttributeNS(null, "x2", this.lever.point.x);
    this.svgNode.setAttributeNS(null, "y2", this.lever.point.y);
};

