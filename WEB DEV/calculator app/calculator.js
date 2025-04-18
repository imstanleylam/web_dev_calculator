class TreeNode{
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}
function infixToPostfix(expr){
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
    const output = [];
    const operators = [];
    const tokens = expr.match(/\d+(\.\d+)?|[()+\-*/]/g);
    tokens.forEach(token => {
        if (!isNaN(token)) {
            output.push(token);
            } 
            else if ("+-*/".includes(token)) {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                output.push(operators.pop());
            }
        operators.push(token);
        }
        else if (token === "("){
            operators.push(token);
        }
        else if (token === ")"){
            while (operators[operators.length - 1] !== "(") {
                output.push(operators.pop());
            }
        operators.pop();
        }
    });
    while (operators.length) {
        output.push(operators.pop());
    }
    return output;
}
function buildExpressionTree(postfixTokens){
    const stack = [];
    postfixTokens.forEach(token => {
        const node = new TreeNode(token);
        if ("+-*/".includes(token)){
            node.right = stack.pop();
            node.left = stack.pop();
        }
        stack.push(node);
    });
    return stack[0];
}
function evaluateTree(node){
    if (!node.left && !node.right) {
        return parseFloat(node.value);
    }
    const leftVal = evaluateTree(node.left);
    const rightVal = evaluateTree(node.right);
    switch(node.value){
        case "+": return leftVal + rightVal;
        case '-': return leftVal - rightVal;
        case '*': return leftVal * rightVal;
        case '/': return leftVal / rightVal;
    }
}


document.addEventListener("DOMContentLoaded", () =>{
    const numbersArr = Array.from(document.getElementsByClassName("number"));
    const operatorsArr = Array.from(document.getElementsByClassName("operator"));
    const parenthesisArr = Array.from(document.getElementsByClassName("parenthesis"));
    const decimalButton = document.querySelector(".decimal");
    const equalsButton = document.querySelector(".equals");
    const clearButton = document.querySelector(".clear");
    const deleteButton = document.querySelector(".delete");
    const numberStrs = "0123456789".split("");
    const data = {
        displayString: "0",
        appendStringNum:(newChar) =>{
            if (newChar === ".") {
                const parts = data.displayString.split(/[\+\-\*\/\(\)]/);
                if (parts[parts.length - 1].includes(".")) return;
        }
        if (numberStrs.includes(newChar) || newChar === ".") {
            if (data.displayString === "0") {
                data.displayString = "";
            }
            data.displayString += newChar;
        }
        data.updateDisplay();
    },
appendStringOperator: (newChar) => {
    const lastChar = data.displayString.slice(-1);
      if (numberStrs.includes(lastChar) || lastChar === ")") {
        data.displayString += newChar;
        data.updateDisplay();
      }
    },
appendStringParenthesis:(newChar) =>{
    const lastChar = data.displayString.slice(-1);
    if (newChar === ")") {
        const openCount = (data.displayString.match(/\(/g) || []).length;
        const closeCount = (data.displayString.match(/\)/g) || []).length;
        if (closeCount >= openCount) return;
        if (numberStrs.includes(lastChar) || lastChar === ")") return;
        }
    if (data.displayString === "0") {
        data.displayString = "";
        }
    data.displayString += newChar;
    data.updateDisplay();
    },
    evaluateExpression: () => {
        try {
            const postfix = infixToPostfix(data.displayString);
            const tree = buildExpressionTree(postfix);
            const result = evaluateTree(tree);
            data.displayString = result.toString();
        }
        catch (error) {
            data.displayString = "Error";
        }
        data.updateDisplay();
    },
    updateDisplay: () => {
        const display = document.getElementById("display");
        console.log("Updating display with:", data.displayString);
        display.innerText = data.displayString;
      }
};

data.updateDisplay();

numbersArr.forEach((btn) =>
  btn.addEventListener("click", () => {
    console.log("Number clicked:", btn.innerText); 
    data.appendStringNum(btn.innerText);
  })
);
operatorsArr.forEach((btn) => 
    btn.addEventListener("click", () => {
        data.appendStringOperator(btn.innerText);
    })
);
parenthesisArr.forEach((btn) => 
    btn.addEventListener("click", () => {
        data.appendStringParenthesis(btn.innerText);
    })
);
decimalButton.addEventListener("click", () => {
    data.appendStringNum(".");
    });
equalsButton.addEventListener("click", () => {
    data.evaluateExpression();
    });
clearButton.addEventListener("click", () => {
    data.displayString = "0";
    data.updateDisplay();
    });
deleteButton.addEventListener("click", () => {
    if (data.displayString.length > 1) {
        data.displayString = data.displayString.slice(0, -1);
    }
    else {
        data.displayString = "0";
    }
    data.updateDisplay();
    });
});