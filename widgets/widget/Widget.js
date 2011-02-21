/*****
*
*   Widget.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   Class variables
*
*****/
Widget.VERSION = 1.1;


/*****
*
*   constructor
*
*****/
function Widget(x, y) {
    if ( arguments.length > 0 ) {
        this.init(x, y);
    }
}


/*****
*
*   init
*
*****/
Widget.prototype.init = function(x, y) {
    this.x     = x;
    this.y     = y;
    this.nodes = new Object();
};


/*****
*
*   realize
*
*****/
Widget.prototype.realize = function(svgParentNode) {
    this.nodes.parent = svgParentNode;

    this.buildSVG();
    this.addEventListeners();
};


/*****
*
*   buildSVG
*
*****/
Widget.prototype.buildSVG = function() {
    // abstract method
};


/*****
*
*   addEventListeners
*
*****/
Widget.prototype.addEventListeners = function() {
    // abstract method
};


/*****
*
*   textToSVG
*
*****/
Widget.prototype.textToSVG = function(text) {
    var self = this;
    var svg  = text.replace(
        /\$(\{[a-zA-Z][-a-zA-Z]*\}|[a-zA-Z][-a-zA-Z]*)/g,
        function(property) {
            var name = property.replace(/[\$\{\}]/g, "");

            return self[name];
        }
    ).replace(
        /\{[^\}]+\}/g,
        function(functionText) {
            return eval( functionText.substr(1, functionText.length - 2) );
        }
    );

    return parseXML(svg, svgDocument);
};


/*****
*
*   getUserCoordinate
*
*****/
Widget.prototype.getUserCoordinate = function(node, x, y) {
    var svgRoot    = svgDocument.documentElement;
    var pan        = svgRoot.getCurrentTranslate();
    var zoom       = svgRoot.getCurrentScale();
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
Widget.prototype.getTransformToElement = function(node) {
    var CTM = node.getCTM();

    while ( (node = node.parentNode) != svgDocument ) {
        if ( node.localName == "svg" ) {
            if ( node.hasAttribute("viewBox") ) {
                CTM = new ViewBox(node).getTM().inverse().multiply(CTM);
            }
        } else {
            CTM = node.getCTM().multiply(CTM);
        }
    }
    
    return CTM;
};


/*****	Event Handlers	*****/

/*****
*
*   handleEvent
*
*****/
Widget.prototype.handleEvent = function(e) {
    if ( e.type in this ) this[e.type](e);
};
