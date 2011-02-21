/*****
*
*   Png.js
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
Png.VERSION = 1.0;
Png.ASV_FIX = true;


/*****
*
*   constructor
*
*****/
function Png(width, height, useTransparency) {
    this.chunks = [];
}


/*****  get/set methods *****/

/*****
*
*   getBase64
*
*****/
Png.prototype.getBase64 = function() {
    return Base64.encode( this.getData() );
};


/*****
*
*   setColor
*
*****/
Png.prototype.setColor = function(index, red, green, blue, alpha) {
    this.palette.setColor(index, red, green, blue);

    if ( alpha != null && this.alphas != null )
        this.alphas.setAlpha(index, alpha);
};


/*****
*
*   getData
*
*****/
Png.prototype.getData = function() {
    var chunks = this.chunks;
    var length = chunks.length;
    var data   = [];

    // write header
    var header = "\211PNG\r\n\032\n";
    for ( var i = 0; i < header.length; i++ )
        data.push(header.charCodeAt(i));

    // prep image data checksum
    this.image.setChecksum();

    // set crc and collect chunk data
    for ( var i = 0; i < length; i++ ) {
        var chunk = chunks[i];

        chunk.setCRC();
        data = data.concat(chunk.data);
    }

    return data;
};


/*****
*
*   getHeight
*
*****/
Png.prototype.getHeight = function() {
    return this.image.height;
};


/*****
*
*   setPixel
*
*****/
Png.prototype.setPixel = function(x, y, color) {
    this.image.setPixel(x, y, color);
};


/*****
*
*   getWidth
*
*****/
Png.prototype.getWidth = function() {
    return this.image.width;
};
