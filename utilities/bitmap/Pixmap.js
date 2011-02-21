/*****
*
*   Pixmap.js
*
*   written by Kevin Lindsey
*   copyright 2001, Kevin Lindsey
*
*****/

/*****
*
*   globals
*
*****/

/*****
*
*   constructor
*
*****/
function Pixmap(parent, width, height, colors, cw, ch, cg) {
    this.planes = new Array();
    this.colors = colors.length;
    
    for ( var x = 0; x < colors.length; x++ ) {
        var plane = new Bitmap(parent, width, height, cw, ch, cg);

        plane.set_pixel_color(colors[x]);
        this.planes[this.planes.length] = plane;
    }
}


/*****
*
*   update
*
*****/
Pixmap.prototype.update = function() {
    for ( var x = 0; x < this.planes.length; x++) {
        var plane = this.planes[x];

        plane.update();
    }
};


/*****
*
*   set_pixel
*
*****/
Pixmap.prototype.set_pixel = function(x, y, plane) {
    if ( plane >= 0 && plane < this.colors ) {
        for ( var p = 0; p < this.colors; p++ ) {
            this.planes[p].set_pixel(x, y, 0);
        }
        this.planes[plane].set_pixel(x, y, 1);
    } else {
        alert("Plane out of range: " + plane);
    }
};


/*****
*
*   set_pixel_color
*
*****/
Pixmap.prototype.set_pixel_color = function(color, plane) {
    if ( plane >= 0 && plane < this.colors ) {
        this.planes[plane].set_pixel_color(color);
    } else {
        alert("Plane out of range: " + plane);
    }
};

