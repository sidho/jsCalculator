// A note about the calculator logic:
// I chose to emulate how a real calculator functions.
// A faster and easier way would be to just save all the numbers and operations
// as a string and perform eval() on it.

Polymer({
  theme: 'light',
  ready: function() {
    this.display = "0";
    // // Stores the number that will be calculated
    this.savedNumber = null;
    // // Stores the operation to be performed
    this.savedOperation = null;
    // Saves the last operation and operand, for when a user presses equals
    // again to repeat calculation
    this.operationCache = null;
    this.numberCache = null;
    this.operators = ['+', '-', '*', '/'];
  },
  clearScreen: function () {
    this.display = "0";
  },
  evaluate: function (firstValue, operation, secondValue) {
    if (operation === '/') {
      firstValue = parseFloat(firstValue, 10); // Convert to a float before dividing
    }
    this.display = eval(firstValue + operation + secondValue).toString();
  },
  parseNumber: function(numberString){
    // Parses the string as a float if a decimal is found
    if (numberString.indexOf('.') === -1){
      return parseInt(numberString, 10);
    } else {
      return parseFloat(numberString, 10);
    }
  },
  handleClick: function (e){
    var key = e.currentTarget.innerHTML;
    if (this.operators.indexOf(key) !== -1){
      this.processOperator(key);
    } else if (key === '\u221A'){
      this.processSquareRoot();
    } else if (key === 'C'){
      this.processClear();
    } else if (key === '.'){
      this.processDecimal();
    } else if (key === '='){
      this.processEquals();
    } else {
      this.processNumber(key);
    }
  },
  processClear: function() {
    this.savedNumber = null;
    this.savedOperation = null;
    this.operationCache = null;
    this.numberCache = null;
    this.clearScreen();
  },
  processDecimal: function() {
    // Places decimal if there isn't one already
    if (this.display.indexOf(".") === -1) {
      this.display += ".";
    }
  },
  processEquals: function() {
    // Checks if the last operation performed was equals. If it was, it will either
    // repeat the square root, or repeat the previous operation.
    if (this.savedOperation === "=") {
      if (this.operationCache === '\u221A'){
        this.processSquareRoot();
      } else {
        this.evaluate(this.display, this.operationCache, this.numberCache);
      }
    } else if (this.savedOperation) {
      // Otherwise it performs the calculation of the stored number and saved operation.
      this.numberCache = this.display;
      this.operationCache = this.savedOperation;
      this.evaluate(this.savedNumber, this.savedOperation, this.display);
      this.savedNumber = null;
      this.savedOperation = "=";
    } else {
      return false;
    }
  },
  processNumber: function(key) {
    if (this.savedOperation && this.savedNumber === null) {
      // If the last operation saved isn't equals, it saves the number currently
      // displayed before clearing it. If the last operation was an equals,
      // this means a new calculation is being performed, so the screen is cleared.
      if (this.savedOperation !== "=") {
        this.savedNumber = this.parseNumber(this.display);
      } else {
        this.savedOperation = null;
      }
      this.clearScreen();
    }

    if (this.display.length > 35) {
      return false; // prevents numbers from going past the display length
    } else if (this.display === "0") {
      if (key === "0"){
        return false; // does nothing if 0 is displayed and 0 is clicked
      } else {
        this.display = key // Overwrites the 0 on a cleared screen
      }
    } else {
      this.display += key;
    }
  },
  processSquareRoot: function() {
    this.display = Math.sqrt(this.parseNumber(this.display)).toString();
    if (this.savedOperation === "=") {
      this.operationCache = '\u221A';
    }
  },
  processOperator: function (key) {
    // If there is a saved operation that isn't an equals, and a saved number,
    // this will evaluate the saved values before continuing. This is for chaining
    // operations without pressing equals first.
    if (this.savedOperation &&
        this.operators.indexOf(this.savedOperation) !== -1 &&
        this.savedNumber !== null) {
        this.evaluate(this.savedNumber, this.savedOperation, this.display);
        this.savedNumber = null;
    }
    this.savedOperation = key;
  }
});
