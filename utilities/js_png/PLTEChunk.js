/*****
*
*   PLTEChunk.js
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
PLTEChunk.VERSION = 1.0;

/*****
*
*   offsets
*
*****/
PLTEChunk.DATA = Chunk.EOD;


/*****
*
*   setup inheritance
*
*****/
PLTEChunk.prototype             = new Chunk();
PLTEChunk.prototype.constructor = PLTEChunk;
PLTEChunk.superclass            = Chunk.prototype;


/*****
*
*   constructor
*
*****/
function PLTEChunk(lastIndex) {
    if ( arguments.length > 0 ) {
        if ( isNaN(lastIndex) )
            throw new Error("PLTEChunk: lastIndex must be a number");
        if ( lastIndex < 0 || 255 < lastIndex )
            throw new Error("PLTEChunk: lastIndex must be between 0 and 255, inclusive");

        // call superclass constructor
        PLTEChunk.superclass.constructor.call(this, PLTEChunk.DATA+(3*(lastIndex+1)), "PLTE");

        this.lastIndex = lastIndex;
    }
}


/*****
*
*   setColor
*
*****/
PLTEChunk.prototype.setColor = function(index, red, green, blue) {
    if ( isNaN(index) || isNaN(red) || isNaN(green) || isNaN(blue) )
        throw new Error("PLTEChunk.setColor: all parameters must be numbers");
    if ( index < 0 || this.lastIndex < index )
        throw new Error("PLTEChunk.setColor: index out of range: " + index);

    // NOTE: We could check the rgb ranges here, but setByte will do that for
    // us
    var offset = PLTEChunk.DATA + 3*index;
    this.storeByte(offset++, red);
    this.storeByte(offset++, green);
    this.storeByte(offset, blue);
};

