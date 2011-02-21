/*****
*
*   Token.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   Token constructor
*
*****/
function Token(type, text) {
    if ( arguments.length > 0 ) {
        this.init(type, text);
    }
}


/*****
*
*   init
*
*****/
Token.prototype.init = function(type, text) {
    this.type = type;
    this.text = text;
};


/*****
*
*   typeis
*
*****/
Token.prototype.typeis = function(type) {
    return this.type == type;
}

