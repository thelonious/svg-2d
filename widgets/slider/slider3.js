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

    var result = parseXML(svg, svgDocument);

    if (result.nodeType == 9) {
        return result.firstChild;
    } else {
        return result;
    }
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
/*****
*
*   ViewBox.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

ViewBox.VERSION = "1.0";


/*****
*
*   constructor
*
*****/
function ViewBox(svgNode) {
    if ( arguments.length > 0 ) {
        this.init(svgNode);
    }
}


/*****
*
*   init
*
*****/
ViewBox.prototype.init = function(svgNode) {
    var viewBox = svgNode.getAttributeNS(null, "viewBox");
    var preserveAspectRatio = svgNode.getAttributeNS(null, "preserveAspectRatio");
    
    if ( viewBox != "" ) {
        var params = viewBox.split(/\s*,\s*|\s+/);

        this.x      = parseFloat( params[0] );
        this.y      = parseFloat( params[1] );
        this.width  = parseFloat( params[2] );
        this.height = parseFloat( params[3] );
    } else {
        // NOTE: Need to put an SVGResize event handler on the svgNode to keep
        // these values in sync with the window size or should add additional
        // logic (probably a flag) to getTM() so it will know to use the window
        // dimensions instead of this object's width and height properties
        this.x      = 0;
        this.y      = 0;
        this.width  = innerWidth;
        this.height = innerHeight;
    }
    
    this.setPAR(preserveAspectRatio);
};


/*****
*
*   getTM
*
*****/
ViewBox.prototype.getTM = function() {
    var svgRoot      = svgDocument.documentElement;
    var matrix       = svgDocument.documentElement.createSVGMatrix();
    var windowWidth  = svgRoot.getAttributeNS(null, "width");
    var windowHeight = svgRoot.getAttributeNS(null, "height");

    windowWidth  = ( windowWidth  != "" ) ? parseFloat(windowWidth)  : innerWidth;
    windowHeight = ( windowHeight != "" ) ? parseFloat(windowHeight) : innerHeight;

    var x_ratio = this.width  / windowWidth;
    var y_ratio = this.height / windowHeight;

    matrix = matrix.translate(this.x, this.y);
    if ( this.alignX == "none" ) {
        matrix = matrix.scaleNonUniform( x_ratio, y_ratio );
    } else {
        if ( x_ratio < y_ratio && this.meetOrSlice == "meet" ||
             x_ratio > y_ratio && this.meetOrSlice == "slice"   )
        {
            var x_trans = 0;
            var x_diff  = windowWidth*y_ratio - this.width;

            if ( this.alignX == "Mid" )
                x_trans = -x_diff/2;
            else if ( this.alignX == "Max" )
                x_trans = -x_diff;
            
            matrix = matrix.translate(x_trans, 0);
            matrix = matrix.scale( y_ratio );
        }
        else if ( x_ratio > y_ratio && this.meetOrSlice == "meet" ||
                  x_ratio < y_ratio && this.meetOrSlice == "slice"   )
        {
            var y_trans = 0;
            var y_diff  = windowHeight*x_ratio - this.height;

            if ( this.alignY == "Mid" )
                y_trans = -y_diff/2;
            else if ( this.alignY == "Max" )
                y_trans = -y_diff;
            
            matrix = matrix.translate(0, y_trans);
            matrix = matrix.scale( x_ratio );
        }
        else
        {
            // x_ratio == y_ratio so, there is no need to translate
            // We can scale by either value
            matrix = matrix.scale( x_ratio );
        }
    }

    return matrix;
}


/*****
*
*   get/set methods
*
*****/

/*****
*
*   setPAR
*
*****/
ViewBox.prototype.setPAR = function(PAR) {
    // NOTE: This function needs to use default values when encountering
    // unrecognized values
    if ( PAR ) {
        var params = PAR.split(/\s+/);
        var align  = params[0];

        if ( align == "none" ) {
            this.alignX = "none";
            this.alignY = "none";
        } else {
            this.alignX = align.substring(1,4);
            this.alignY = align.substring(5,9);
        }

        if ( params.length == 2 ) {
            this.meetOrSlice = params[1];
        } else {
            this.meetOrSlice = "meet";
        }
    } else {
        this.align  = "xMidYMid";
        this.alignX = "Mid";
        this.alignY = "Mid";
        this.meetOrSlice = "meet";
    }
};

/*****
*
*	Slider.js
*	Copyright 2000-2002, Kevin Lindsey
*       KevLinDev - kevin@kevlindev.com
*
*	Original code based on Dr. Stefan Goessner's slider:
*       http://www.mecxpert.de/svg/slider.html
*
*****/

var svgns = "http://www.w3.org/2000/svg";


/*****
*
*   setup inheritance
*
*****/
Slider.prototype             = new Widget() ;
Slider.prototype.constructor = Slider;
Slider.superclass            = Widget.prototype;


/*****
*
*   Class variables
*
*****/
Slider.VERSION = 3.1;
Slider.prototype.bodyText =
'<g fill="none">' +
'    <rect x="-9" y="-9" width="{$size+18}" height="18" fill="rgb(128,128,128)"/>' +
'    <rect x="-8" y="-8" width="{$size+16}" height="16" fill="rgb(230,230,230)"/>' +
'    <polyline points="-7.5,7, -7.5,-7.5 {$size+8},-7.5" stroke="rgb(100,100,100)"/>' +
'    <polyline points="-8,7.5 {$size+7.5},7.5, {$size+7.5},-8" stroke="white"/>' +
'</g>';
Slider.prototype.thumbText =
'<g fill="none">' +
'    <rect x="-6" y="-6" width="12" height="12" fill="rgb(192,192,192)"/>' +
'    <polyline points="-6,5.5 5.5,5.5 5.5,-6"   stroke="black"/>' +
'    <polyline points="-5,4.5 4.5,4.5 4.5,-5"   stroke="rgb(128,128,128)"/>' +
'    <polyline points="-5.5,5 -5.5,-5.5 5,-5.5" stroke="white"/>' +
'</g>';


/*****
*
*	Slider Constructor
*
*****/
function Slider(x, y, size, direction, callback, bodyText, thumbText) {
    if ( arguments.length > 0 ) {
        this.init(x, y, size, direction, callback, bodyText, thumbText);
    }
}


/*****
*
*   init
*
*****/
Slider.prototype.init = function(x, y, size, direction, callback, bodyText, thumbText) {
    // call superclass method
    Slider.superclass.init.call(this, x, y);

    // init properties
	this.size      = size;
	this.direction = direction;
    this.callback  = callback;
	this.min       = 0;
	this.max       = size;
	this.value     = 0;
	this.active    = false;

    if ( bodyText  != null ) this.bodyText  = bodyText;
    if ( thumbText != null ) this.thumbText = thumbText;
};


/*****
*
*	buildSVG
*
*****/
Slider.prototype.buildSVG = function() {
	var translate = "translate(" + this.x + "," + this.y + ")";
	var rotate    = "rotate(" + this.direction + ")";
    var transform = translate + " " + rotate;
    var slider    = svgDocument.createElementNS(svgns, "g");

    slider.appendChild( this.textToSVG(this.bodyText) );
    slider.appendChild( this.textToSVG(this.thumbText) );
    slider.setAttributeNS(null, "transform", transform);

	this.nodes.thumb = slider.lastChild;
    this.nodes.root  = slider;
    this.nodes.parent.appendChild(slider);
};


/*****
*
*   addEventListeners
*
*****/
Slider.prototype.addEventListeners = function() {
	this.nodes.root.addEventListener("mousedown", this, false);
	this.nodes.root.addEventListener("mouseup",   this, false);
	this.nodes.root.addEventListener("mousemove", this, false);
};


/*****
*
*   removeEventListeners
*
*****/
Slider.prototype.removeEventListeners = function() {
	this.nodes.root.removeEventListener("mousedown", this, false);
	this.nodes.root.removeEventListener("mouseup",   this, false);
	this.nodes.root.removeEventListener("mousemove", this, false);
};


/*****	set methods	*****/

/*****
*
*	setMin
*
*****/
Slider.prototype.setMin = function(min) {
	this.min = min;
	if (this.min < this.max) {
		if (this.value < min) this.value = min;
	} else {
		if (this.value < max) this.value = max;
	}
	this.setValue(this.value, true);
};


/*****
*
*	setMax
*
*****/
Slider.prototype.setMax = function(max) {
	this.max = max;
	if (this.min < this.max) {
		if (this.value > max) this.value = max;
	} else {
		if (this.value > min) this.value = min;
	}
	this.setValue(this.value, true);
};


/*****
*
*	setMinmax
*
*****/
Slider.prototype.setMinmax = function(min, max) {
	this.min = min;
	this.max = max;
	if (this.min < this.max) {
		if (this.value < min) this.value = min;
		if (this.value > max) this.value = max;
	} else {
		if (this.value < max) this.value = max;
		if (this.value > min) this.value = min;
	}
	this.setValue(this.value, true);
};


/*****
*
*	setValue
*
*****/
Slider.prototype.setValue = function(value, call_callback) {
	var range    = this.max - this.min;
	var position = ( value - this.min ) / range * this.size;

	this.value = value;
	this.nodes.thumb.setAttributeNS(null, "transform", "translate(" + position + ", 0)");

	if (call_callback && this.callback) this.callback(value);
};


/*****
*
*	setPosition
*
*****/
Slider.prototype.setPosition = function(position, call_callback) {
	var range = this.max - this.min;
	var value = this.min + position / this.size * range;

	this.nodes.thumb.setAttributeNS(null, "transform", "translate(" + position + ", 0)");
	this.value = value;
	if (call_callback && this.callback) this.callback(value);
};


/*****
*
*	findPosition
*
*****/
Slider.prototype.findPosition = function(e) {
    var localPoint = this.getUserCoordinate(this.nodes.root, e.clientX, e.clientY);
    var position   = localPoint.x;
    
	if (position < 0) {
		this.setPosition(0, true);
	} else if (position > this.size) {
		this.setPosition(this.size, true);
	} else {
		this.setPosition(position, true);
	}
};


/*****	Event Handlers	*****/

/*****
*
*	mousedown
*
*****/
Slider.prototype.mousedown = function(e) {
	this.active = true;
	this.findPosition(e);
};


/*****
*
*	mouseup
*
*****/
Slider.prototype.mouseup = function(e) {
	this.active = false;
};


/*****
*
*	mousemove
*
*****/
Slider.prototype.mousemove = function(e) {
	if (this.active) this.findPosition(e);
};
