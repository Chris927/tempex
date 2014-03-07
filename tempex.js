(function(exports){

  var Once = function(when) {
    this.when = when;
  };
  Once.prototype.isOccurring = function(event, aDate) {
    return false;
  };
  exports.Once = Once;

  var Occurrence = function(when) {
    this.when = when;
  };
  Occurrence.prototype.getWhen = function() {
    return this.when;
  }

  exports.nextOccurrence = function() {
  }

  exports.occurrences = function(expressions) {
    if (!expressions || expressions.length == 0) {
      return [];
    } else {
      var result = [];
      for (var i = 0; i < expressions.length; i++) {
        var expr = expressions[i];
        result.push(new Occurrence(expr.when));
      }
      return result;
    }
  };

})(typeof exports === 'undefined'? this['TempEx']={}: exports);
