/*****
*
*   Handle.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   Setup inheritance
*
*****/
Handle.prototype             = new Shape();
Handle.prototype.constructor = Handle;
Handle.superclass            = Shape.prototype;


/*****
*
*   Class properties
*
*****/
Handle.NO_CONSTRAINTS = 0;
Handle.CONSTRAIN_X    = 1;
Handle.CONSTRAIN_Y    = 2;


/*****
*
*   constructor
*
*****/
function Handle(x, y, owner) {
    if ( arguments.length > 0 ) {
        this.init(x, y, owner);
    }
}


/*****
*
*   init
*
*****/
Handle.prototype.init = function(x, y, owner) {
    // Call superclass method
    Handle.superclass.init.call(this, null);

    // Init properties
    this.point = new Point2D(x, y);
    this.owner = owner;

    this.constrain = Handle.NO_CONSTRAINTS;
    // build handle graphic
    //this.realize();
}


/*****
*
*   realize
*
*****/
Handle.prototype.realize = function() {
    if ( this.svgNode == null ) {
        var svgns = "http://www.w3.org/2000/svg";
        var handle = svgDocument.createElementNS(svgns, "rect");
        var parent;

        if ( this.owner != null && this.owner.svgNode != null ) {
            parent = this.owner.svgNode.parentNode;
        } else {
            parent = svgDocument.documentElement;
        }

        handle.setAttributeNS(null, "x", this.point.x - 2);
        handle.setAttributeNS(null, "y", this.point.y - 2);
        handle.setAttributeNS(null, "width", 4);
        handle.setAttributeNS(null, "height", 4);
        handle.setAttributeNS(null, "stroke", "black");
        handle.setAttributeNS(null, "fill", "white");
        handle.addEventListener("mousedown", this, false);

        parent.appendChild(handle);
        this.svgNode = handle;

        this.show( this.visible );
    }
};


/*****
*
*   unrealize
*
*****/
Handle.prototype.unrealize = function() {
    this.svgNode.removeEventListener("mousedown", this, false);
    this.svgNode.parentNode.removeChild(this.svgNode);
};


/*****
*
*   translate
*
*****/
Handle.prototype.translate = function(delta) {
    if ( this.constrain == Handle.CONSTRAIN_X ) {
        this.point.x += delta.x;
    } else if ( this.constrain == Handle.CONSTRAIN_Y ) {
        this.point.y += delta.y;
    } else {
        this.point.addEquals(delta);
    }
    this.refresh();
};


/*****
*
*   refresh
*
*****/
Handle.prototype.refresh = function() {
    this.svgNode.setAttributeNS(null, "x", this.point.x - 2);
    this.svgNode.setAttributeNS(null, "y", this.point.y - 2);
};


/*****
*
*   select
*
*****/
Handle.prototype.select = function(state) {
    // call superclass method
    Handle.superclass.select.call(this, state);

    if ( state ) {
        this.svgNode.setAttributeNS(null, "fill", "black");
    } else {
        this.svgNode.setAttributeNS(null, "fill", "white");
    }
};


/*****
*
*   mousedown
*
*****/
Handle.prototype.mousedown = function(e) {
    if ( !this.locked ) {
        if ( e.shiftKey ) {
            if ( this.selected ) {
                mouser.unregister(this);
            } else {
                mouser.register(this);
                mouser.beginDrag(e);
            }
        } else {
            if ( !this.selected ) {
                var owner = this.owner;
                
                mouser.unregisterAll();
                mouser.register(this);
            }
            mouser.beginDrag(e);
        }
    }
};

