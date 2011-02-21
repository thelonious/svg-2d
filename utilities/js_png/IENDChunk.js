/*****
*
*   IENDChunk.js
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
IENDChunk.VERSION = 1.0;

/*****
*
*   setup inheritance
*
*****/
IENDChunk.prototype             = new Chunk();
IENDChunk.prototype.constructor = IENDChunk;
IENDChunk.superclass            = Chunk.prototype;


/*****
*
*   constructor
*
*****/
function IENDChunk() {
    // call superclass constructor
    IENDChunk.superclass.constructor.call(this, Chunk.EOD, "IEND");
}
