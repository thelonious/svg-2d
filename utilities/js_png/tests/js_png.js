/*****
*
*   The contents of this file were written by Kevin Lindsey
*   copyright 2002-2003 Kevin Lindsey
*
*   This file was compacted by jscompact
*   A Perl utility written by Kevin Lindsey (kevin@kevlindev.com)
*
*****/

Base64.encoding=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];
function Base64(){}
Base64.encode=function(data){var result=[];var ip57=Math.floor(data.length/57);var fp57=data.length%57;var ip3=Math.floor(fp57/3);var fp3=fp57%3;var index=0;var num;for(var i=0;i<ip57;i++){for(j=0;j<19;j++,index+=3){num=data[index]<<16|data[index+1]<<8|data[index+2];result.push(Base64.encoding[(num&0xFC0000)>>18]);result.push(Base64.encoding[(num&0x03F000)>>12]);result.push(Base64.encoding[(num&0x0FC0)>>6]);result.push(Base64.encoding[(num&0x3F)]);}result.push("\n");}for(i=0;i<ip3;i++,index+=3){num=data[index]<<16|data[index+1]<<8|data[index+2];result.push(Base64.encoding[(num&0xFC0000)>>18]);result.push(Base64.encoding[(num&0x03F000)>>12]);result.push(Base64.encoding[(num&0x0FC0)>>6]);result.push(Base64.encoding[(num&0x3F)]);}if(fp3==1){num=data[index]<<16;result.push(Base64.encoding[(num&0xFC0000)>>18]);result.push(Base64.encoding[(num&0x03F000)>>12]);result.push("==");}else if(fp3==2){num=data[index]<<16|data[index+1]<<8;result.push(Base64.encoding[(num&0xFC0000)>>18]);result.push(Base64.encoding[(num&0x03F000)>>12]);result.push(Base64.encoding[(num&0x0FC0)>>6]);result.push("=");}return result.join("");};
CRC32.VERSION=1.0;
CRC32.table=[
0x00000000,0x77073096,0xee0e612c,0x990951ba,0x076dc419,0x706af48f,0xe963a535,0x9e6495a3,
0x0edb8832,0x79dcb8a4,0xe0d5e91e,0x97d2d988,0x09b64c2b,0x7eb17cbd,0xe7b82d07,0x90bf1d91,
0x1db71064,0x6ab020f2,0xf3b97148,0x84be41de,0x1adad47d,0x6ddde4eb,0xf4d4b551,0x83d385c7,
0x136c9856,0x646ba8c0,0xfd62f97a,0x8a65c9ec,0x14015c4f,0x63066cd9,0xfa0f3d63,0x8d080df5,
0x3b6e20c8,0x4c69105e,0xd56041e4,0xa2677172,0x3c03e4d1,0x4b04d447,0xd20d85fd,0xa50ab56b,
0x35b5a8fa,0x42b2986c,0xdbbbc9d6,0xacbcf940,0x32d86ce3,0x45df5c75,0xdcd60dcf,0xabd13d59,
0x26d930ac,0x51de003a,0xc8d75180,0xbfd06116,0x21b4f4b5,0x56b3c423,0xcfba9599,0xb8bda50f,
0x2802b89e,0x5f058808,0xc60cd9b2,0xb10be924,0x2f6f7c87,0x58684c11,0xc1611dab,0xb6662d3d,
0x76dc4190,0x01db7106,0x98d220bc,0xefd5102a,0x71b18589,0x06b6b51f,0x9fbfe4a5,0xe8b8d433,
0x7807c9a2,0x0f00f934,0x9609a88e,0xe10e9818,0x7f6a0dbb,0x086d3d2d,0x91646c97,0xe6635c01,
0x6b6b51f4,0x1c6c6162,0x856530d8,0xf262004e,0x6c0695ed,0x1b01a57b,0x8208f4c1,0xf50fc457,
0x65b0d9c6,0x12b7e950,0x8bbeb8ea,0xfcb9887c,0x62dd1ddf,0x15da2d49,0x8cd37cf3,0xfbd44c65,
0x4db26158,0x3ab551ce,0xa3bc0074,0xd4bb30e2,0x4adfa541,0x3dd895d7,0xa4d1c46d,0xd3d6f4fb,
0x4369e96a,0x346ed9fc,0xad678846,0xda60b8d0,0x44042d73,0x33031de5,0xaa0a4c5f,0xdd0d7cc9,
0x5005713c,0x270241aa,0xbe0b1010,0xc90c2086,0x5768b525,0x206f85b3,0xb966d409,0xce61e49f,
0x5edef90e,0x29d9c998,0xb0d09822,0xc7d7a8b4,0x59b33d17,0x2eb40d81,0xb7bd5c3b,0xc0ba6cad,
0xedb88320,0x9abfb3b6,0x03b6e20c,0x74b1d29a,0xead54739,0x9dd277af,0x04db2615,0x73dc1683,
0xe3630b12,0x94643b84,0x0d6d6a3e,0x7a6a5aa8,0xe40ecf0b,0x9309ff9d,0x0a00ae27,0x7d079eb1,
0xf00f9344,0x8708a3d2,0x1e01f268,0x6906c2fe,0xf762575d,0x806567cb,0x196c3671,0x6e6b06e7,
0xfed41b76,0x89d32be0,0x10da7a5a,0x67dd4acc,0xf9b9df6f,0x8ebeeff9,0x17b7be43,0x60b08ed5,
0xd6d6a3e8,0xa1d1937e,0x38d8c2c4,0x4fdff252,0xd1bb67f1,0xa6bc5767,0x3fb506dd,0x48b2364b,
0xd80d2bda,0xaf0a1b4c,0x36034af6,0x41047a60,0xdf60efc3,0xa867df55,0x316e8eef,0x4669be79,
0xcb61b38c,0xbc66831a,0x256fd2a0,0x5268e236,0xcc0c7795,0xbb0b4703,0x220216b9,0x5505262f,
0xc5ba3bbe,0xb2bd0b28,0x2bb45a92,0x5cb36a04,0xc2d7ffa7,0xb5d0cf31,0x2cd99e8b,0x5bdeae1d,
0x9b64c2b0,0xec63f226,0x756aa39c,0x026d930a,0x9c0906a9,0xeb0e363f,0x72076785,0x05005713,
0x95bf4a82,0xe2b87a14,0x7bb12bae,0x0cb61b38,0x92d28e9b,0xe5d5be0d,0x7cdcefb7,0x0bdbdf21,
0x86d3d2d4,0xf1d4e242,0x68ddb3f8,0x1fda836e,0x81be16cd,0xf6b9265b,0x6fb077e1,0x18b74777,
0x88085ae6,0xff0f6a70,0x66063bca,0x11010b5c,0x8f659eff,0xf862ae69,0x616bffd3,0x166ccf45,
0xa00ae278,0xd70dd2ee,0x4e048354,0x3903b3c2,0xa7672661,0xd06016f7,0x4969474d,0x3e6e77db,
0xaed16a4a,0xd9d65adc,0x40df0b66,0x37d83bf0,0xa9bcae53,0xdebb9ec5,0x47b2cf7f,0x30b5ffe9,
0xbdbdf21c,0xcabac28a,0x53b39330,0x24b4a3a6,0xbad03605,0xcdd70693,0x54de5729,0x23d967bf,
0xb3667a2e,0xc4614ab8,0x5d681b02,0x2a6f2b94,0xb40bbe37,0xc30c8ea1,0x5a05df1b,0x2d02ef8d];
function CRC32(){}
CRC32.getCRC=function(data,offset,count){var crc=0xFFFFFFFF;var k;for(var i=0;i<count;i++){k=(crc^data[offset+i])&0xFF;crc=((crc>>8)&0x00FFFFFF)^CRC32.table[k];}return~crc;};
Chunk.VERSION=1.0;
Chunk.LENGTH=0;
Chunk.TYPE=Chunk.LENGTH+4;
Chunk.EOD=Chunk.TYPE+4;
function Chunk(length,type){if(arguments.length>0){if(isNaN(length))throw new Error("Chunk: length must be a number: "+length);if(length<Chunk.EOD)throw new Error("Chunk: length must be >= "+Chunk.EOD);var size=length+4;this.data=new Array(size);for(var i=0;i<size;i++)this.data[i]=0;this.setLength(length-4-4);this.setType(type);}}
Chunk.prototype.storeByte=function(offset,value){if(isNaN(offset)||isNaN(value))throw new Error("Chunk.storeByte: parameters must be numbers");if(offset<0||this.data.length<=offset)throw new Error("Chunk.storeByte: offset out of range: "+offset);if(value<0||0xFF<value)throw new Error("Chunk.storeByte: value out of range: "+value);this.data[offset]=value;};
Chunk.prototype.storeInt2=function(offset,value){if(isNaN(offset)||isNaN(value))throw new Error("Chunk.storeInt2: parameters must be numbers");if(offset<0||this.data.length<=offset)throw new Error("Chunk.storeInt2: offset out of range: "+offset);if(value<0||0xFFFF<value)throw new Error("Chunk.storeInt2: value out of range: "+value);this.data[offset++]=(value>>8)&0xFF;this.data[offset]=value&0xFF;};
Chunk.prototype.storeInt2Reversed=function(offset,value){if(isNaN(offset)||isNaN(value))throw new Error("Chunk.storeInt2Reversed: parameters must be numbers");if(offset<0||this.data.length<=offset)throw new Error("Chunk.storeInt2Reversed: offset out of range: "+offset);this.data[offset++]=value&0xFF;this.data[offset]=(value>>8)&0xFF;};
Chunk.prototype.storeInt4=function(offset,value){if(isNaN(offset)||isNaN(value))throw new Error("Chunk.storeInt4: parameters must be numbers");if(offset<0||this.data.length<=offset)throw new Error("Chunk.storeInt4: offset out of range: "+offset);this.data[offset++]=(value>>24)&0xFF;this.data[offset++]=(value>>16)&0xFF;this.data[offset++]=(value>>8)&0xFF;this.data[offset]=value&0xFF;};
Chunk.prototype.setLength=function(length){this.storeInt4(Chunk.LENGTH,length);};
Chunk.prototype.setType=function(type){if(typeof type!="string")throw new Error("Chunk.setType: parameter must be a string");if(type.length!=4)throw new Error("Chunk.setType: type must be 4 characters in length");for(var i=0;i<4;i++)this.data[Chunk.TYPE+i]=type.charCodeAt(i);};
Chunk.prototype.setCRC=function(){var size=this.data.length-8;var crc=CRC32.getCRC(this.data,4,size);this.storeInt4(this.data.length-4,crc);};
Chunk.prototype.toString=function(){var data=this.data;var length=data.length;var chars=new Array(length);for(var i=0;i<length;i++){var a=data[i].toString();var h=data[i].toString(16);var b;if(32<=a&&a<127)b=String.fromCharCode(data[i]);else b=".";chars[i]=a+"\t\t"+h+"\t\t"+b;}return chars.join("\r\n");};
IHDRChunk.VERSION=1.0;
IHDRChunk.WIDTH=Chunk.EOD;
IHDRChunk.HEIGHT=IHDRChunk.WIDTH+4;
IHDRChunk.BITDEPTH=IHDRChunk.HEIGHT+4;
IHDRChunk.COLORTYPE=IHDRChunk.BITDEPTH+1;
IHDRChunk.COMPRESSION=IHDRChunk.COLORTYPE+1;
IHDRChunk.FILTER=IHDRChunk.COMPRESSION+1;
IHDRChunk.INTERLACE=IHDRChunk.FILTER+1;
IHDRChunk.EOD=IHDRChunk.INTERLACE+1;
IHDRChunk.prototype=new Chunk();
IHDRChunk.prototype.constructor=IHDRChunk;
IHDRChunk.superclass=Chunk.prototype;
function IHDRChunk(width,height,bit_depth,color_type,compression,filter,interlace){if(arguments.length>0){IHDRChunk.superclass.constructor.call(this,IHDRChunk.EOD,"IHDR");this.setWidth(width);this.setHeight(height);this.setBitDepth(bit_depth);this.setColorType(color_type);this.setCompression(compression);this.setFilter(filter);this.setInterlace(interlace);}}
IHDRChunk.prototype.setWidth=function(width){this.storeInt4(IHDRChunk.WIDTH,width);};
IHDRChunk.prototype.setHeight=function(height){this.storeInt4(IHDRChunk.HEIGHT,height);};
IHDRChunk.prototype.setBitDepth=function(bit_depth){this.storeByte(IHDRChunk.BITDEPTH,bit_depth);};
IHDRChunk.prototype.setColorType=function(color_type){this.storeByte(IHDRChunk.COLORTYPE,color_type);};
IHDRChunk.prototype.setCompression=function(compression){this.storeByte(IHDRChunk.COMPRESSION,compression);};
IHDRChunk.prototype.setFilter=function(filter){this.storeByte(IHDRChunk.FILTER,filter);};
IHDRChunk.prototype.setInterlace=function(interlace){this.storeByte(IHDRChunk.INTERLACE,interlace);};
PLTEChunk.VERSION=1.0;
PLTEChunk.DATA=Chunk.EOD;
PLTEChunk.prototype=new Chunk();
PLTEChunk.prototype.constructor=PLTEChunk;
PLTEChunk.superclass=Chunk.prototype;
function PLTEChunk(lastIndex){if(arguments.length>0){if(isNaN(lastIndex))throw new Error("PLTEChunk: lastIndex must be a number");if(lastIndex<0||255<lastIndex)throw new Error("PLTEChunk: lastIndex must be between 0 and 255, inclusive");PLTEChunk.superclass.constructor.call(this,PLTEChunk.DATA+(3*(lastIndex+1)),"PLTE");this.lastIndex=lastIndex;}}
PLTEChunk.prototype.setColor=function(index,red,green,blue){if(isNaN(index)||isNaN(red)||isNaN(green)||isNaN(blue))throw new Error("PLTEChunk.setColor: all parameters must be numbers");if(index<0||this.lastIndex<index)throw new Error("PLTEChunk.setColor: index out of range: "+index);var offset=PLTEChunk.DATA+3*index;this.storeByte(offset++,red);this.storeByte(offset++,green);this.storeByte(offset,blue);};
IDATChunk.VERSION=1.0;
IDATChunk.DEFLATE=Chunk.EOD;
IDATChunk.DATA=IDATChunk.DEFLATE+2;
IDATChunk.prototype=new Chunk();
IDATChunk.prototype.constructor=IDATChunk;
IDATChunk.superclass=Chunk.prototype;
function IDATChunk(width,height,bytesPerPixel){if(arguments.length>0){if(bytesPerPixel==null)bytesPerPixel=1;if(isNaN(width)||isNaN(height)||isNaN(bytesPerPixel))throw new Error("IDATChunk: parameters must be numbers");if(width<0||height<0)throw new Error("IDATChunk: width and height must be positive numbers");if(bytesPerPixel<0||4<bytesPerPixel)throw new Error("IDATChunk: bytesPerPixel must be between 1 and 4, inclusive");this.width=width;this.height=height;this.bytesPerPixel=bytesPerPixel;if(bytesPerPixel>1){var blockSize=0xFFFF-5;var rowBytes=width*bytesPerPixel+1;var wholeRows=Math.floor(blockSize/rowBytes);if(wholeRows<height){lastRowBytes=blockSize-wholeRows*rowBytes;if(lastRowBytes<(bytesPerPixel+1)){throw new Error("IDATChunk: this case not yet implemented");}else{lastRowBytes--;blockSize-=lastRowBytes%bytesPerPixel;}}this.blockSize=blockSize+5;}else{this.blockSize=0xFFFF;}var image_data=(width*height)*bytesPerPixel+this.height;var block_headers=5*Math.floor((image_data+this.blockSize-1)/this.blockSize);var total=image_data+block_headers+4;IDATChunk.superclass.constructor.call(this,IDATChunk.DATA+total,"IDAT");this.initDeflateHeader();var offset=IDATChunk.DATA;for(var i=0;i<image_data;i+=this.blockSize){var block_size=this.blockSize;var last_block=0;if(i+this.blockSize>=image_data){block_size=image_data-i;last_block=1;}this.storeByte(offset,last_block);this.storeInt2Reversed(offset+1,block_size);this.storeInt2Reversed(offset+3,~block_size);offset+=this.blockSize+5;}}}
IDATChunk.prototype.initDeflateHeader=function(){var compressMethod=8;var windowSize=0x8000;var log2Size=Math.LOG2E*Math.log(windowSize);var windowLog=log2Size-8;var flevel=0;var header=((windowLog<<4)|compressMethod)<<8|(flevel<<6);header+=31-(header%31);this.setDeflateHeader(header);};
IDATChunk.prototype.setChecksum=function(){var base=65521;var nmax=5552;var s1=1;var s2=0;var k=nmax;for(var y=0;y<this.height;y++){var offset=this.getPixelOffset(0,y)-1;s1+=this.data[offset++];s2+=s1;if(--k==0){s1%=base;s2%=base;k=nmax;}for(var x=0;x<this.width;x++){var offset=this.getPixelOffset(x,y);for(var i=0;i<this.bytesPerPixel;i++){s1+=this.data[offset++];s2+=s1;if(--k==0){s1%=base;s2%=base;k=nmax;}}}}if(k!=nmax){s1%=base;s2%=base;}this.storeInt4(this.data.length-8,(s2<<16)|s1)};
IDATChunk.prototype.setDeflateHeader=function(header){if(isNaN(header))throw new Error("IDATChunk.setDefaultHeader: header must be a number");this.storeInt2(IDATChunk.DEFLATE,header);};
IDATChunk.prototype.setPixel=function(x,y,color){if(isNaN(color))throw new Error("IDATChunk.setPixel: parameters must be numbers");if(color<0||255<color)throw new Error("IDATChunk.setPixel: color out of range: "+color);if(arguments.length-2!=this.bytesPerPixel)throw new Error("IDATChunk.setPixel: not enough parameters to specify a color");var offset=this.getPixelOffset(x,y);for(var i=0;i<this.bytesPerPixel;i++){this.storeByte(offset++,arguments[2+i]);}};
IDATChunk.prototype.getPixel=function(x,y){return this.data[this.getPixelOffset(x,y)];};
IDATChunk.prototype.getPixelOffset=function(x,y){if(isNaN(x)||isNaN(y))throw new Error("IDATChunk.setPixel: parameters must be numbers");if(x<0||this.width<x)throw new Error("IDATChunk.getPixelOffset: x out of range: "+x);if(y<0||this.width<y)throw new Error("IDATChunk.getPixelOffset: y out of range: "+y);var index=y*this.width*this.bytesPerPixel+y+1+x*this.bytesPerPixel;var blocks_offset=5*Math.floor((index+this.blockSize)/this.blockSize);return IDATChunk.DATA+index+blocks_offset;};
IENDChunk.VERSION=1.0;
IENDChunk.prototype=new Chunk();
IENDChunk.prototype.constructor=IENDChunk;
IENDChunk.superclass=Chunk.prototype;
function IENDChunk(){IENDChunk.superclass.constructor.call(this,Chunk.EOD,"IEND");}
tRNSChunk.VERSION=1.0;
tRNSChunk.DATA=Chunk.EOD;
tRNSChunk.prototype=new Chunk();
tRNSChunk.prototype.constructor=tRNSChunk;
tRNSChunk.superclass=Chunk.prototype;
function tRNSChunk(lastIndex,entrySize){if(arguments.length>0){if(entrySize==null)entrySize=1;if(isNaN(lastIndex))throw new Error("tRNSChunk: lastIndex must be a number");if(lastIndex<0||255<lastIndex)throw new Error("tRNSChunk: lastIndex must be between 0 and 255, inclusive");if(isNaN(entrySize))throw new Error("tRNSChunk: entrySize must be null or a number");if(entrySize!=1&&entrySize!=2&&entrySize!=6)throw new Error("tRNSChunk: entrySize must equal 1, 2 or 6");var totalSize=tRNSChunk.DATA+((lastIndex+1)*entrySize);PLTEChunk.superclass.constructor.call(this,totalSize,"tRNS");this.entrySize=entrySize;this.lastIndex=lastIndex;}}
tRNSChunk.prototype.setAlpha=function(index,alpha){if(isNaN(index))throw new Error("tRNSChunk.setAlpha: index must be a number");if(index<0||this.lastIndex<index)throw new Error("tRNSChunk.setAlpha: index out of range: "+index);if(this.entrySize!=1)throw new Error("tRNSChunk.setAlpha: this function valid with index color images only");this.storeByte(tRNSChunk.DATA+index,alpha);};
tRNSChunk.prototype.setTransparencyValue=function(value){var lastIndex=(Png.ASV_FIX)?1:0;if(this.entrySize!=2||this.lastIndex!=lastIndex)throw new Error("tRNSChunk.setTransparencyValue: this function valid with greyscale images only");this.storeInt2(tRNSChunk.DATA,value);};
tRNSChunk.prototype.setTransparencyColor=function(red,green,blue){if(this.entrySize!=6||this.lastIndex!=0)throw new Error("tRNSChunk.setTransparencyColor: this function valid with color images only");this.storeInt2(tRNSChunk.DATA,red);this.storeInt2(tRNSChunk.DATA+2,green);this.storeInt2(tRNSChunk.DATA+4,blue);};
Png.VERSION=1.0;
Png.ASV_FIX=true;
function Png(width,height,useTransparency){this.chunks=[];}
Png.prototype.getBase64=function(){return Base64.encode(this.getData());};
Png.prototype.setColor=function(index,red,green,blue,alpha){this.palette.setColor(index,red,green,blue);if(alpha!=null&&this.alphas!=null)this.alphas.setAlpha(index,alpha);};
Png.prototype.getData=function(){var chunks=this.chunks;var length=chunks.length;var data=[];var header="\211PNG\r\n\032\n";for(var i=0;i<header.length;i++)data.push(header.charCodeAt(i));this.image.setChecksum();for(var i=0;i<length;i++){var chunk=chunks[i];chunk.setCRC();data=data.concat(chunk.data);}return data;};
Png.prototype.getHeight=function(){return this.image.height;};
Png.prototype.setPixel=function(x,y,color){this.image.setPixel(x,y,color);};
Png.prototype.getWidth=function(){return this.image.width;};
PngGreyscale.VERSION=1.0;
PngGreyscale.prototype=new Png();
PngGreyscale.prototype.constructor=PngGreyscale;
PngGreyscale.superclass=Png.prototype;
function PngGreyscale(width,height,useAlpha){if(arguments.length>0){if(useAlpha==null)useAlpha=false;PngGreyscale.superclass.constructor.call(this);var colorType=(useAlpha)?4:0;this.chunks.push(this.header=new IHDRChunk(width,height,8,colorType,0,0,0));this.transparency=null;this.useAlpha=useAlpha;if(useAlpha){this.chunks.push(this.image=new IDATChunk(width,height,2));}else{this.chunks.push(this.image=new IDATChunk(width,height));}this.chunks.push(this.end=new IENDChunk());}}
PngGreyscale.prototype.setPixel=function(x,y,value,alpha){if(this.useAlpha){this.image.setPixel(x,y,value,alpha);}else{this.image.setPixel(x,y,value);}};
PngGreyscale.prototype.setTransparencyValue=function(value){if(this.transparency==null){var lastIndex=(Png.ASV_FIX)?1:0;this.transparency=new tRNSChunk(lastIndex,2);this.chunks.splice(1,0,this.transparency);}this.transparency.setTransparencyValue(value);}
PngIndex.VERSION=1.0;
PngIndex.prototype=new Png();
PngIndex.prototype.constructor=PngIndex;
PngIndex.superclass=Png.prototype;
function PngIndex(width,height,useTransparency){if(arguments.length>0){PngIndex.superclass.constructor.call(this);this.chunks.push(this.header=new IHDRChunk(width,height,8,3,0,0,0));this.chunks.push(this.palette=new PLTEChunk(255));if(useTransparency){this.chunks.push(this.alphas=new tRNSChunk(255));}this.chunks.push(this.image=new IDATChunk(width,height));this.chunks.push(this.end=new IENDChunk());}}
PngTrueColor.VERSION=1.0;
PngTrueColor.prototype=new Png();
PngTrueColor.prototype.constructor=PngTrueColor;
PngTrueColor.superclass=Png.prototype;
function PngTrueColor(width,height,useAlpha){if(arguments.length>0){if(useAlpha==null)useAlpha=false;PngTrueColor.superclass.constructor.call(this);var colorType=(useAlpha)?6:2;this.chunks.push(this.header=new IHDRChunk(width,height,8,colorType,0,0,0));this.transparency=null;this.useAlpha=useAlpha;this.chunks.push(this.image=new IDATChunk(width,height,(useAlpha)?4:3));this.chunks.push(this.end=new IENDChunk());}}
PngTrueColor.prototype.setPixel=function(x,y,red,green,blue,alpha){if(this.useAlpha){this.image.setPixel(x,y,red,green,blue,alpha);}else{this.image.setPixel(x,y,red,green,blue);}};
PngTrueColor.prototype.setTransparencyColor=function(red,green,blue){if(this.transparency==null){this.transparency=new tRNSChunk(0,6);this.chunks.splice(1,0,this.transparency);}this.transparency.setTransparencyColor(red,green,blue);}