/*****
*
*   LeverHandle.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   Setup inheritance
*
*****/
LeverHandle.prototype             = new Handle();
LeverHandle.prototype.constructor = LeverHandle;
LeverHandle.superclass            = Handle.prototype;


/*****
*
*   constructor
*
*****/
function LeverHandle(x, y, owner) {
    if ( arguments.length > 0 ) {
        this.init(x, y, owner);
    }
}


/*****
*
*   realize
*
*****/
LeverHandle.prototype.realize = function() {
    if ( this.svgNode == null ) {
        var svgns = "http://www.w3.org/2000/svg";
        var handle = svgDocument.createElementNS(svgns, "circle");
        var parent;

        if ( this.owner != null && this.owner.svgNode != null ) {
            parent = this.owner.svgNode.parentNode;
        } else {
            parent = svgDocument.documentElement;
        }

        handle.setAttributeNS(null, "cx", this.point.x);
        handle.setAttributeNS(null, "cy", this.point.y);
        handle.setAttributeNS(null, "r", 2.5);
        handle.setAttributeNS(null, "fill", "black");
        handle.addEventListener("mousedown", this, false);

        parent.appendChild(handle);
        this.svgNode = handle;

        this.show( this.visible );
    }
};


/*****
*
*   refresh
*
*****/
LeverHandle.prototype.refresh = function() {
    this.svgNode.setAttributeNS(null, "cx", this.point.x);
    this.svgNode.setAttributeNS(null, "cy", this.point.y);
};


/*****
*
*   select
*
*****/
LeverHandle.prototype.select = function(state) {
    // call superclass method
    LeverHandle.superclass.select.call(this, state);

    this.svgNode.setAttributeNS(null, "fill", "black");
};

