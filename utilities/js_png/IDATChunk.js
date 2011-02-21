/*****
*
*   IDATChunk.js
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
IDATChunk.VERSION = 1.0;

/*****
*
*   offset
*
*****/
IDATChunk.DEFLATE = Chunk.EOD;
IDATChunk.DATA    = IDATChunk.DEFLATE + 2;


/*****
*
*   setup inheritance
*
*****/
IDATChunk.prototype             = new Chunk();
IDATChunk.prototype.constructor = IDATChunk;
IDATChunk.superclass            = Chunk.prototype;


/*****
*
*   constructor
*
*****/
function IDATChunk(width, height, bytesPerPixel) {
    if ( arguments.length > 0 ) {
        if ( bytesPerPixel == null ) bytesPerPixel = 1;

        if ( isNaN(width) || isNaN(height) || isNaN(bytesPerPixel) )
            throw new Error("IDATChunk: parameters must be numbers");
        if ( width < 0 || height < 0 )
            throw new Error("IDATChunk: width and height must be positive numbers");
        if ( bytesPerPixel < 0 || 4 < bytesPerPixel )
            throw new Error("IDATChunk: bytesPerPixel must be between 1 and 4, inclusive");

        this.width = width;
        this.height = height;
        this.bytesPerPixel = bytesPerPixel;

        if ( bytesPerPixel > 1 ) {
            // initial block size with header excluded;
            var blockSize = 0xFFFF - 5;

            // number of bytes in one row of image data (includes filter
            // identifier)
            var rowBytes = width*bytesPerPixel + 1;

            // determine how many full rows would fit in the block
            var wholeRows = Math.floor(blockSize / rowBytes);
            
            // we only need to worry about the block size if our data spans
            // more than one block
            if ( wholeRows < height ) {
                // determine how much of the block is left for the last partial
                // row of image data
                lastRowBytes = blockSize - wholeRows*rowBytes;

                if ( lastRowBytes < (bytesPerPixel + 1) ) {
                    // we don't have enough room to store a full pixel and the
                    // leading filter identifier
                    throw new Error("IDATChunk: this case not yet implemented");
                } else {
                    // take off a byte for the filter identifier
                    lastRowBytes--;

                    // take off any partial bytes
                    blockSize -= lastRowBytes % bytesPerPixel;
                }
            }

            this.blockSize = blockSize+5;
        } else {
            this.blockSize = 0xFFFF;
        }

        // NOTE: each row begins with a filter identifier, so we increase the
        // byte count by one more column to include the identifier
        var image_data = (width*height)*bytesPerPixel + this.height;
        var block_headers =
            5 * Math.floor((image_data + this.blockSize-1) / this.blockSize);

        // NOTE: image data (with filter identifier), block headers, and
        // addler-32 checksum
        var total = image_data + block_headers + 4;
        
        // call superclass constructor
        IDATChunk.superclass.constructor.call(this, IDATChunk.DATA + total, "IDAT");

        // calculate deflate header
        this.initDeflateHeader();

        // init default block headers
        // NOTE: last_block is a 3-bit header divided into two parts.  Bit-0,
        // when set, indicates the current block is the final block in the
        // stream.  Bits 1 and 2 indicate how the data was compressed:
        // 00 = no compression
        // 01 = compressed with fixed Huffman codes
        // 10 = compressed with dynamic Huffman codes
        // 11 = reserved (error)
        // Please refer to rfc1951, "DEFLATE Compressed Data Format
        // Specification version 1.3" for more details
        var offset = IDATChunk.DATA;
        for ( var i = 0; i < image_data; i += this.blockSize ) {
            // assume we have a complete block
            var block_size = this.blockSize;
            var last_block = 0;

            // handle last block, if necessary
            if ( i + this.blockSize >= image_data ) {
                block_size = image_data - i;
                last_block = 1;
            }
            
            this.storeByte(offset, last_block);
            this.storeInt2Reversed(offset+1, block_size);
            this.storeInt2Reversed(offset+3, ~block_size);
            
            // skip to next block (taking this header size into account)
            offset += this.blockSize + 5;
        }
    }
}


/*****
*
*   initDeflateHeader
*
*   Please refer to rfc1950, "ZLIB Compressed Data Format Specification version
*   3.3" for more details on how the deflate header is calculated
*
*****/
IDATChunk.prototype.initDeflateHeader = function() {
    // NOTE: the deflate header will always calculate out to 30721 when using a
    // 32K window.  I decided to "show the math" so that it will be easier to
    // adjust the window size and flags if needed in the future.

    // PNG and gzip use compression method 8 which is DEFLATE
    var compressMethod = 8;

    // use a 32K window size - the maximum size allowable for DEFLATE
    var windowSize = 0x8000;

    // the deflate header specifies the window size by taking log base 2 of
    // the window size and then subtracting 8 from that result
    var log2Size = Math.LOG2E * Math.log(windowSize);
    var windowLog = log2Size - 8;

    // Specify the quality of the compression as defined by compression method
    // 8.
    // 0 = used fastest algorithm
    // 1 = used fast algorithm
    // 2 = used default algorithm
    // 3 = maximum compression, slowest algorithm
    var flevel = 0;

    // shift and "or" everything into place to build the CFM:FLG bytes
    var header = ((windowLog << 4) | compressMethod) << 8 | (flevel << 6);

    // adjust last 4 bits of FLG to make entire header an even multiple of 31
    header += 31 - (header % 31);

    // store the value
    this.setDeflateHeader(header);
};


/*****  get/set methods *****/

/*****
*
*   setChecksum
*
*   based on the adler32 function defined in zlib 1.1.4
*
*****/
IDATChunk.prototype.setChecksum = function() {
    // compute checksum (adler32) of image data (with filter type)

    // largest prime < 65536
    var base = 65521;

    // largest n satisfying 255*n*(n+1)/2 + (n+1)*(base-1) <= 2^32-1
    // this value determines the number of times we can add to s1 and s2 before
    // needing to perform a relatively expensive modulo function
    var nmax = 5552;

    // prime the checksum pump
    var s1 = 1;
    var s2 = 0;
    var k = nmax;

    // process all data bytes
    for (var y = 0; y < this.height; y++) {
        // add one extra loop (-1 below) to include filter code in each row
        var offset = this.getPixelOffset(0, y) - 1;
        s1 += this.data[offset++];
        s2 += s1;
        if ( --k == 0 ) {
            s1 %= base;
            s2 %= base;
            k = nmax;
        }

        for (var x = 0; x < this.width; x++) {
            var offset = this.getPixelOffset(x, y);
            for ( var i = 0; i < this.bytesPerPixel; i++ ) {
                s1 += this.data[offset++];
                s2 += s1;

                // decrease our need-to-modulo counter
                if ( --k == 0 ) {
                    // time to mod our current summations
                    s1 %= base;
                    s2 %= base;

                    // and reset our counter
                    k = nmax;
                }
            }
        }
    }

    // we may need to perform one last modulo
    if ( k != nmax ) {
        // but only if we didn't just do one
        s1 %= base;
        s2 %= base;
    }

    // store the calculated adler32 checksum
    this.storeInt4(this.data.length - 8, (s2 << 16) | s1)
};


/*****
*
*   setDeflateHeader
*
*****/
IDATChunk.prototype.setDeflateHeader = function(header) {
    if ( isNaN(header) )
        throw new Error("IDATChunk.setDefaultHeader: header must be a number");

    // NOTE: storeInt2 will catch out of range values
    this.storeInt2(IDATChunk.DEFLATE, header);
};


/*****
*
*   [get/set]Pixel
*
*****/
IDATChunk.prototype.setPixel = function(x, y, color) {
    if ( isNaN(color) )
        throw new Error("IDATChunk.setPixel: parameters must be numbers");
    if ( color < 0 || 255 < color )
        throw new Error("IDATChunk.setPixel: color out of range: " + color);
    if ( arguments.length - 2 != this.bytesPerPixel )
        throw new Error("IDATChunk.setPixel: not enough parameters to specify a color");

    // plot the point
    var offset = this.getPixelOffset(x, y);
    for ( var i = 0; i < this.bytesPerPixel; i++ ) {
        this.storeByte(offset++, arguments[2+i]);
    }
};
IDATChunk.prototype.getPixel = function(x, y) {
    return this.data[this.getPixelOffset(x, y)];
};


/*****
*
*   getPixelOffset
*
*****/
IDATChunk.prototype.getPixelOffset = function(x,y) {
    if ( isNaN(x) || isNaN(y) )
        throw new Error("IDATChunk.setPixel: parameters must be numbers");
    if ( x < 0 || this.width < x )
        throw new Error("IDATChunk.getPixelOffset: x out of range: " + x);
    if ( y < 0 || this.width < y )
        throw new Error("IDATChunk.getPixelOffset: y out of range: " + y);
    
    // NOTE: each row begins with a filter identifier, so we increase the row
    // byte count by one to include this value.  Also, the first row has a y
    // value of 0 which causes the first part of the index expression to be
    // zero, but that row has a filter identifier, so we add one to account for
    // that.
    var index = y*this.width*this.bytesPerPixel + y + 1 + x*this.bytesPerPixel;

    // NOTE: the image data includes a deflate header and is broken into
    // blocks.  We calculate the block containing the point and add all block
    // headers up to and including that block.
    var blocks_offset = 5 * Math.floor((index + this.blockSize) / this.blockSize);

    // add it all up and return the offset
    return IDATChunk.DATA + index + blocks_offset;
};

