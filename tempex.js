(function(exports){

  var helper = function(m) { // TODO: dummy
    return "m=" + m;
  };

  exports.test = function(){ // TODO: dummy
    return 'hello world' + helper(" ... ")
  };

  exports.occurrences = function() {
    return []
  };

})(typeof exports === 'undefined'? this['TempEx']={}: exports);
