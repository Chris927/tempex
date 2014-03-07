(function(exports){

  var Once = function() {};
  Once.prototype.isOccurring = function(event, aDate) {
    return false;
  };
  exports.Once = Once;

  var Occurrence = function(scheduleElement, when) {
    this.scheduleElement = scheduleElement;
    this.when = when;
  };

  exports.occurrences = function(scheduleElement) {
    if (!scheduleElement.expressions || scheduleElement.expressions.length == 0) {
      return [];
    } else {
      return [ new Occurrence(scheduleElement, scheduleElement.expressions[0].when) ]
    }
  };

})(typeof exports === 'undefined'? this['TempEx']={}: exports);
