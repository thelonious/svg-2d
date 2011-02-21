/*****
*
*   tRNSChunk.js
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
tRNSChunk.VERSION = 1.0;

/*****
*
*   offset
*
*****/
tRNSChunk.DATA = Chunk.EOD;


/*****
*
*   setup inheritance
*
*****/
tRNSChunk.prototype             = new Chunk();
tRNSChunk.prototype.constructor = tRNSChunk;
tRNSChunk.superclass            = Chunk.prototype;


/*****
*
*   constructor
*
*****/
function tRNSChunk(lastIndex, entrySize) {
    if ( arguments.length > 0 ) {
        if ( entrySize == null ) entrySize = 1;

        if ( isNaN(lastIndex) )
            throw new Error("tRNSChunk: lastIndex must be a number");
        if ( lastIndex < 0 || 255 < lastIndex )
            throw new Error("tRNSChunk: lastIndex must be between 0 and 255, inclusive");
        if ( isNaN(entrySize) )
            throw new Error("tRNSChunk: entrySize must be null or a number");
        if ( entrySize != 1 && entrySize != 2 && entrySize != 6 )
            throw new Error("tRNSChunk: entrySize must equal 1, 2 or 6");

        var totalSize = tRNSChunk.DATA + ((lastIndex + 1) * entrySize);

        // call superclass constructor
        PLTEChunk.superclass.constructor.call(this, totalSize, "tRNS");

        this.entrySize = entrySize;
        this.lastIndex = lastIndex;
    }
}


/*****
*
*   setAlpha - for indexed color images
*
*****/
tRNSChunk.prototype.setAlpha = function(index, alpha) {
    if ( isNaN(index) )
        throw new Error("tRNSChunk.setAlpha: index must be a number");
    if ( index < 0 || this.lastIndex < index )
        throw new Error("tRNSChunk.setAlpha: index out of range: " + index);
    if ( this.entrySize != 1 )
        throw new Error("tRNSChunk.setAlpha: this function valid with index color images only");

    // NOTE: storeByte and storeInt2 will check type and range of alpha for us.
    // I check index for validity since we do math with it here
    this.storeByte(tRNSChunk.DATA + index, alpha);
};


/*****
*
*   setTransparencyValue - for greyscale images
*
*****/
tRNSChunk.prototype.setTransparencyValue = function(value) {
    var lastIndex = ( Png.ASV_FIX ) ? 1 : 0;
    if ( this.entrySize != 2 || this.lastIndex != lastIndex )
        throw new Error("tRNSChunk.setTransparencyValue: this function valid with greyscale images only");

    this.storeInt2(tRNSChunk.DATA, value);
};


/*****
*
*   setTransparencyColor - for RGB images
*
*****/
tRNSChunk.prototype.setTransparencyColor = function(red, green, blue) {
    if ( this.entrySize != 6 || this.lastIndex != 0 )
        throw new Error("tRNSChunk.setTransparencyColor: this function valid with color images only");
    
    this.storeInt2(tRNSChunk.DATA,   red);
    this.storeInt2(tRNSChunk.DATA+2, green);
    this.storeInt2(tRNSChunk.DATA+4, blue);
};
