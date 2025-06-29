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
let tempStore = null;
let operation = null;
let writeOver = false; //Bool to determine if we should "write over" current display,
//like after an equals

display.textContent = 0;

function doOper() {
    if (operation == "add") {
     current += tempStore;
    }
    else if (operation == "subtract") {
     current = tempStore - current;
    }
    else if (operation == "multiply") {
     current *= tempStore;
    }
    else if (operation == "divide") {
     current = tempStore / current;
    }
    tempStore = null;
    display.textContent = current;

}

function buttonPress(e) {
    const targ = e.target; //which button was pressed?
    if (targ.classList.contains("num")) {
        console.log("pressed a number!");
        let num = parseInt(targ.id.slice(1));
        if (writeOver || current == null) {
            current = num;
            writeOver = false;
        }
        else {
            current = current * 10 + num;
        }
        display.textContent = current;
        
    }
    else if (targ.classList.contains("oper")) {
        console.log("pressed an operator!");
        if (operation) { //If we already have a previous operation, we have to do that first.
            doOper();
        }
        operation = targ.id;
        tempStore = current;
        current = null;

    }
    else if (targ.id == "equals") {
        console.log("pressed equals");
        if (operation && !(tempStore === null)) {
            doOper();
            console.log("valid equals");
        }
        else {
            console.log("invalid equals");
        } //Need to make number erasable after equals hit
        operation = null;
        writeOver = true;
    }
    else if (targ.id == "delete") {
        if (!(writeOver) && (!(current == null))) {
            current = Math.floor(current / 10);
            display.textContent = current;
        }
    }
    else if (targ.id == "clear") {
        current = null;
        tempStore = null;
        operation = null;
        writeOver = false;
        display.textContent = "0";
    }
}

buttonsEl.addEventListener("click", buttonPress);