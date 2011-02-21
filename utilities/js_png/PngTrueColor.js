/*****
*
*   PngTrueColor.js
*
*   copyright 2003, Kevin Lindsey
*   licensing info available at: http://www.kevlindev.com/license.txt
*
*****/

/*****
*
*   class variables
*
*****/
PngTrueColor.VERSION = 1.0;

/*****
*
*   setup inheritance
*
*****/
PngTrueColor.prototype             = new Png();
PngTrueColor.prototype.constructor = PngTrueColor;
PngTrueColor.superclass            = Png.prototype;


/*****
*
*   constructor
*
*****/
function PngTrueColor(width, height, useAlpha) {
    if ( arguments.length > 0 ) {
        if ( useAlpha == null ) useAlpha = false;

        // call superclass constructor
        PngTrueColor.superclass.constructor.call(this);

        var colorType = (useAlpha) ? 6 : 2;

        this.chunks.push(
            this.header = new IHDRChunk(
                width, height,
                8,              // bitdepth
                colorType,      // color type  - true color, and maybe alpha
                0,              // compression - flate/defalte
                0,              // filter      - adaptive
                0               // interlace   - none
            )
        );

        this.transparency = null;
        
        this.useAlpha = useAlpha;
        this.chunks.push(
            this.image = new IDATChunk(width, height, (useAlpha) ? 4 : 3)
        );

        this.chunks.push(
            this.end = new IENDChunk()
        );
    }
}


/*****
*
*   setPixel - new
*
*****/
PngTrueColor.prototype.setPixel = function(x, y, red, green, blue, alpha) {
    if ( this.useAlpha ) {
        this.image.setPixel(x, y, red, green, blue, alpha);
    } else {
        this.image.setPixel(x, y, red, green, blue);
    }
};


/*****
*
*   setTransparencyColor
*
*****/
PngTrueColor.prototype.setTransparencyColor = function(red, green, blue) {
    // create transparency chunk, if does not exist
    if ( this.transparency == null ) {
        this.transparency = new tRNSChunk(0,6);
        this.chunks.splice(1, 0, this.transparency);
    }

    this.transparency.setTransparencyColor(red, green, blue);
}
