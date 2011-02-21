/*****
*
*   Path.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   Setup inheritance
*
*****/
Path.prototype             = new Shape();
Path.prototype.constructor = Path;
Path.superclass            = Shape.prototype;


/*****
*
*   Class constants
*
*****/
Path.COMMAND = 0;
Path.NUMBER  = 1;
Path.EOD     = 2;

Path.PARAMS = {
    A: [ "rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y" ],
    a: [ "rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y" ],
    C: [ "x1", "y1", "x2", "y2", "x", "y" ],
    c: [ "x1", "y1", "x2", "y2", "x", "y" ],
    H: [ "x" ],
    h: [ "x" ],
    L: [ "x", "y" ],
    l: [ "x", "y" ],
    M: [ "x", "y" ],
    m: [ "x", "y" ],
    Q: [ "x1", "y1", "x", "y" ],
    q: [ "x1", "y1", "x", "y" ],
    S: [ "x2", "y2", "x", "y" ],
    s: [ "x2", "y2", "x", "y" ],
    T: [ "x", "y" ],
    t: [ "x", "y" ],
    V: [ "y" ],
    v: [ "y" ],
    Z: [],
    z: []
};


/*****
*
*   constructor
*
*****/
function Path(svgNode) {
    if ( arguments.length > 0 ) {
        this.init(svgNode);
    }
}


/*****
*
*   init
*
*****/
Path.prototype.init = function(svgNode) {
    if ( svgNode == null || svgNode.localName != "path" )
        throw new Error("Path.init: Invalid localName: " + svgNode.localName);
    
    // Call superclass method
    Path.superclass.init.call(this, svgNode);
    
    // Convert path data to segments
    this.segments = null;
    this.parseData( svgNode.getAttributeNS(null, "d") );
};


/*****
*
*   realize
*
*****/
Path.prototype.realize = function() {
    for ( var i = 0; i < this.segments.length; i++ ) {
        this.segments[i].realize();
    }

    this.svgNode.addEventListener("mousedown", this, false);
};


/*****
*
*   unrealize
*
*****/
Path.prototype.unrealize = function() {
    for ( var i = 0; i < this.segments.length; i++ ) {
        this.segments[i].unrealize();
    }

    this.svgNode.removeEventListener("mousedown", this, false);
};



/*****
*
*   refresh
*
*****/
Path.prototype.refresh = function() {
    var d = new Array();

    for ( var i = 0; i < this.segments.length; i++ ) {
        d.push( this.segments[i].toString() );
    }

    this.svgNode.setAttributeNS(null, "d", d.join(" "));
};


/*****
*
*   registerHandles
*
*****/
Path.prototype.registerHandles = function() {
    for ( var i = 0; i < this.segments.length; i++ ) {
        this.segments[i].registerHandles();
    }
};


/*****
*
*   unregisterHandles
*
*****/
Path.prototype.unregisterHandles = function() {
    for ( var i = 0; i < this.segments.length; i++ ) {
        this.segments[i].unregisterHandles();
    }
};


/*****
*
*   selectHandles
*
*****/
Path.prototype.selectHandles = function(select) {
    for ( var i = 0; i < this.segments.length; i++ ) {
        this.segments[i].selectHandles(select);
    }
};


/*****
*
*   showHandles
*
*****/
Path.prototype.showHandles = function(state) {
    for ( var i = 0; i < this.segments.length; i++ ) {
        this.segments[i].showHandles(state);
    }
};


/*****
*
*   appendPathSegment
*
*****/
Path.prototype.appendPathSegment = function(segment) {
    segment.previous = this.segments[this.segments.length-1];

    this.segments.push(segment);
};


/*****
*
*   parseData
*
*****/
Path.prototype.parseData = function(d) {
    // convert path data to token array
    var tokens = this.tokenize(d);

    // point to first token in array
    var index = 0;

    // get the current token
    var token = tokens[index];

    // set mode to signify new path
    var mode = "BOD";

    // init segment array
    // NOTE: should destroy previous segment handles here
    this.segments = new Array();

    // Process all tokens
    while ( !token.typeis(Path.EOD) ) {
        var param_length;
        var params = new Array();

        if ( mode == "BOD" ) {
            // Start of new path.  Must be a moveto command
            if ( token.text == "M" || token.text == "m" ) {
                // Advance past command token
                index++;

                // Get count of numbers that must follow this command
                param_length = Path.PARAMS[token.text].length;

                // Set new parsing mode
                mode = token.text;
            } else {
                // Oops.  New path didn't start with a moveto command
                throw new Error("Path data must begin with a moveto command");
            }
        } else {
            // Currently in a path definition
            if ( token.typeis(Path.NUMBER) ) {
                // Many commands allow you to keep repeating parameters
                // without specifying the command again.  This handles
                // that case.
                param_length = Path.PARAMS[mode].length;
            } else {
                // Advance past command token
                index++; 

                // Get count of numbers that must follow this command
                param_length = Path.PARAMS[token.text].length;

                // Set new parsing mode
                mode = token.text;
            }
        }
        
        // Make sure we have enough tokens left to satisfy the number
        // of parameters we need for the last command
        if ( (index + param_length) < tokens.length ) {
            // Get each parameter
            for (var i = index; i < index + param_length; i++) {
                var number = tokens[i];
                
                // Make sure each parameter is a number.
                if ( number.typeis(Path.NUMBER) )
                    params[params.length] = number.text;
                else
                    throw new Error("Parameter type is not a number: " + mode + "," + number.text);
            }
            
            // NOTE: Should create add an appendPathSegment (careful, that
            // effects RelativePathSegments
            var segment;
            var length   = this.segments.length;
            var previous = ( length == 0 ) ? null : this.segments[length-1];
            switch (mode) {
                case "A": segment = new AbsoluteArcPath(        params, this, previous ); break;
                case "C": segment = new AbsoluteCurveto3(       params, this, previous ); break;
                case "c": segment = new RelativeCurveto3(       params, this, previous ); break;
                case "H": segment = new AbsoluteHLineto(        params, this, previous ); break;
                case "L": segment = new AbsoluteLineto(         params, this, previous ); break;
                case "l": segment = new RelativeLineto(         params, this, previous ); break;
                case "M": segment = new AbsoluteMoveto(         params, this, previous ); break;
                case "m": segment = new RelativeMoveto(         params, this, previous ); break;
                case "Q": segment = new AbsoluteCurveto2(       params, this, previous ); break;
                case "q": segment = new RelativeCurveto2(       params, this, previous ); break;
                case "S": segment = new AbsoluteSmoothCurveto3( params, this, previous ); break;
                case "s": segment = new RelativeSmoothCurveto3( params, this, previous ); break;
                case "T": segment = new AbsoluteSmoothCurveto2( params, this, previous ); break;
                case "t": segment = new RelativeSmoothCurveto2( params, this, previous ); break;
                case "Z": segment = new RelativeClosePath(      params, this, previous ); break;
                case "z": segment = new RelativeClosePath(      params, this, previous ); break;
                default:
                    throw new Error("Unsupported segment type: " + mode);
            };
            this.segments.push(segment);

            // advance to the next unused token
            index += param_length;

            // get current token
            token = tokens[index];

            // Lineto's follow moveto when no command follows moveto params
            if ( mode == "M" ) mode = "L";
            if ( mode == "m" ) mode = "l";
        } else {
            throw new Error("Path data ended before all parameters were found");
        }
    }
}


/*****
*
*   tokenize
*
*   Need to add support for scientific notation
*
*****/
Path.prototype.tokenize = function(d) {
    var tokens = new Array();

    while ( d != "" ) {
        if ( d.match(/^([ \t\r\n,]+)/) )
        {
            d = d.substr(RegExp.$1.length);
        }
        else if ( d.match(/^([aAcChHlLmMqQsStTvVzZ])/) )
        {
            tokens[tokens.length] = new Token(Path.COMMAND, RegExp.$1);
            d = d.substr(RegExp.$1.length);
        }
        else if ( d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/) )
        {
            tokens[tokens.length] = new Token(Path.NUMBER, parseFloat(RegExp.$1));
            d = d.substr(RegExp.$1.length);
        }
        else
        {
            throw new Error("Unrecognized segment command: " + d);
            //d = "";
        }
    }

    tokens[tokens.length] = new Token(Path.EOD, null);

    return tokens;
}


/*****
*
*   intersection methods
*
*****/

/*****
*
*   intersectShape
*
*****/
Path.prototype.intersectShape = function(shape) {
    var result = new Intersection("No Intersection");

    for ( var i = 0; i < this.segments.length; i++ ) {
        var inter = Intersection.intersectShapes(this.segments[i],shape);

        result.appendPoints(inter.points);
    }

    if ( result.points.length > 0 ) result.status = "Intersection";

    return result;
};


/*****
*
*   get/set methods
*
*****/

/*****
*
*   getIntersectionParams
*
*****/
Path.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Path",
        []
    );
};

