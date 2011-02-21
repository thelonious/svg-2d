/*****
*
*   AntiZoomAndPan.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

AntiZoomAndPan.VERSION = "1.2"

/*****
*
*   constructor
*
*****/
function AntiZoomAndPan() {
    this.init();
}


/*****
*
*   init
*
*****/
AntiZoomAndPan.prototype.init = function() {
    var svgRoot = svgDocument.documentElement;

    // Initialize properties;
    this.svgNodes = new Array();
    this.x_trans  = 0;
    this.y_trans  = 0;
    this.scale    = 1;
    this.lastTM   = svgRoot.createSVGMatrix();

    // Setup event listeners to capture zoom and scroll events
    svgRoot.addEventListener('SVGZoom',   this, false);
    svgRoot.addEventListener('SVGScroll', this, false);
    svgRoot.addEventListener('SVGResize', this, false);
};


/*****
*
*   appendNode
*
*****/
AntiZoomAndPan.prototype.appendNode = function(svgNode) {
    // Add node to a array
    this.svgNodes.push(svgNode);
};


/*****
*
*   removeNode
*
*****/
AntiZoomAndPan.prototype.removeNode = function(svgNode) {
    // Remove node if found
    for ( var i = 0; i < this.svgNodes.length; i++ ) {
        if ( this.svgNodes[i] === svgNode ) {
            this.svgNodes.splice(i, 1);
            break;
        }
    }
};


/*****
*
*   Event Handlers
*
*****/

/*****
*
*   handleEvent
*
*****/
AntiZoomAndPan.prototype.handleEvent = function(e) {
    var type = e.type;

    if ( this[type] == null )
        throw new Error("Unsupported event type: " + type);

    this[type](e);
};


/*****
*
*   SVGZoom
*
*****/
AntiZoomAndPan.prototype.SVGZoom = function(e) {
    // Update current transform
    this.update();
};


/*****
*
*   SVGScroll
*
*****/
AntiZoomAndPan.prototype.SVGScroll = function(e) {
    // Update current transform
    this.update();
};


/*****
*
*   SVGResize
*
*****/
AntiZoomAndPan.prototype.SVGResize = function(e) {
    // Update current transform
    this.update();
};


/*****
*
*   update
*
*****/
AntiZoomAndPan.prototype.update = function() {
    if ( this.svgNodes.length > 0 ) {
        var svgRoot = svgDocument.documentElement;
        var viewbox = ( window.ViewBox != null )
            ? new ViewBox(svgRoot)
            : null;
        var matrix  = ( viewbox != null )
            ? viewbox.getTM()
            : svgRoot.createSVGMatrix();
        var trans   = svgRoot.currentTranslate;

        // Set the scale factor to leave object at original size
        matrix = matrix.scale( 1.0 / svgRoot.currentScale);

        // Get the current pan settings
        matrix = matrix.translate(-trans.x, -trans.y);

        // Apply combined transforms to all managed nodes
        for ( var i = 0; i < this.svgNodes.length; i++ ) {
            var node = this.svgNodes[i];
            var CTM  = matrix.multiply( this.lastTM.multiply(node.getCTM()) );

            var transform = "matrix(" +
                [ CTM.a, CTM.b, CTM.c,
                  CTM.d, CTM.e, CTM.f  ].join(",") + ")";

            this.svgNodes[i].setAttributeNS(null, "transform", transform);
        }

        this.lastTM = matrix.inverse();
    }
};

