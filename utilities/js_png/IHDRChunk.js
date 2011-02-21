/*****
*
*   IHDRChunk.js
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
IHDRChunk.VERSION = 1.0;

IHDRChunk.WIDTH       = Chunk.EOD;
IHDRChunk.HEIGHT      = IHDRChunk.WIDTH + 4;
IHDRChunk.BITDEPTH    = IHDRChunk.HEIGHT + 4;
IHDRChunk.COLORTYPE   = IHDRChunk.BITDEPTH + 1;
IHDRChunk.COMPRESSION = IHDRChunk.COLORTYPE + 1;
IHDRChunk.FILTER      = IHDRChunk.COMPRESSION + 1;
IHDRChunk.INTERLACE   = IHDRChunk.FILTER + 1;
IHDRChunk.EOD         = IHDRChunk.INTERLACE + 1;


/*****
*
*   setup inheritance
*
*****/
IHDRChunk.prototype             = new Chunk();
IHDRChunk.prototype.constructor = IHDRChunk;
IHDRChunk.superclass            = Chunk.prototype;


/*****
*
*   constructor
*
*****/
function IHDRChunk(width, height, bit_depth, color_type, compression, filter, interlace) {
    if ( arguments.length > 0 ) {
        // call superclass constructor
        IHDRChunk.superclass.constructor.call(this, IHDRChunk.EOD, "IHDR");

        // NOTE: We don't test any of the parameters for type or range since
        // the following set methods will do that for us.

        // init properties
        this.setWidth(width);
        this.setHeight(height);
        this.setBitDepth(bit_depth);
        this.setColorType(color_type);
        this.setCompression(compression);
        this.setFilter(filter);
        this.setInterlace(interlace);
    }
}

/*****  get/set methods *****/

/*****
*
*   setWidth
*
*****/
IHDRChunk.prototype.setWidth = function(width) {
    this.storeInt4(IHDRChunk.WIDTH, width);
};


/*****
*
*   setHeight
*
*****/
IHDRChunk.prototype.setHeight = function(height) {
    this.storeInt4(IHDRChunk.HEIGHT, height);
};


/*****
*
*   setBitDepth
*
*****/
IHDRChunk.prototype.setBitDepth = function(bit_depth) {
    this.storeByte(IHDRChunk.BITDEPTH, bit_depth);
};


/*****
*
*   setColorType
*
*****/
IHDRChunk.prototype.setColorType = function(color_type) {
    this.storeByte(IHDRChunk.COLORTYPE, color_type);
};


/*****
*
*   setCompression
*
*****/
IHDRChunk.prototype.setCompression = function(compression) {
    this.storeByte(IHDRChunk.COMPRESSION, compression);
};


/*****
*
*   setFilter
*
*****/
IHDRChunk.prototype.setFilter = function(filter) {
    this.storeByte(IHDRChunk.FILTER, filter);
};


/*****
*
*   setInterlace
*
*****/
IHDRChunk.prototype.setInterlace = function(interlace) {
    this.storeByte(IHDRChunk.INTERLACE, interlace);
};
