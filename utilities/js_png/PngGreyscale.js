/*****
*
*   PngGreyscale.js
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
PngGreyscale.VERSION = 1.0;

/*****
*
*   setup inheritance
*
*****/
PngGreyscale.prototype             = new Png();
PngGreyscale.prototype.constructor = PngGreyscale;
PngGreyscale.superclass            = Png.prototype;


/*****
*
*   constructor
*
*****/
function PngGreyscale(width, height, useAlpha) {
    if ( arguments.length > 0 ) {
        if ( useAlpha == null ) useAlpha = false;

        // call superclass constructor
        PngGreyscale.superclass.constructor.call(this);

        var colorType = (useAlpha) ? 4 : 0;

        this.chunks.push(
            this.header = new IHDRChunk(
                width, height,
                8,              // bitdepth
                colorType,      // color type  - greyscale, maybe alpha
                0,              // compression - flate/defalte
                0,              // filter      - adaptive
                0               // interlace   - none
            )
        );

        this.transparency = null;
        
        this.useAlpha = useAlpha;
        if ( useAlpha ) {
            this.chunks.push(
                this.image = new IDATChunk(width, height, 2)
            );
        } else {
            this.chunks.push(
                this.image = new IDATChunk(width, height)
            );
        }

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
PngGreyscale.prototype.setPixel = function(x, y, value, alpha) {
    if ( this.useAlpha ) {
        this.image.setPixel(x, y, value, alpha);
    } else {
        this.image.setPixel(x, y, value);
    }
};


/*****
*
*   setTransparencyValue
*
*****/
PngGreyscale.prototype.setTransparencyValue = function(value) {
    // create transparency chunk, if does not exist
    if ( this.transparency == null ) {
        var lastIndex = ( Png.ASV_FIX ) ? 1 : 0;
        this.transparency = new tRNSChunk(lastIndex,2);
        this.chunks.splice(1, 0, this.transparency);
    }

    this.transparency.setTransparencyValue(value);
}
