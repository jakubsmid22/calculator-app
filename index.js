const buttons = document.querySelectorAll("[role='button']");
const display = document.getElementById("displayBottom");
const displayTop = document.getElementById("displayTop");
const soundEffect = document.getElementById("clickSoundEffect");
let topValue = 0;
let bottomValue = 0;
let negativeNum;
let bottomNumberBigger;
let bottomNumberNegative;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonValue = button.textContent;

    soundEffect.currentTime = 0;
    soundEffect.play();

    switch (buttonValue) {
      case "AC":
        display.textContent = "";
        displayTop.textContent = "";
        break;

      case "+/-":
        if (display.textContent) {
          if (display.textContent[0] === "+") {
            display.textContent = "-" + display.textContent.slice(1);
          } else if (display.textContent[0] === "-") {
            display.textContent = "+" + display.textContent.slice(1);
          } else if (
            display.textContent[0] !== "+" &&
            display.textContent !== "0" &&
            display.textContent !== ""
          ) {
            display.textContent = "+".concat(display.textContent);
          } else {
            display.textContent = "-".concat(display.textContent);
          }
        }
        break;

      case "%":
        bottomValue = parseInt(display.textContent) / 100;
        if (topValue && bottomValue) {
          displayTop.textContent = `${topValue} + ${bottomValue} =`;
          display.textContent = topValue + bottomValue;
          resultOnDisplay = true;
        } else if (bottomValue) {
          display.textContent = bottomValue;
        }
        break;

      case "/":
      case "x":
      case "+":
      case "-":
        if (display.textContent) {
          switch (displayTop.textContent.slice(-1)) {
            case "/":
            case "x":
            case "+":
            case "-":
              handleOperation(
                getOperation(displayTop.textContent.slice(-1)),
                " " + buttonValue
              );
              break;
            default:
              topValue = parseFloat(display.textContent);
              displayTop.textContent = display.textContent + " " + buttonValue;
              display.textContent = "";
              break;
          }
        }
        break;

      case ".":
        if (!display.textContent.includes(".") && display.textContent) {
          display.textContent += buttonValue;
        }
        break;

      case "=":
        if (display.textContent) {
          if (!displayTop.textContent) {
          } else {
            if (displayTop.textContent[0] === "+") {
              displayTop.textContent = displayTop.textContent.slice(1);
            }

            if (displayTop.textContent[0] === "-") {
              displayTop.textContent = displayTop.textContent.slice(1);
              negativeNum = true;
            }

            const regex = /^(\d+\.?\d*)\s*([\/x+-])\s*$/;
            const match = displayTop.textContent.match(regex);

            if (match[2] === "+" && negativeNum) {
              match[2] = "-";
            } else if (match[2] === "-" && negativeNum) {
              match[2] = "+";
            }

            if (match) {
              topValue = parseFloat(match[1]);
              bottomValue = parseFloat(display.textContent);
              bottomValue > topValue
                ? (bottomNumberBigger = true)
                : (bottomNumberBigger = false);
              bottomValue < 0
                ? (bottomNumberNegative = true)
                : (bottomNumberNegative = false);
              displayTop.textContent = "";
              resultOnDisplay = true;

              switch (match[2]) {
                case "+":
                  display.textContent = `${add(topValue, bottomValue)}`;
                  break;
                case "-":
                  display.textContent = `${subtract(topValue, bottomValue)}`;
                  break;
                case "/":
                  display.textContent = `${divide(topValue, bottomValue)}`;
                  break;
                case "x":
                  display.textContent = `${multiply(topValue, bottomValue)}`;
                  break;
                default:
                  display.textContent = "error";
                  resultOnDisplay = false;
              }

              if (negativeNum && display.textContent[0] === "-") {
                display.textContent = display.textContent.slice(1);
              } else if (negativeNum) {
                if (
                  (bottomNumberBigger && bottomNumberNegative) ||
                  !bottomNumberBigger
                ) {
                  display.textContent = "-" + display.textContent;
                }
              }
            } else {
              display.textContent = "error";
            }
          }
        }
        break;
      default:
        display.textContent += buttonValue;
        break;
    }
    topValue = 0;
    bottomValue = 0;
    negativeNum = false;
    bottomNumberBigger = false;
    bottomNumberNegative = false;
  });
});

const divide = (x, y) => x / y;
const multiply = (x, y) => x * y;
const add = (x, y) => x + y;
const subtract = (x, y) => x - y;

const handleOperation = (operation, operator) => {
  bottomValue = parseFloat(display.textContent);
  display.textContent = "";
  displayTop.textContent = operation(topValue, bottomValue) + operator;
  topValue = parseFloat(displayTop.textContent);
};

const getOperation = (operator) => {
  switch (operator) {
    case "/":
      return divide;
    case "x":
      return multiply;
    case "+":
      return add;
    case "-":
      return subtract;
    default:
      return null;
  }
};
