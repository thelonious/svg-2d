/*****
*
*   Button2.js
*
*   copyright 2001, Kevin Lindsey
*
*****/

GUI = {
    NAMESPACE: "http://www.kevlindev.com/gui",
    FORMS:     []
};
var svgns = "http://www.w3.org/2000/svg";


/*****
*
*   Make buttons
*
*****/
function loadGUI(e) {
    if ( window.svgDocument == null )
        svgDocument = e.target.ownerDocument;

    loadForms(e);
    loadButtons(e);
}


/*****
*
*   loadForms
*
*****/
function loadForms(e) {
    var forms  = svgDocument.getElementsByTagNameNS(GUI.NAMESPACE, "form");

    for ( var form = forms.item(0); form; form = forms.item(0) ) {
        var parent  = form.parentNode;
        var buttons = form.getElementsByTagNameNS(GUI.NAMESPACE, "*");
        var widgets = makeWidgets(buttons, parent);
        
        parent.removeChild(form);

        for ( var i = 0; i < widgets.length; i++ )
            widgets[i].node.setAttributeNS(null, "form-index", GUI.FORMS.length);
        
        var formObject = new Form(
            form.getAttributeNS(null, "name"),
            form.getAttributeNS(null, "action"),
            form.getAttributeNS(null, "encoding"),
            form.getAttributeNS(null, "method"),
            widgets
        );
        GUI.FORMS[GUI.FORMS.length] = formObject;
    }
}


/*****
*
*   loadButtons
*
*****/
function loadButtons(e) {
    var buttons = svgDocument.getElementsByTagNameNS(GUI.NAMESPACE, "*");

    makeWidgets(buttons);
}


/*****
*
*   makeWidgets
*
*****/
function makeWidgets(nodeset, parent) {
    var widgets = new Array();

    for ( var node = nodeset.item(0); node; node = nodeset.item(0) ) {
        var widget;

        switch (node.localName) {
            case 'button':      widget = new Button(node, parent); break;
            case 'checkbox':    widget = new Checkbox(node, parent); break;
            case 'radiobutton': widget = new Radiobutton(node, parent); break;
            default: alert("Unrecognized GUI widget type: " + tag);
        }

        if ( widget ) widgets[widgets.length] = widget;
        
        node.parentNode.removeChild(node);
    }

    return widgets;
}


/*****
*
*   Form constructor
*
*   invoke with:
*
*****/
function Form(name, action, encoding, method, widgets) {
    this.name     = name;
    this.action   = action;
    this.encoding = encoding;
    this.method   = method;
    this.widgets  = widgets;
}


Form.submit_callback = function(status) {
    var params = new Array();

    for ( var p in status ) {
        params[params.length] = p + ": " + status[p];
    }
    alert( params.join("\n") );
}


/*****
*
*   submit
*
*****/
Form.prototype.submit = function(button) {
    var params = new Object();

    for ( var i = 0; i < this.widgets.length; i++ ) {
        var widget = this.widgets[i];

        switch ( widget.type ) {
            case 'button':
                break; // skip buttons;
            case 'checkbox':
                var name  = widget.name;
                if ( widget.selected ) {
                    params[name] = "on";
                }
                break;
            case 'radiobutton':
                var name  = widget.group;
                var value = widget.value;
                if ( widget.selected ) {
                    params[name] = value;
                }
                break;
            default:
                alert("Unrecognized widget type: " + type);
        }
    }

    var param_array = new Array();
    for ( var name in params ) {
        param_array[param_array.length] = name + "=" + params[name];
    }

    window.postURL(this.action, param_array.join('&'), Form.submit_callback);
    //alert( param_array.join('&') );
};


/*****
*
*   Button constructor
*
*   invoke with:
*       gui:button node or
*       x, y, width, height, label, value, callback-text, parent, mode
*
*****/
function Button() {

    if ( arguments.length == 2 ) {
        var node   = arguments[0];
        var parent = arguments[1];
        this.x        = parseFloat(node.getAttributeNS(null, "x"));
        this.y        = parseFloat(node.getAttributeNS(null, "y"));
        this.width    = parseFloat(node.getAttributeNS(null, "width"));
        this.height   = parseFloat(node.getAttributeNS(null, "height"));
        this.label    = node.getAttributeNS(null, "label");
        this.value    = node.getAttributeNS(null, "value");
        this.callback = node.getAttributeNS(null, "callback");
        this.parent   = ( parent == null ) ? node.parentNode : parent;
        this.mode     = node.getAttributeNS(null, "mode");
        this.type     = "button";
    } else {
        var index = 0;
        this.x        = arguments[index++];
        this.y        = arguments[index++];
        this.width    = arguments[index++];
        this.height   = arguments[index++];
        this.label    = arguments[index++];
        this.value    = arguments[index++];
        this.callback = arguments[index++];
        this.parent   = arguments[index++];
        this.mode     = arguments[index++];
        this.type     = "button";
    }

    this.node     = svgDocument.createElementNS(svgns, "g");
    this.selected = false;
    this.up       = this.make_up(this.node);
    this.down     = this.make_down(this.node);

    this.node.addEventListener('mousedown', this, false);
    this.node.addEventListener('mouseup', this, false);
    this.parent.appendChild(this.node);
}


/*****
*
*   set_selected
*
*****/
Button.prototype.set_selected = function(state) {
    if ( this.selected != state ) {
        this.selected = state;
        if ( state ) {
            this.up.setAttributeNS(null, "display", "none");
            this.down.setAttributeNS(null, "display", "inline");
        } else {
            this.up.setAttributeNS(null, "display", "inline");
            this.down.setAttributeNS(null, "display", "none");
        }
    }
};


/*****
*
*   toggle
*
*****/
Button.prototype.toggle = function() {
    this.set_selected(!this.selected);
};


/*****
*
*   handleEvent
*
*****/
Button.prototype.handleEvent = function(e) {
    switch (e.type) {
        case 'mousedown':
            this.toggle();
            if ( this.callback ) eval(this.callback);
            if ( this.mode == "submit" ) {
                var form_index = this.node.getAttributeNS(null, "form-index");

                if ( form_index != "" ) {
                    GUI.FORMS[form_index].submit();
                }
            }
            break;
        case 'mouseup':
            if ( this.mode != "toggle" ) this.toggle();
            break;
        default:
            alert("Unnsupported Button event type: " + e.type);
    }
};


/*****
*
*   make_up
*
*****/
Button.prototype.make_up = function(parent) {
    var group  = svgDocument.createElementNS(svgns, "g");
    
    build_node(
        "rect",
        {
            x: this.x+1, y: this.y+1,
            rx: 3, ry: 3,
            height: this.height, width: this.width,
            fill: "black"
        },
        group
    );
    build_node(
        "rect",
        {
            x: this.x-1, y: this.y-1,
            rx: 3, ry: 3,
            height: this.height, width: this.width,
            fill: "white"
        },
        group
    );
    build_node(
        "rect",
        {
            x: this.x, y: this.y,
            rx: 3, ry: 3,
            height: this.height, width: this.width,
            fill: "rgb(155,155,155)"
        },
        group
    );
    
    if ( this.label != null ) {
        var t_node = build_node(
            "text",
            {
                x: this.x + this.width/2, y: this.y + this.height/2,
                'text-anchor': "middle",
                'pointer-events': "none"
            },
            group
        );
        build_node(
            "tspan",
            {
                dy: "0.33em"
            },
            t_node, this.label
        );
    }
    parent.appendChild(group);

    return group;
};


/*****
*
*   make_down
*
*****/
Button.prototype.make_down = function(parent) {
    var group  = svgDocument.createElementNS(svgns, "g");
    
    build_node(
        "rect",
        {
            x: this.x, y: this.y,
            rx: 3, ry: 3,
            height: this.height, width: this.width,
            stroke: "rgb(100,100,100)", 'stroke-width': "1pt",
            fill: "rgb(128,128,128)"
        },
        group
    );
    
    if ( this.label != null ) {
        var t_node = build_node(
            "text",
            {
                x: this.x + this.width/2, y: this.y + this.height/2,
                fill: "darkgray",
                'text-anchor': "middle",
                'pointer-events': "none"
            },
            group
        );
        build_node(
            "tspan",
            {
                dy: "0.33em"
            },
            t_node, this.label
        );
    }
    group.setAttributeNS(null, "display", "none");
    parent.appendChild(group);

    return group;
};


/*****
*
*   Checkbox constructor
*
*   invoke with:
*       gui:checkbox node or
*       name, x, y, label, callback-text, parent
*
*****/
function Checkbox() {
    if ( arguments.length == 2 ) {
        var node   = arguments[0];
        var parent = arguments[1];
        this.name     = node.getAttributeNS(null, "name");
        this.x        = parseFloat(node.getAttributeNS(null, "x"));
        this.y        = parseFloat(node.getAttributeNS(null, "y"));
        this.label    = node.getAttributeNS(null, "label");
        this.callback = node.getAttributeNS(null, "callback");
        this.parent   = ( parent == null ) ? node.parentNode : parent;
        this.type     = "checkbox";
    } else {
        var index = 0;
        this.name     = arguments[index++];
        this.x        = arguments[index++];
        this.y        = arguments[index++];
        this.label    = arguments[index++];
        this.callback = arguments[index++];
        this.parent   = arguments[index++];
        this.type     = "checkbox";
    }

    this.node     = svgDocument.createElementNS(svgns, "g");
    this.selected = false;
    this.on       = this.make_on(this.node);
    this.off      = this.make_off(this.node);

    this.node.addEventListener('mousedown', this, false);
    this.parent.appendChild(this.node);
}


/*****
*
*   set_selected
*
*****/
Checkbox.prototype.set_selected = function(state) {
    if ( this.selected != state ) {
        this.selected = state;
        if ( state ) {
            this.on.setAttributeNS(null, "display", "inline");
            this.off.setAttributeNS(null, "display", "none");
        } else {
            this.on.setAttributeNS(null, "display", "none");
            this.off.setAttributeNS(null, "display", "inline");
        }
    }
}


/*****
*
*   toggle
*
*****/
Checkbox.prototype.toggle = function() {
    this.set_selected(!this.selected);
};


/*****
*
*   handleEvent
*
*****/
Checkbox.prototype.handleEvent = function(e) {
    this.toggle(); // Perhaps the user should do this in the callback
    if ( this.callback ) eval(this.callback);
};


/*****
*
*   make_on
*
*****/
Checkbox.prototype.make_on = function(parent) {
    var group  = svgDocument.createElementNS(svgns, "g");
    
    build_node(
        "rect",
        {
            x: this.x, y: this.y,
            height: 10, width: 10,
            stroke: "rgb(100,100,100)", 'stroke-width': "1pt",
            fill: "white"
        },
        group
    );
    build_node(
        "line",
        {
            x1: this.x+1, y1: this.y+1,
            x2: this.x+9, y2: this.y+9,
            stroke: "black"
        },
        group
    );
    build_node(
        "line",
        {
            x1: this.x+1, y1: this.y+9,
            x2: this.x+9, y2: this.y+1,
            stroke: "black"
        },
        group
    );
    
    if ( this.label != null ) {
        build_node(
            "text",
            {
                x: this.x+15 , y: this.y+9,
                'pointer-events': "none"
            },
            group, this.label
        );
    }
    group.setAttributeNS(null, "display", "none");
    parent.appendChild(group);

    return group;
};


/*****
*
*   make_off
*
*****/
Checkbox.prototype.make_off = function(parent) {
    var group  = svgDocument.createElementNS(svgns, "g");
    
    build_node(
        "rect",
        {
            x: this.x, y: this.y,
            height: 10, width: 10,
            stroke: "rgb(100,100,100)", 'stroke-width': "1pt",
            fill: "white"
        },
        group
    );
    
    if ( this.label != null ) {
        build_node(
            "text",
            {
                x: this.x+15 , y: this.y+9,
                'pointer-events': "none"
            },
            group, this.label
        );
    }
    parent.appendChild(group);

    return group;
};


/*****
*
*   Radiobutton constructor
*
*   invoke with:
*       gui:radiobutton node or
*       x, y, label, value, callback-text, parent
*
*****/
Radiobutton.GROUPS = {};

function Radiobutton() {
    if ( arguments.length == 2 ) {
        var node   = arguments[0];
        var parent = arguments[1];
        this.group    = node.getAttributeNS(null, "group");
        this.x        = parseFloat(node.getAttributeNS(null, "x"));
        this.y        = parseFloat(node.getAttributeNS(null, "y"));
        this.label    = node.getAttributeNS(null, "label");
        this.value    = node.getAttributeNS(null, "value");
        this.callback = node.getAttributeNS(null, "callback");
        this.parent   = ( parent == null ) ? node.parentNode : parent;
        this.type     = "radiobutton";
    } else {
        var index = 0;
        this.group    = arguments[index++];
        this.x        = arguments[index++];
        this.y        = arguments[index++];
        this.label    = arguments[index++];
        this.value    = arguments[index++];
        this.callback = arguments[index++];
        this.parent   = arguments[index++];
        this.type     = "radiobutton";
    }

    this.node     = svgDocument.createElementNS(svgns, "g");
    this.selected = false;
    this.on       = this.make_on(this.node);
    this.off      = this.make_off(this.node);

    if ( Radiobutton.GROUPS[this.group] == null ) {
        this.select();
    }

    this.node.addEventListener('mousedown', this, false);
    this.parent.appendChild(this.node);
}


/*****
*
*   select
*
*****/
Radiobutton.prototype.select = function() {
    if ( !this.selected ) {
        var that = Radiobutton.GROUPS[this.group];

        this.selected = true;
        this.on.setAttributeNS(null, "display", "inline");
        this.off.setAttributeNS(null, "display", "none");

        if ( that != null ) {
            that.selected = false;
            that.on.setAttributeNS(null, "display", "none");
            that.off.setAttributeNS(null, "display", "inline");
        }

        Radiobutton.GROUPS[this.group] = this;
    }
}


/*****
*
*   handleEvent
*
*****/
Radiobutton.prototype.handleEvent = function(e) {
    this.select();
    if ( this.callback ) eval(this.callback);
};


/*****
*
*   make_on
*
*****/
Radiobutton.prototype.make_on = function(parent) {
    var group  = svgDocument.createElementNS(svgns, "g");
    
    build_node(
        "circle",
        {
            cx: this.x+3, cy: this.y+3,
            r: 5,
            stroke: "rgb(100,100,100)", 'stroke-width': "1pt",
            fill: "white"
        },
        group
    );
    build_node(
        "circle",
        {
            cx: this.x+3, cy: this.y+3,
            r: 3,
            stroke: "rgb(100,100,100)", 'stroke-width': "1pt",
            fill: "black"
        },
        group
    );
    
    if ( this.label != null ) {
        build_node(
            "text",
            {
                x: this.x+12 , y: this.y+7,
                'pointer-events': "none"
            },
            group, this.label
        );
    }
    group.setAttributeNS(null, "display", "none");
    parent.appendChild(group);

    return group;
};


/*****
*
*   make_off
*
*****/
Radiobutton.prototype.make_off = function(parent) {
    var group  = svgDocument.createElementNS(svgns, "g");
    
    build_node(
        "circle",
        {
            cx: this.x+3, cy: this.y+3,
            r: 5,
            stroke: "rgb(100,100,100)", 'stroke-width': "1pt",
            fill: "white"
        },
        group
    );
    
    if ( this.label != null ) {
        build_node(
            "text",
            {
                x: this.x+12 , y: this.y+7,
                'pointer-events': "none"
            },
            group, this.label
        );
    }
    parent.appendChild(group);

    return group;
};


/*****
*
*   build_node
*
*****/
function build_node(type, attributes, parent, text) {
    var node = svgDocument.createElementNS(svgns, type);

    for ( var attr in attributes ) {
        node.setAttributeNS(null, attr, attributes[attr]);
    }

    if ( text != null ) {
        var text_node = svgDocument.createTextNode(text);
        node.appendChild(text_node);
    }

    parent.appendChild(node);

    return node;
}
