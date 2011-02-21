/*****
*
*   EventHandler.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   class variables
*
*****/
EventHandler.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function EventHandler() {
    this.init();
};


/*****
*
*   init
*
*****/
EventHandler.prototype.init = function() {
    // abstract method
};


/*****
*
*   handleEvent
*
*****/
EventHandler.prototype.handleEvent = function(e) {
    if ( this[e.type] == null )
        throw new Error("Unsupported event type: " + e.type);

    this[e.type](e);
};

