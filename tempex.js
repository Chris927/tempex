(function(exports){

  var beginningOfMonth = exports.beginningOfMonth = function(date) {
    var r = beginningOfDay(date);
    r.setDate(1);
    return r;
  };

  /** Warning: only safe to use if day of month is less than 28...
   */
  var addMonths = function(date, months) {
    var d = new Date(date);
    d.setMonth(date.getMonth() + months);
    return d;
  };

  var beginningOfDay = exports.beginningOfDay = function(date) {
    var r = new Date(date);
    r.setHours(0);
    r.setMinutes(0);
    r.setSeconds(0);
    r.setMilliseconds(0);
    return r;
  }

  var Once = function Once(when) {
    this.when = when;
  };
  Once.prototype.nextOccurrence = function(onOrAfter) {
    if (this.when >= onOrAfter) {
      return this.when;
    } else {
      return null;
    }
  };
  Once.prototype.isOccurring = function(aDate) {
    return beginningOfDay(aDate) == beginningOfDay(this.when);
  };
  /**
   * Specifies an expression that matches one particular day.
   * @param {Date} when = the day matched
   */
  exports.once = function(when) {
    return new Once(when);
  }

  var OnOrAfter = function OnOrAfter(firstDay) {
    this.firstDay = firstDay;
  };
  OnOrAfter.prototype.isOccurring = function(aDate) {
    return this.firstDay <= beginningOfDay(aDate);
  };
  OnOrAfter.prototype.nextOccurrence = function(onOrAfter) {
    if (this.firstDay >= onOrAfter) {
      return this.firstDay;
    } else {
      return onOrAfter;
    }
  };
  /**
   * Specifies an expression that matches a day and all days after that day.
   * @param {Date} firstDay - The first day to match
   */
  exports.onOrAfter = function(firstDay) {
    return new OnOrAfter(firstDay);
  }

  /**
   * Specifies an expression that matches a day and all days before that day.
   * @param {Date} lastDay - The last day to match
   */
  var NegationOf = function NegationOf(expr) {
    this.expr = expr;
  }
  NegationOf.prototype.nextOccurrence = function(onOrAfter, butNotLaterThan) {
    var when = beginningOfDay(onOrAfter);
    while (when <= butNotLaterThan) {
      var next = this.expr.nextOccurrence(when, butNotLaterThan);
      if (next > when)
        return when;
      when = addDays(next, 1);
    }
    return null;
  }
  exports.onOrBefore = function(lastDay) {
    return new NegationOf(new OnOrAfter(addDays(lastDay, 1)));
  }

  var OnWeekdays = function OnWeekdays( /* e.g. [ 0, 2, 3 ] for Sun,Tue,Wed */ days) {
    this.days = days;
  }
  OnWeekdays.prototype.isOccurring = function(aDate) {
    var day = aDate.getDay();
    for (var i = 0; i < this.days.length; i++) {
      if (this.days[i] == day) {
        return true;
      }
    }
    return false;
  };
  OnWeekdays.prototype.nextOccurrence = function(onOrAfter) {
    var onOrAfterDay = onOrAfter.getDay();
    var daysToAdd = null;
    for (var i = 0; i < this.days.length; i++) {
      var deltaUntilDay = this.days[i] - onOrAfterDay;
      while (deltaUntilDay < 0) {
        deltaUntilDay += 7;
      }
      if (daysToAdd === null) {
        daysToAdd = deltaUntilDay;
      } else {
        daysToAdd = Math.min(daysToAdd, deltaUntilDay);
      }
    }
    return addDays(onOrAfter, daysToAdd);
  };
  /**
   * Specifies an expression that matches days in the week, e.g. Mondays and
   * Wednesday, but not all other week days.
   * @param {Array} days - Array of integers describing the days of the week,
   * e.g. [0, 2, 3] will represent Sundays, Tuesdays and Wednesdays
   */
  exports.onWeekdays = function(days /* e.g. [ 0, 2, 3 ] for Sun,Tue,Wed */) {
    return new OnWeekdays(days);
  }
  
  /**
   * 'rolling over' means to add 12 to each month in months that's less than month...
   */
  var getMonthsRolledOver = function(months, month) {
    var result = [];
    for (var i = 0; i < months.length; i++) {
      var rolledOverMonth = months[i] < month ? months[i] + 12 : months[i];
      result.push(rolledOverMonth);
    }
    return result;
  }

  InMonths = function InMonths(months) {
    this.months = months;
  }
  InMonths.prototype.nextOccurrence = function(onOrAfter) {
    var month = onOrAfter.getMonth();
    var firstOfMonth = beginningOfMonth(onOrAfter);
    var monthsRolledOver = getMonthsRolledOver(this.months, month);
    var monthsToAdd = Math.min.apply(null, monthsRolledOver) - month;
    if (monthsToAdd > 0) {
      return addMonths(firstOfMonth, monthsToAdd);
    } else {
      return onOrAfter;
    }
  };
  /** Match one or multiple months.
   * @param {Array} months - array of integers specifying months to match. 0=January, 1=February, etc.
   */
  exports.months = function(months) {
    return new InMonths(months);
  };

  var DayInMonth = function DayInMonth(day) {
    this.day = day;
  }
  DayInMonth.prototype.nextOccurrence = function(onOrAfter) {
    if (onOrAfter.getDate() <= this.day) {
      return addDays(onOrAfter, this.day - onOrAfter.getDate());
    } else {
      var next = addMonths(beginningOfMonth(onOrAfter), 1);
      next.setDate(this.day);
      return next;
    }
  };
  /** Matches based on the calendar day in the month
   * @param {int} day - the Day in the month, e.g. 11 for the 11th day of the month
   */
  exports.dayInMonth = function(day) {
    return new DayInMonth(day);
  }

  DayOfWeekInMonth = function DayOfWeekInMonth(day, nth) {
    this.day = day;
    this.nth = nth;
  };
  DayOfWeekInMonth.prototype.nextOccurrence = function(onOrAfter) {
    var startOfThisMonth = beginningOfMonth(onOrAfter);
    var daysToSkip = this.day < startOfThisMonth.getDay() ? (7 - startOfThisMonth.getDay()) : 0;
    var daysToAdd = this.day - addDays(startOfThisMonth, daysToSkip).getDay();
    daysToAdd += (this.nth - 1) * 7;
    var targetDateThisMonth = addDays(startOfThisMonth, daysToSkip + daysToAdd);
    if (targetDateThisMonth < onOrAfter) {
      return this.nextOccurrence(addMonths(startOfThisMonth, 1));
    } else {
      return targetDateThisMonth;
    }
  }
  /** Matches based on the day of the week in the month.
   * @param {int} day - the day of the week, 0=Sunday, 1=Monday, etc.
   * @param {int} nth - If 1, it will match the first day (e.g. first Sunday)
   * of the month, if 2 it will be the second, etc.
   */
  exports.dayOfWeekInMonth = function(day, nth) {
    return new DayOfWeekInMonth(day, nth);
  };

  var maxNextOccurrenceOf = function(expressions, onOrAfter) {
    if (onOrAfter === null) {
      throw "onOrAfter cannot be null";
    }
    var maxNext = null;
    for (var i = 0; i < expressions.length; i++) {
      var next = expressions[i].nextOccurrence(onOrAfter);
      if (next < onOrAfter) {
        throw("nextOccurrence cannot be smaller than 'onOrAfter'")
      }
      if (next === null) {
        return null; // no next occurrence for this expression, so no maxNext
      }
      if (maxNext === null || maxNext < next) {
        maxNext = next;
      }
    }
    return maxNext;
  };

  var allAreOccurringOn = function(expressions, when) {
    if (when === null) {
      return false;
    }
    for (var i = 0; i < expressions.length; i++) {
      if (!expressions[i].isOccurring(when)) {
        return false;
      }
    }
    return true;
  };

  var IntersectionOf = function IntersectionOf(expr1, expr2) {
    this.expressions = [ expr1, expr2 ];
  };
  IntersectionOf.prototype.nextOccurrence = function(onOrAfter, butNotLaterThan) {
    while (onOrAfter <= butNotLaterThan) {
      var nextOfAll = maxNextOccurrenceOf(this.expressions, onOrAfter);
      if (nextOfAll === null) {
        return null;
      }
      if (allAreOccurringOn(this.expressions, nextOfAll)) {
        return nextOfAll;
      }
      onOrAfter = addDays(nextOfAll, 1);
    }
  };
  /** Specifies an intersection of two expression. Only those days will match this expression that match both (sub) expressions.
   * @param {expression} expr1 - first expression
   * @param {expression} expr2 - second expression
   */
  exports.intersectionOf = function(expr1, expr2) {
    return new IntersectionOf(expr1, expr2);
  };

  var nextOccurrence = exports.nextOccurrence = function(expressions, onOrAfter, butNotLaterThan) {
    var theNext = null;
    for (var i = 0; i < expressions.length; i++) {
      var occurrence = expressions[i].nextOccurrence(onOrAfter, butNotLaterThan);
      if (occurrence && occurrence < onOrAfter) {
        throw "invalid next occurrence: " + occurrence + " is less than " + onOrAfter;
      }
      if (!theNext || occurrence && occurrence < theNext) {
        theNext = occurrence;
      }
    }
    return theNext;
  }

  /** Adds (or subtracts) days from a date given.
   * @param {Date} aDate - the date to add days to
   * @param {int} howMany - the amount of days to add
   */
  var addDays;
  exports.addDays = addDays = function(date, days) {
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
        occurrence = nextOccurrence(expressions, from, to);
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
