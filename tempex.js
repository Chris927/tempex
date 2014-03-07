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
      var occurrence = expressions[i].nextOccurrence(onOrAfter);
      if (occurrence && occurrence < onOrAfter) {
        throw "invalid next occurrence: " + occurrence + " is less than " + onOrAfter;
      }
      if (!theNext || occurrence && occurrence < theNext) {
        theNext = occurrence;
      }
    }
    return theNext;
  }

  var beginningOfDay = function(date) {
    var r = new Date(date);
    r.setHours(0);
    r.setMinutes(0);
    r.setSeconds(0);
    r.setMilliseconds(0);
    return r;
  }

  var addDays = function(date, days) {
    var r = new Date(date);
    r.setDate(r.getDate() + days);
    return r;
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
        if(!occurrence || occurrence > to) {
          break;
        }
        result.push(occurrence);
        from = beginningOfDay(addDays(occurrence, 1));
      }
      return result;
    }
  };

})(typeof exports === 'undefined'? this['TempEx']={}: exports);
