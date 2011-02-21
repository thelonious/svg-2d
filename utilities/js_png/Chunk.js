/*****
*
*   Chunk.js
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
Chunk.VERSION = 1.0;

/*****
*
*   offsets
*
*****/
Chunk.LENGTH = 0;
Chunk.TYPE   = Chunk.LENGTH + 4;
Chunk.EOD    = Chunk.TYPE + 4;


/*****
*
*   constructor
*
*****/
function Chunk(length, type) {
    if ( arguments.length > 0 ) {
        if ( isNaN(length) )
            throw new Error("Chunk: length must be a number: " + length);
        if ( length < Chunk.EOD )
            throw new Error("Chunk: length must be >= " + Chunk.EOD);

        // NOTE: Could test the type parameter here too, but that will be
        // caught in setType.  We need to test length since we use that number
        // in this function; otherwise, we could have used the error checking
        // in setLength
            
        // We add 4 to the length to account for the CRC value at the end of
        // every chunk.  Since this offset moves for each chunk type, we
        // account for it here
        var size = length + 4;

        // create data array and zero all entries
        this.data = new Array(size);
        for ( var i = 0; i < size; i++ )
            this.data[i] = 0;
        
        // set properties
        this.setLength(length - 4 - 4); // exlude length and type
        this.setType(type);
    }
}


/*****
*
*   storeByte
*
*****/
Chunk.prototype.storeByte = function(offset, value) {
    if ( isNaN(offset) || isNaN(value) )
        throw new Error("Chunk.storeByte: parameters must be numbers");
    if ( offset < 0 || this.data.length <= offset )
        throw new Error("Chunk.storeByte: offset out of range: " + offset);
    if ( value < 0 || 0xFF < value )
        throw new Error("Chunk.storeByte: value out of range: " + value);

    this.data[offset] = value;
};


/*****
*
*   storeInt2
*
*****/
Chunk.prototype.storeInt2 = function(offset, value) {
    if ( isNaN(offset) || isNaN(value) )
        throw new Error("Chunk.storeInt2: parameters must be numbers");
    if ( offset < 0 || this.data.length <= offset )
        throw new Error("Chunk.storeInt2: offset out of range: " + offset);
    if ( value < 0 || 0xFFFF < value )
        throw new Error("Chunk.storeInt2: value out of range: " + value);

    this.data[offset++] = (value >> 8) & 0xFF;
    this.data[offset]   = value & 0xFF;
};


/*****
*
*   storeInt2Reversed
*
*****/
Chunk.prototype.storeInt2Reversed = function(offset, value) {
    if ( isNaN(offset) || isNaN(value) )
        throw new Error("Chunk.storeInt2Reversed: parameters must be numbers");
    if ( offset < 0 || this.data.length <= offset )
        throw new Error("Chunk.storeInt2Reversed: offset out of range: " + offset);
    /*
    if ( value < 0 || 0xFFFF < value )
        throw new Error("Chunk.storeInt2Reversed: value out of range: " + value);
    */

    this.data[offset++] = value & 0xFF;
    this.data[offset]   = (value >> 8) & 0xFF;
};


/*****
*
*   storeInt4
*
*****/
Chunk.prototype.storeInt4 = function(offset, value) {
    if ( isNaN(offset) || isNaN(value) )
        throw new Error("Chunk.storeInt4: parameters must be numbers");
    if ( offset < 0 || this.data.length <= offset )
        throw new Error("Chunk.storeInt4: offset out of range: " + offset);
    /*
    if ( value < 0 || 0xFFFFFFFF < value )
        throw new Error("Chunk.storeInt4: value out of range: " + value);
    */

    this.data[offset++] = (value >> 24) & 0xFF;
    this.data[offset++] = (value >> 16) & 0xFF;
    this.data[offset++] = (value >> 8) & 0xFF;
    this.data[offset]   = value & 0xFF;
};


/*****  get/set methods *****/

/*****
*
*   setLength
*
*****/
Chunk.prototype.setLength = function(length) {
    this.storeInt4(Chunk.LENGTH, length);
};


/*****
*
*   setType
*
*****/
Chunk.prototype.setType = function(type) {
    if ( typeof type != "string")
        throw new Error("Chunk.setType: parameter must be a string");
    if ( type.length != 4 )
        throw new Error("Chunk.setType: type must be 4 characters in length");

    for ( var i = 0; i < 4; i++ )
        this.data[Chunk.TYPE + i] = type.charCodeAt(i);
};


/*****
*
*   setCRC
*
*****/
Chunk.prototype.setCRC = function() {
    var size = this.data.length - 8;
    var crc = CRC32.getCRC(this.data, 4, size);
    
    this.storeInt4( this.data.length - 4, crc);
};


/*****  utility methods *****/

/*****
*
*   toString
*
*****/
Chunk.prototype.toString = function() {
    var data   = this.data;
    var length = data.length;
    var chars  = new Array(length);

    for ( var i = 0; i < length; i++ ) {
        var a = data[i].toString();
        var h = data[i].toString(16);
        var b;

        if ( 32 <= a && a < 127 )
            b = String.fromCharCode(data[i]);
        else
            b = ".";

        chars[i] = a + "\t\t" + h + "\t\t" + b;
    }

    return chars.join("\r\n");
};

