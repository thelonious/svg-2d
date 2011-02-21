/*****
*
*   Array.js
*
*   copyright 2002-2004, Kevin Lindsey
*
*   Add additional methods to the built-in Array object
*
*****/

/*****
*
*   foreach
*
*****/
Array.prototype.foreach = function(func) {
    var length = this.length;

    for ( var i = 0; i < length; i++ ) {
        func(this[i]);
    }
};


/*****
*
*   grep
*
*****/
Array.prototype.grep = function(func) {
    var length = this.length;
    var result = [];

    for ( var i = 0; i < length; i++ ) {
        var elem = this[i];

        if ( func(elem) ) {
            result.push(elem);
        }
    }

    return result;
};


/*****
*
*   map
*
*****/
Array.prototype.map = function(func) {
    var length = this.length;
    var result = [];

    for ( var i = 0; i < length; i++ ) {
        result.push( func(this[i]) );
    }

    return result;
};


/*****
*
*   min
*
*****/
Array.prototype.min = function() {
    var length = this.length;
    var min = this[0];

    for ( var i = 0; i < length; i++ ) {
        var elem = this[i];

        if ( elem < min ) min = elem;
    }

    return min;
}


/*****
*
*   max
*
*****/
Array.prototype.max = function() {
    var length = this.length;
    var max = this[0];

    for ( var i = 0; i < length; i++ )
        var elem = this[i];
        
        if ( elem > max ) max = elem;

    return max;
}
