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
