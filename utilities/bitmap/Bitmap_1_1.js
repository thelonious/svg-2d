/*****
*
*   Bitmap.js
*   version 1.1
*
*   written by Kevin Lindsey
*   copyright 2001, Kevin Lindsey
*
*   History
*   =======
*   version 1.1 - 2/May/2001
*   Now supports just-in-time creation of rows.  This
*   significantly speeds up startup time and execution
*   speed in NN4.7
*
*****/

var svgns = "http://www.w3.org/2000/svg";


/*****
*
*   Bitmap Class
*
*****/
function Bitmap(parent, width, height, cw, ch, cg) {
    this.parent           = parent;
    this.width            = width;
    this.height           = height;
    this.cell_width       = cw;
    this.cell_height      = ch;
    this.cell_gap         = cg;
    this.cell_full_width  = cw + cg;
    this.cell_full_height = ch + cg;
    this.grid_width       = width  * this.cell_full_width;
    this.grid_height      = height * this.cell_full_height;
    this.pixels           = null;
    this.rows             = new Array(ch);

    this.auto_update = false;
    this.offset = (this.cell_height + this.cell_gap) / 2 + (this.cell_gap % 2) / 2;

    this.make_bitmap();
    //this.make_rows();
}


/*****
*
*   make_bitmap
*
*****/
Bitmap.prototype.make_bitmap = function() {
    var pixels = svgDocument.createElementNS(svgns, "g");
    var offset = ( this.cell_gap % 2 ) / 2;

    this.pixels = pixels;
    pixels.setAttributeNS(null, "fill", "none");
    pixels.setAttributeNS(null, "stroke", "red");
    pixels.setAttributeNS(null, "stroke-width", this.cell_height);

    this.parent.appendChild(pixels);
};


/*****
*
*   make_rows
*
*****/
Bitmap.prototype.make_rows = function() {
    var c        = 1;
    var y_center = this.offset;
    var line;

    for ( var y = 0; y < this.height; y++ ) {
        var line = Bitmap.make_line(0, y_center, this.grid_width, y_center);

        this.rows[y] = new Bitmap_Row(line, this.width);

        this.pixels.appendChild(line);
        
        y_center += this.cell_full_height;
    }
};


/*****
*
*   set_pixel
*
*****/
Bitmap.prototype.set_pixel = function(x, y, value) {
    if (value === undefined) throw Error("value is undefined");

    if ( 0 <= x && x < this.width && 0 <= y && y < this.height ) {
        var row = this.rows[y];
        
        if ( row == null ) {
            var y_center = this.offset + y * this.cell_full_height;
            var line     = Bitmap.make_line(0, y_center, this.grid_width, y_center);

            row = new Bitmap_Row(line, this.width);
            this.rows[y] = row;

            this.pixels.appendChild(line);
        }
        row.values[x] = value;

        if (this.auto_update) {
            row.update(this);
        }
    }
}


/*****
*
*   get_pixel
*
*****/
Bitmap.prototype.get_pixel = function(x, y) {
    var result = 0;
    
    if ( 0 <= x && x < this.width && 0 <= y && y < this.height ) {
        var row = this.rows[y];
        
        if ( row == null ) {
            result = 0;
        } else {
            result = row.values[x];
        }
    }

    return result;
}


/*****
*
*   update
*
*****/
Bitmap.prototype.update = function() {
    for ( var y = 0; y < this.height; y++ ) {
        var row = this.rows[y];

        if ( row != null ) {
            row.update(this);
        }
    }
}


/*****
*
*   set_pixel_visibility
*
*****/
Bitmap.prototype.set_pixel_visibility = function(setting) {
    this.pixels.setAttributeNS(null, "display", setting);
}


/*****
*
*   set_pixel_color
*
*****/
Bitmap.prototype.set_pixel_color = function(color) {
    this.pixels.setAttributeNS(null, "stroke", color);
}


/*****
*
*   Class Methods
*
*****/

/*****
*
*   make_line
*
*****/
Bitmap.make_line = function(x1, y1, x2, y2) {
    var line  = svgDocument.createElementNS(svgns, "line");
    var width = x2 - x1 + 1;

    line.setAttributeNS(null, "x1", x1);
    line.setAttributeNS(null, "y1", y1);
    line.setAttributeNS(null, "x2", x2);
    line.setAttributeNS(null, "y2", y2);
    line.setAttributeNS(null, "stroke-dasharray", "0 " + width);
    line.setAttributeNS(null, "stroke-dashoffset", 1);

    return line;
}


/*****
*
*   Bitmap_Row
*
*****/

/*****
*
*   Bitmap_Row
*
*****/
function Bitmap_Row(line, width) {
    this.line   = line;
    this.values = new Array();

    for ( var x = 0; x < width; x++ ) {
        this.values[x] = 0;
    }
}


/*****
*
*   update
*
*****/
Bitmap_Row.prototype.update = function(bitmap) {
    var cell_gap   = bitmap.cell_gap;
    var cell_width = bitmap.cell_width;
    var width      = bitmap.width;
    var offset     = cell_gap / 2 + (cell_gap % 2) / 2;
    var run        = offset + 1;
    var dash_array = new Array();

    if ( cell_gap > 0 ) {
        dash_array[dash_array.length] = 0;
        
        for ( var x = 0; x < width; x++ ) {
            if ( this.values[x] == 0 ) {
                run += cell_width + cell_gap;
            } else {
                dash_array[dash_array.length] = run;
                dash_array[dash_array.length] = cell_width;
                run = cell_gap;
            }
            
        }
    } else {
        var state = 0;
        
        if ( this.values[0] == 0 ) {
            dash_array[dash_array.length] = 0;
        } else {
            dash_array[dash_array.length] = run;
            run = 0;
        }

        for ( var x = 0; x < width; x++ ) {
            if ( state == this.values[x] ) {
                run += cell_width + cell_gap;
            } else {
                dash_array[dash_array.length] = run;
                run = cell_width + cell_gap;
                state = 1 - state;
            }
        }
    }

    dash_array[dash_array.length] = run;

    this.line.setAttributeNS(null, "stroke-dasharray", dash_array.join(","));
    this.line.setAttributeNS(null, "stroke-dashoffset", 1);
};
