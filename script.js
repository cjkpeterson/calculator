const buttonsEl = document.querySelector("#buttons");
const buttonsGrandchildren = Array.from(buttonsEl.children).flatMap(child => 
    Array.from(child.children));
const buttons = Object.fromEntries(buttonsGrandchildren.map(button => [button.id, button]));

// What this will do, is given the #buttons element, create an array of all it's grandchildren,
// e.g. the buttons, and then convert it into a dictionary, which each button can be selected
// using it's id as the key (for example console.log(buttons.equals); would log the 'equals'
// button).

const display = document.querySelector("#display");

let current = null;
let tempStore = 0;
let operation = null;
let decimal = 0;
let deciStore = 0;

display.textContent = "0.";

function isRepeatingDecimal(numerator, denominator) {
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  // Reduce the fraction
  const divisor = gcd(numerator, denominator);
  denominator /= divisor;

  // Remove all 2s and 5s
  while (denominator % 2 === 0) denominator /= 2;
  while (denominator % 5 === 0) denominator /= 5;

  // If anything remains, it's repeating
  return denominator !== 1;
}

function countDecimalPlaces(num) {
  const str = num.toString();
  if (str.includes('.')) {
    return str.split('.')[1].length;
  }
  return 0;
}
function fixCurrent() {
    current = parseFloat(current.toFixed(decimal));
}


function dotCheck() { //helper function, to add a dot to the display if necessary
    if (current % 1 == 0 && !decimal) { // If it's whole...
        console.log("adding .");
        if (current) {
            display.textContent = current + ".";
        }
        decimal = 0;
    }
}

function quickStore() {
    if (!(current === null)) { //If it's null we don't need to store it, and there might be something already being stored.
        tempStore = current;
        current = null;
        deciStore = decimal;
    }
    decimal = 0;
    operation = null;
}

function doOper() {
    if (operation == "add") {
        current += tempStore;
        decimal = Math.max(decimal, deciStore);
    }
    else if (operation == "subtract") {
        current = tempStore - current;
        decimal = Math.max(decimal, deciStore);
    }
    else if (operation == "multiply") {
        current *= tempStore;
        decimal += deciStore;

    }
    else if (operation == "divide") {
        if (isRepeatingDecimal(tempStore, current)) {
            current = tempStore / current;
            decimal = countDecimalPlaces(current);
        }
        else {
            current = tempStore / current;
            decimal += deciStore;
        }
        
    }
    decimal = Math.min(decimal, countDecimalPlaces(current));
    console.log(decimal);
    fixCurrent();
    deciStore = 0;
    tempStore = null;
    display.textContent = current;

}

function buttonPress(e) {
    const targ = e.target; //which button was pressed?
    if (targ.classList.contains("num")) {
        console.log("pressed a number!");
        let num = parseInt(targ.id.slice(1));
        if (current === null) {
            decimal = null;
            current = num;
        }
        else if (!(decimal === null)) {
            current += num * (0.1 ** ++decimal);
            fixCurrent();
        }
        else {
            current = current * 10 + num;
        }
        display.textContent = current;
        
    }
    else if (targ.classList.contains("oper")) {
        console.log("pressed an operator!");
        if (operation && !(current === null)) { //If we already have a previous operation, we have to do that first.
            doOper();
        }
        dotCheck();
        quickStore();
        operation = targ.id;
    }
    else if (targ.id == "equals") {
        console.log("pressed equals");
        if (operation && !(tempStore === null) && !(current === null)) {
            doOper();
            console.log("valid equals");
        }
        dotCheck();
        quickStore();
    }
    else if (targ.id == "decimal") {
        console.log("valid decimal");
        if (current === null) { //Always set to 0
            current = 0;
            decimal = null;
        }
        if (decimal === null) {
            decimal = 0;
        }
        display.textContent = current + ".";
        
    }
    else if (targ.id == "delete") {
        if (!(current === null)) {
            if (decimal === 0) {
                decimal = null;
            }
            else if (decimal) {
                decimal--;
                console.log(decimal);
                current = Math.floor(current * (10 ** (decimal))) / (10 ** (decimal));
            }
            else {
                current = Math.floor(current / 10);
                decimal = null;
            }
            display.textContent = current;
            if (decimal === 0) {
                display.textContent += ".";
            }
        }
    }
    else if (targ.id == "clear") {
        current = 0; //We want this to be zero, so that it will be swapped into tempStore and we reset fully
        quickStore();
        deciStore = 0;
        display.textContent = "0.";
    }
}

buttonsEl.addEventListener("click", buttonPress);