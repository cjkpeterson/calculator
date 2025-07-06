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
let negative = false;

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

function reverseSign(n) {
    return n === 0 ? n : -n;
}

function fixCurrent() {
    current = parseFloat(current.toFixed(decimal));
}


function dotCheck() { //helper function, to display temp, w/ dot if necessary
    if (tempStore % 1 == 0 && !deciStore) { // If it's whole...
        console.log("adding .");
        display.textContent = tempStore + ".";
    }
    else {
        display.textContent = tempStore;
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
    negative = false;
    dotCheck();
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
        else {
            current = Math.abs(current);
            if (!(decimal === null)) {
                current += num * (0.1 ** ++decimal);
                fixCurrent();
            }
            else {
                current = current * 10 + num;
            }

            if (negative) {
                current = -current;
            }
        }
        display.textContent = current;
        
    }
    else if (targ.classList.contains("oper")) {
        console.log("pressed an operator!");
        if (operation && !(current === null)) { //If we already have a previous operation, we have to do that first.
            doOper();
        }
        quickStore();
        operation = targ.id;
    }
    else if (targ.id == "equals") {
        console.log("pressed equals");
        if (operation && !(tempStore === null) && !(current === null)) {
            doOper();
            console.log("valid equals");
        }
        
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
            display.textContent = current + ".";
        }
        
        
    }
    else if (targ.id == "switch") {
        console.log("valid switch signs");
        if (current === null) {
            tempStore = reverseSign(tempStore);
            dotCheck();
        }
        else {
            negative = !negative;
            current = -current;
            display.textContent = "";
            if ((current === -0) && negative) {
                display.textContent = "-";
            }
            display.textContent += current;
            if (decimal === 0) {
                display.textContent += ".";
            }
        }
    }

    else if (targ.id == "delete") {
        if (!(current === null)) {
            current = Math.abs(current);
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
            
            if (negative) {
                if (current === 0) {
                    negative = false;
                }
                else {
                    current = -current;
                }
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