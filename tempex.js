(function(exports){

  var Once = function(when) {
    this.when = when;
  };
  Once.prototype.nextOccurrence = function(onOrAfter) {
    if (this.when >= onOrAfter) {
      return this.when;
    } else {
      return null;
    }
  };
  Once.prototype.isOccurring = function(event, aDate) {
    return false;
  };
  exports.Once = Once;

  var nextOccurrence = exports.nextOccurrence = function(expressions, onOrAfter) {
    var theNext = null;
    for (var i = 0; i < expressions.length; i++) {
      var occurrence = expressions[0].nextOccurrence(onOrAfter);
      if (occurrence < onOrAfter) {
        throw "invalid next occurrence: " + occurrence + " is less than " + onOrAfter;
      }
      if (!theNext || occurrence < theNext) {
        theNext = occurrence;
      }
    }
    return theNext;
  }

  var beginningOfDay = function(d) {
  }

  var addDays = function(d) {
  }

  exports.occurrences = function(expressions, from, to) {
    if (!expressions || expressions.length == 0) {
      return [];
    } else {
      var result = [];
      while(from <= to) {
        console.log("from=" + from);
        occurrence = nextOccurrence(expressions, from);
        console.log("occurrence=" + occurrence);
        if(occurrence > to) {
          break;
        }
        result.push(occurrence);
        from = beginningOfDay(addDays(occurrence, 1));
      }
      return result;
    }
  };

})(typeof exports === 'undefined'? this['TempEx']={}: exports);
