/*****
*
*	Textbox.js
*
*****/
Textbox.VERSION = "1.1";
var svgns = "http://www.w3.org/2000/svg";


/*****
*
*	contructor
*
*****/
function Textbox(x, y, width, height, parent) {
    var serial = new Date().getTime() + "_" + Math.round(Math.random()*1000);

	this.width  = width;
	this.height = height;
	this.parent = parent;

	var trans  = "translate(" + x + "," + y + ")";
	var g = new Node_Builder( "g", { transform: trans } );
	var rect1 = new Node_Builder(
		"rect",
		{ x: -1, y: -1, width: width+1, height: height+1, fill: "black" }
	);
	var rect2 = new Node_Builder(
		"rect",
		{ x: 0, y: 0, width: width+1, height: height+1, fill: "white" }
	);
	var rect3 = new Node_Builder(
		"rect",
		{ width: width, height: height, fill: "grey" }
	);
	var clip_path = new Node_Builder( "clipPath", { id: serial+"_cp" } );
	var rect4 = new Node_Builder(
		"rect",
		{ width: width, height: height, fill: "grey" }
	);
	
	var textbox = new Node_Builder(
		"text",
		{ y: "1em", fill: "white", 'clip-path': "url(#"+serial+"_cp)" }
	);

	g.appendTo(parent);
	clip_path.appendTo(g.node);
	rect4.appendTo(clip_path.node);
	rect1.appendTo(g.node);
	rect2.appendTo(g.node);
	rect3.appendTo(g.node);
	textbox.appendTo(g.node);

	this.textbox = textbox.node;
    g.node.addEventListener("keypress", this, false);
};


/*****
*
*   handleEvent
*
*****/
Textbox.prototype.handleEvent = function(e) {
    var type = e.type;

    if ( this[type] != null ) this[type](e);
};


/*****
*
*	keypress
*
*	Process a keypress event
*
*****/
Textbox.prototype.keypress = function(e) {
	var key = e.charCode;

	if ( key >= 32 && key <= 127 ) {
		this.add_char( String.fromCharCode(key) );
	} else if ( key == 8 ) {
		this.delete_char();
	} else if ( key == 13 ) {
		this.add_tspan("");
	} else {
		//alert(key);
	}
};

/*****
*
*	add_char
*
*	Add a character to end of the current line
*	If the current line exceeds the width of the
*	textbox, then create a new line
*
*****/
Textbox.prototype.add_char = function(new_char) {
	var textbox = this.textbox;

    if ( !textbox.hasChildNodes() ) { this.add_tspan("", 0) }
	var tspan = textbox.lastChild;
    var data  = tspan.firstChild;
    data.appendData(new_char);

    if ( tspan.getComputedTextLength() > this.width ) {
        this.delete_char();
        this.add_tspan(new_char);
    }
};

/*****
*
*	delete_char
*
*	Delete the last character of the last line
*	If a line is empty as a result, then remove
*	that line from the <text> element
*
*****/
Textbox.prototype.delete_char = function() {
	var textbox = this.textbox;

	if ( textbox.hasChildNodes() ) {
	    var tspan  = textbox.getLastChild();
	    var data   = tspan.getFirstChild();
	    var length = data.getLength();

	    if ( length > 1 ) {
	        data.deleteData(length-1, 1);
	    } else {
	        textbox.removeChild(tspan);
	    }
	}
};

/*****
*
*	add_tspan
*
*	Used to add a new line to the textbox
*	Offset is an optional parameter which designates
*	the vertical offset of the new <tspan> element.
*	This was needed to handle the first <tspan> added
*	to the <text> element
*
*****/
Textbox.prototype.add_tspan = function(new_char, offset) {
	var SVGDoc = this.parent.ownerDocument;
	var tspan  = SVGDoc.createElementNS(svgns, "tspan");
	var data   = SVGDoc.createTextNode(new_char);

	if ( offset == null ) { offset = "1em" }
	tspan.setAttributeNS(null, "x", 0);
	tspan.setAttributeNS(null, "dy", offset);
	tspan.appendChild(data);
	this.textbox.appendChild(tspan);
};

