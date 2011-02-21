/*****
*
*   PngIndex.js
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
PngIndex.VERSION = 1.0;

/*****
*
*   setup inheritance
*
*****/
PngIndex.prototype             = new Png();
PngIndex.prototype.constructor = PngIndex;
PngIndex.superclass            = Png.prototype;


/*****
*
*   constructor
*
*****/
function PngIndex(width, height, useTransparency) {
    if ( arguments.length > 0 ) {
        // call superclass constructor
        PngIndex.superclass.constructor.call(this);

        this.chunks.push(
            this.header = new IHDRChunk(
                width, height,
                8,              // bitdepth
                3,              // color type  - indexed
                0,              // compression - flate/defalte
                0,              // filter      - adaptive
                0               // interlace   - none
            )
        );

        this.chunks.push(
            this.palette = new PLTEChunk(255)
        );

        if ( useTransparency ) {
            this.chunks.push(
                this.alphas = new tRNSChunk(255)
            );
        }
        
        this.chunks.push(
            this.image = new IDATChunk(width, height)
        );

        this.chunks.push(
            this.end = new IENDChunk()
        );
    }
}
