/*****
*
*   Button.js
*
*   Copyright 2001, Kevin Lindsey
*
*****/

/*****
*
*   globals
*
*****/
Button.VERSION = 1.0;
Button.buttons = new Array();


/*****
*
*   constructor
*
*****/
function Button(x, y, callback, up_id, down_id, parent) {
    this.x        = x;
    this.y        = y;
    this.callback = callback;
    this.parent   = parent;
    this.selected = false;
    this.up       = null;
    this.down     = null;
    
    this.make_button(up_id, down_id);
    Button.buttons[Button.buttons.length] = this;
}


/*****
*
*   make_button
*
*****/
Button.prototype.make_button = function(up_id, down_id) {
    var trans  = "translate(" + this.x + "," + this.y + ")";
    var button;
    
    button = svgDocument.getElementById(up_id).cloneNode(true);
    button.setAttributeNS(null, "transform", trans);
    button.addEventListener("mousedown", this, false);
    this.up = button;
    
    button = svgDocument.getElementById(down_id).cloneNode(true);
    button.setAttributeNS(null, "transform", trans);
    button.setAttributeNS(null, "display", "none");
    button.addEventListener("mousedown", this, false);
    this.down = button;

    this.parent.appendChild( this.up );
    this.parent.appendChild( this.down );
}


/*****
*
*   set_select
*
*****/
Button.prototype.set_select = function(state) {
    var current = this.selected;

    if ( current != state ) {
        if ( state == true ) {
            this.up.setAttributeNS(null, "display", "none");
            this.down.setAttributeNS(null, "display", "inline");
        } else {
            this.up.setAttributeNS(null, "display", "inline");
            this.down.setAttributeNS(null, "display", "none");
        }
        this.selected = state;
    }
}


/*****
*
*   handleEvent
*
*****/
Button.prototype.handleEvent = function(e) {
    var type = e.type;

    if ( this[type] != null ) this[type](e);
};


/*****
*
*   mousedown
*
*****/
Button.prototype.mousedown = function(e) {
    if ( this.callback ) this.callback(this);
};

