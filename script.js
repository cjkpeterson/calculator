const buttonsEl = document.querySelector("#buttons");
const buttonsGrandchildren = Array.from(buttonsEl.children).flatMap(child => 
    Array.from(child.children));
const buttons = Object.fromEntries(buttonsGrandchildren.map(button => [button.id, button]));

// What this will do, is given the #buttons element, create an array of all it's grandchildren,
// e.g. the buttons, and then convert it into a dictionary, which each button can be selected
// using it's id as the key (for example console.log(buttons.equals); would log the 'equals'
// button).

const display = document.querySelector("#display");

let input1 = 0;
let input2 = null;
let operation = null;
let writeOver = false; //Bool to determine if we should "write over" current display,
//like after an equals

display.textContent = input1;

function doOper() {
    if (operation == "add") {
        input1 += input2;
    }
    else if (operation == "subtract") {
        input1 -= input2;
    }
    else if (operation == "multiply") {
        input1 *= input2;
    }
    else if (operation == "divide") {
        input1 /= input2;
    }
    input2 = null;
    // operation = null; 
    // Moving out, as not necessary with more opers, always necessary with "="
    display.textContent = input1;

}

function buttonPress(e) {
    const targ = e.target; //which button was pressed?
    if (targ.classList.contains("num")) {
        console.log("pressed a number!");
        let num = parseInt(targ.id.slice(1));
        if (operation) {
            if (!(input2)) {
                input2 = 0;
            }
            input2 = input2 * 10 + num;
            display.textContent = input2;
        }
        else {
            input1 = input1 * 10 + num;
            if (writeOver) {
                input1 = num;
                writeOver = false;
            }
            display.textContent = input1;
        }

    }
    else if (targ.classList.contains("oper")) {
        console.log("pressed an operator!");
        if (operation) { //If we already have a previous operation, we have to do that first.
            doOper();
        }
        operation = targ.id;
    }
    else if (targ.id == "equals") {
        console.log("pressed equals");
        if (operation && !(input2 === null)) {
            doOper();
            console.log("valid equals");
        }
        else {
            console.log("invalid equals");

        } //Need to make number erasable after equals hit
        operation = null;
        writeOver = true;
    }
}

buttonsEl.addEventListener("click", buttonPress);