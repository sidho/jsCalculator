var keys = document.getElementsByClassName('button');
var display = document.getElementById('display');

for (var i = 0; i < keys.length; i++){
  keys[i].addEventListener("click", (function(e){
    var key = e.currentTarget.innerHTML;
    processKey(key);
    }.bind(this))
  )
}

var processKey = function(key){
  var operators = ["+", "-", "*", "/"]
  switch (key) {
    case '+':
      console.log("adding");
      break;
    case '-':
      console.log("subtracting");
      break;
    case '*':
      console.log("multiplying");
      break;
    case '/':
      console.log("dividing");
      break;
    case '\u221A':
      console.log("square root");
      break;
    case '=':
      console.log("equals");
      break;
    case '.':
      console.log("decimal");
      break;
    case 'C':
      console.log("clear");
      break;
    default:
      console.log(key);
  }
  // display.innerHTML += key;
}
