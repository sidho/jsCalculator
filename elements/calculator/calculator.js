var keys = document.getElementsByClassName('button');
var display = document.getElementById('display');
var operators = ['+', '-', '*', '/'];

// Stores the number that will be calculated
var savedNumber = null;
// Stores the operation to be performed
var savedOperation = null;
// Saves the last operation and operand, for when a user presses equals several
// times to repeat calculation
var operationCache = null;
var numberCache = null;

for (var i = 0; i < keys.length; i++){
  // Adds event listeners to each button
  keys[i].addEventListener("click", (function(e){
    var key = e.currentTarget.innerHTML;
    processKey(key);
    }.bind(this))
  )
}

var clearScreen = function () {
  display.innerHTML = "0";
};

var evaluate = function (firstValue, operation, secondValue) {
  if (operation === '/') {
    firstValue += ".0"; // Convert to a float before dividing
  }
  display.innerHTML = eval(firstValue + operation + secondValue);
}

var parseNumber = function(numberString){
  // Parses the string as a float if a decimal is found
  if (numberString.indexOf('.') === -1){
    return parseInt(numberString, 10);
  } else {
    return parseFloat(numberString, 10);
  }
}

var processKey = function(key){
  // Handles keypresses
  if (operators.indexOf(key) !== -1){
    processOperator(key);
  } else if (key === '\u221A'){
    processSquareRoot();
  } else if (key === 'C'){
    processClear();
  } else if (key === '.'){
    processDecimal();
  } else if (key === '='){
    processEquals();
  } else {
    processNumber(key);
  }
};

var processClear = function() {
  savedNumber = null;
  savedOperation = null;
  operationCache = null;
  numberCache = null;
  clearScreen();
};

var processDecimal = function() {
  // Places decimal if there isn't one already
  if (display.innerHTML.indexOf(".") === -1) {
    display.innerHTML += ".";
  }
};

var processEquals = function() {
  // Checks if the last operation performed was equals. If it was, it will either
  // repeat the square root, or repeat the previous operation.
  if (savedOperation === "=") {
    if (operationCache === '\u221A'){
      processSquareRoot();
    } else {
      evaluate(display.innerHTML, operationCache, numberCache);
    }
  } else if (savedOperation) {
    // Otherwise it performs the calculation of the stored number and saved operation.
    numberCache = display.innerHTML;
    operationCache = savedOperation;
    evaluate(savedNumber, savedOperation, display.innerHTML);
    savedNumber = null;
    savedOperation = "=";
  } else {
    return false;
  }
};

var processNumber = function(key) {
  if (savedOperation && savedNumber === null) {
    // If the last operation saved isn't equals, it saves the number currently
    // displayed before clearing it. If the last operation was an equals,
    // this means a new calculation is being performed, so the screen is cleared.
    if (savedOperation !== "=") {
      savedNumber = parseNumber(display.innerHTML);
    } else {
      savedOperation = null;
    }
    clearScreen();
  }

  if (display.innerHTML.length > 35) {
    return false; // prevents numbers from going past the display length
  } else if (display.innerHTML === "0") {
    if (key === "0"){
      return false; // does nothing if 0 is displayed and 0 is clicked
    } else {
      display.innerHTML = key // Overwrites the 0 on a cleared screen
    }
  } else {
    display.innerHTML += key;
  }
};

var processSquareRoot = function() {
  display.innerHTML = Math.sqrt(parseNumber(display.innerHTML));
  if (savedOperation === "=") {
    operationCache = '\u221A';
  }
};

var processOperator = function (key) {
  // If there is a saved operation that isn't an equals, and a saved number,
  // this will evaluate the saved values before continuing. This is for chaining
  // operations without pressing equals first.
  if (savedOperation && operators.indexOf(savedOperation) !== -1 && savedNumber !== null){
      evaluate(savedNumber, savedOperation, display.innerHTML);
      savedNumber = null;
    }
  savedOperation = key;
};
