/*****
*
*   Mouser.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

var svgns = "http://www.w3.org/2000/svg";


/*****
*
*   Setup inheritance
*
*****/
Mouser.prototype             = new EventHandler();
Mouser.prototype.constructor = Mouser;
Mouser.superclass            = EventHandler.prototype;


/*****
*
*   constructor
*
*****/
function Mouser() {
    this.init();
}


/*****
*
*   init
*
*****/
Mouser.prototype.init = function() {
    // init properties
    this.svgNode     = null;
    this.handles     = new Array();
    this.shapes      = new Array();
    this.lastPoint   = null;
    this.currentNode = null;

    // build the mouse event region
    this.realize();
};


/*****
*
*   realize
*
*   Create rectangle to capture events.  This method has been separated from
*   the init() method to allow possible sub-classes to redefine the mouse
*   tracking shape
*
*****/
Mouser.prototype.realize = function() {
    // Make sure we don't create the event region twice
    if ( this.svgNode == null) {
        var rect = svgDocument.createElementNS(svgns, "rect");
        
        this.svgNode = rect;
        rect.setAttributeNS(null, "x", "-16384");
        rect.setAttributeNS(null, "y", "-16384");
        rect.setAttributeNS(null, "width", "32767");
        rect.setAttributeNS(null, "height", "32767");
        rect.setAttributeNS(null, "fill", "none");
        rect.setAttributeNS(null, "pointer-events", "all");
        rect.setAttributeNS(null, "display", "none");

        svgDocument.documentElement.appendChild(rect);
    }
};


/*****
*
*   selection management
*
*****/

/*****
*
*   register
*
*****/
Mouser.prototype.register = function(handle) {
    // See if this handler is current selection
    if ( this.handleIndex(handle) == -1 ) {
        var owner = handle.owner;

        // Show as selected
        handle.select(true);
        
        // Add it to the current selection
        this.handles.push(handle);

        if ( owner != null && this.shapeIndex(owner) == -1 )
            this.shapes.push(owner);
    }
};


/*****
*
*   unregister
*
*****/
Mouser.prototype.unregister = function(handle) {
    var index = this.handleIndex(handle);

    // Is this handler in the current selection?
    if ( index != -1 ) {
        // Deselect
        handle.select(false);
        
        // Remove from selection
        this.handles.splice(index, 1);
    }
};


/*****
*
*   registerShape
*
*****/
Mouser.prototype.registerShape = function(shape) {
    // See if this handler is current selection
    if ( this.shapeIndex(shape) == -1 ) {
        shape.select(true);

        // Add it to the current selection
        this.shapes.push(shape);
    }
};


/*****
*
*   unregisterShape
*
*****/
Mouser.prototype.unregisterShape = function(shape) {
    var index = this.shapeIndex(shape);

    if ( index != -1 ) {
        // Deselect
        shape.select(false);
        shape.selectHandles(false);
        shape.showHandles(false);
        shape.unregisterHandles();

        // Remove from list
        this.shapes.splice(index, 1);
    }
};


/*****
*
*   unregisterAll
*
*****/
Mouser.prototype.unregisterAll = function() {
    for ( var i = 0; i < this.handles.length; i++ ) {
        this.handles[i].select(false);
    }

    this.handles = new Array();
};


/*****
*
*   unregisterShapes
*
*****/
Mouser.prototype.unregisterShapes = function() {
    for ( var i = 0; i < this.shapes.length; i++ ) {
        var shape = this.shapes[i];
        
        shape.select(false);
        shape.selectHandles(false);
        shape.showHandles(false);
        shape.unregisterHandles();
    }

    this.shapes = new Array();
};


/*****
*
*   handleIndex
*
*****/
Mouser.prototype.handleIndex = function(handle) {
    var result = -1;

    for ( var i = 0; i < this.handles.length; i++ ) {
        if ( this.handles[i] === handle ) {
            result = i;
            break;
        }
    }

    return result;
};


/*****
*
*   shapeIndex
*
*****/
Mouser.prototype.shapeIndex = function(shape) {
    var result = -1;

    for ( var i = 0; i < this.shapes.length; i++ ) {
        if ( this.shapes[i] === shape ) {
            result = i;
            break;
        }
    }

    return result;
};


/*****
*
*   event handlers
*
*****/

/*****
*
*   beginDrag
*
*****/
Mouser.prototype.beginDrag = function(e) {
    this.currentNode = e.target;
    
    var svgPoint = this.getUserCoordinate( this.currentNode, e.clientX, e.clientY );
    
    this.lastPoint = new Point2D(svgPoint.x, svgPoint.y);
    this.svgNode.addEventListener("mouseup",   this, false);
    this.svgNode.addEventListener("mousemove", this, false);

    // Assure mouser is top-most element in SVG document
    svgDocument.documentElement.appendChild(this.svgNode);

    // Enable rectangle to capture events
    this.svgNode.setAttributeNS(null, "display", "inline");
};


/*****
*
*   mouseup
*
*****/
Mouser.prototype.mouseup = function(e) {
    this.lastPoint   = null;
    this.currentNode = null;

    this.svgNode.removeEventListener("mouseup",   this, false);
    this.svgNode.removeEventListener("mousemove", this, false);

    this.svgNode.setAttributeNS(null, "display", "none");
};


/*****
*
*   mousemove
*
*****/
Mouser.prototype.mousemove = function(e) {
    var svgPoint = this.getUserCoordinate( this.currentNode, e.clientX, e.clientY );
    var newPoint = new Point2D(svgPoint.x, svgPoint.y);
    var delta    = newPoint.subtract(this.lastPoint);
    var updates  = new Array();
    var updateId = new Date().getTime();

    this.lastPoint.setFromPoint(newPoint);

    for ( var i = 0; i < this.handles.length; i++ ) {
        var handle = this.handles[i];
        var owner  = handle.owner;
        
        handle.translate(delta);
        if ( owner != null ) {
            if ( owner.lastUpdate != updateId ) {
                owner.lastUpdate = updateId;
                updates.push(owner);
            }
        } else {
            updates.push(handle);
        }
    }

    // perform updates
    for ( var i = 0; i < updates.length; i++ ) {
        updates[i].update();
    }
};


/*****
*
*   getUserCoordinate
*
*****/
Mouser.prototype.getUserCoordinate = function(node, x, y) {
    var svgRoot    = svgDocument.documentElement;
    var pan        = svgRoot.currentTranslate;
    var zoom       = svgRoot.currentScale;
    var CTM        = this.getTransformToElement(node);
    var iCTM       = CTM.inverse();
    var worldPoint = svgDocument.documentElement.createSVGPoint();
    
    worldPoint.x = (x - pan.x) / zoom;
    worldPoint.y = (y - pan.y) / zoom;

    return worldPoint.matrixTransform(iCTM);
};


/*****
*
*   getTransformToElement
*
*****/
Mouser.prototype.getTransformToElement = function(node) {
    var CTM = node.getCTM();

    while ( (node = node.parentNode) != svgDocument ) {
        CTM = node.getCTM().multiply(CTM);
    }
    
    return CTM;
};
