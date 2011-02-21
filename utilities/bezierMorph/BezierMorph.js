/*****
*
*	BezierMorph.js
*	Copyright 2000, Kevin Lindsey
*
*****/

function BezierMorph(template, paths) {
	var pre = template.split("#");
	
	if ( template.match(/#$/) ) pre.length--;
	this.prefix   = pre;
	this.paths    = paths;
	
	this.shape    = null;
	this.min      = 0;
	this.max      = 1;
	this.delta    = 0.1;
	this.position = 0;
}


/*****
*
*	create
*
*****/
BezierMorph.prototype.create = function(parent) {
	this.parent = parent;
	this.shape = new Node_Builder(
		"path",
		{ d: this.toString() , stroke: "green", fill: "none" }
	);
	this.shape.appendTo(parent);
}


/*****
*
*	advance
*
*****/
BezierMorph.prototype.advance = function() {
	this.position += this.delta;
	if (this.position > this.max) {
		this.position = this.max;
		this.delta *= -1;
	} else if (this.position < this.min) {
		this.position = this.min;
		this.delta *= -1;
	}
	this.shape.node.setAttributeNS(null, "d", this.toString());
}


/*****
*
*	show_paths
*
*****/
BezierMorph.prototype.show_paths = function() {
	var paths = this.paths;
	
	for (var i = 0; i < paths.length; i++) {
		paths[i].show(this.parent);
	}
}


/*****
*
*	hide_paths
*
*****/
BezierMorph.prototype.hide_paths = function() {
	var paths = this.paths;
	
	for (var i = 0; i < paths.length; i++) {
		paths[i].hide();
	}
}


/*****
*
*	toString
*
*****/
BezierMorph.prototype.toString = function() {
	var text = "";
	
	for (var i = 0; i < this.paths.length; i++) {
		var path = this.paths[i];
		
		path.position_at(this.position);
		text += this.prefix[i] + path.toString();
	}
	if (this.prefix.length > this.paths.length) {
		text += this.prefix[this.prefix.length-1];
	}
	
	return text;
};
