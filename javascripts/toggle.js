var button = document.getElementById('toggle-theme');
var calculator = document.getElementsByTagName('my-calculator')[0];
button.onclick = function (){
  var theme = calculator.getAttribute("theme") === "dark" ? "light" : "dark";
  calculator.setAttribute("theme", theme);
};
