/*****
*
*   AbsolutePathSegment.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   constructor
*
*****/
function AbsolutePathSegment(command, params, owner, previous) {
    if ( arguments.length > 0 )
        this.init(command, params, owner, previous);
};


/*****
*
*   init
*
*****/
AbsolutePathSegment.prototype.init = function(command, params, owner, previous) {
    this.command  = command;
    this.owner    = owner;
    this.previous = previous;
    this.handles  = new Array();

    var index = 0;
    while ( index < params.length ) {
        var handle = new Handle(params[index], params[index+1], owner);

        this.handles.push( handle );
        index += 2;
    }
};


/*****
*
*   realize
*
*****/
AbsolutePathSegment.prototype.realize = function() {
    for ( var i = 0; i < this.handles.length; i++ ) {
        var handle = this.handles[i];

        handle.realize();
        handle.show(false);
    }
};


/*****
*
*   unrealize
*
*****/
AbsolutePathSegment.prototype.unrealize = function() {
    for ( var i = 0; i < this.handles.length; i++ ) {
        this.handles[i].unrealize();
    }
};


/*****
*
*   registerHandles
*
*****/
AbsolutePathSegment.prototype.registerHandles = function() {
    for ( var i = 0; i < this.handles.length; i++ ) {
        mouser.register( this.handles[i] );
    }
};


/*****
*
*   unregisterHandles
*
*****/
AbsolutePathSegment.prototype.unregisterHandles = function() {
    for ( var i = 0; i < this.handles.length; i++ ) {
        mouser.unregister( this.handles[i] );
    }
};


/*****
*
*   selectHandles
*
*****/
AbsolutePathSegment.prototype.selectHandles = function(select) {
    for ( var i = 0; i < this.handles.length; i++ ) {
        this.handles[i].select(select);
    }
};


/*****
*
*   showHandles
*
*****/
AbsolutePathSegment.prototype.showHandles = function(state) {
    for ( var i = 0; i < this.handles.length; i++ ) {
        this.handles[i].show(state);
    }
};


/*****
*
*   toString
*
*****/
AbsolutePathSegment.prototype.toString = function() {
    var points  = new Array();
    var command = "";
    
    if ( this.previous == null || this.previous.constructor != this.constuctor )
        command = this.command;

    for ( var i = 0; i < this.handles.length; i++ ) {
        points.push( this.handles[i].point.toString() );
    }

    return command + points.join(" ");
};


/*****
*
*   get/set methods
*
*****/

/*****
*
*   getLastPoint
*
*****/
AbsolutePathSegment.prototype.getLastPoint = function() {
    return this.handles[this.handles.length - 1].point;
};


/*****
*
*   getIntersectionParams
*
*****/
AbsolutePathSegment.prototype.getIntersectionParams = function() {
    return null;
};
