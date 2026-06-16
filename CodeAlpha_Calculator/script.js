const displayResult     = document.getElementById('result');
const displayExpression = document.getElementById('expression');

let currentValue  = '0';
let previousValue = '';
let operator      = null;
let shouldReplace = false;
let expression    = '';

function updateDisplay() {
  displayResult.textContent     = currentValue;
  displayExpression.textContent = expression;

  const len = currentValue.length;
  displayResult.classList.remove('small', 'xsmall', 'error');
  if (len > 12) displayResult.classList.add('xsmall');
  else if (len > 8)  displayResult.classList.add('small');
}


function inputNumber(value) {
  
  if (shouldReplace) {
    currentValue  = value === '.' ? '0.' : value;
    shouldReplace = false;
    return;
  }

  
  if (value === '.' && currentValue.includes('.')) return;

 if (currentValue.replace('.', '').replace('-', '').length >= 15
      && value !== '.') return;

  if (currentValue === '0' && value !== '.') {
    currentValue = value;
  } else {
    currentValue += value;
  }
}

function inputOperator(op) {
  if (operator && !shouldReplace) {
    calculate();
  }

  previousValue = currentValue;
  operator      = op;
  shouldReplace = true;           

  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  expression = `${previousValue} ${symbols[op] || op}`;

  updateDisplay();
}

function calculate() {
  
  if (!operator || !previousValue) return;

  
  const fullExpression = `${previousValue} ${operator} ${currentValue}`;

  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  expression = `${previousValue} ${symbols[operator] || operator} ${currentValue} =`;

  try {
  
    if (operator === '/' && Number(currentValue) === 0) {
      throw new Error("Can't divide by zero");
    }

    const rawResult = eval(fullExpression);

    if (!isFinite(rawResult)) throw new Error('Result is too large');

    const rounded = parseFloat(rawResult.toFixed(10));
    currentValue  = String(rounded);

  } catch (error) {
    displayResult.classList.add('error');
    currentValue = error.message || 'Error';
  }

  operator      = null;
  previousValue = '';
  shouldReplace = true;          
}


function clearAll() {
  currentValue  = '0';
  previousValue = '';
  operator      = null;
  shouldReplace = false;
  expression    = '';
  displayResult.classList.remove('error');
}

function toggleSign() {
  if (currentValue === '0') return;
  currentValue = currentValue.startsWith('-')
    ? currentValue.slice(1)          
    : '-' + currentValue;            
}


function applyPercent() {
  try {
    const pct = parseFloat(currentValue) / 100;
    currentValue = String(parseFloat(pct.toFixed(10)));
  } catch {
    currentValue = 'Error';
  }
}


function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span'); 
  const size   = Math.max(button.offsetWidth, button.offsetHeight);
  const rect   = button.getBoundingClientRect(); 

  
  circle.style.width  = size + 'px';
  circle.style.height = size + 'px';
  circle.style.left   = (event.clientX - rect.left - size / 2) + 'px';
  circle.style.top    = (event.clientY - rect.top  - size / 2) + 'px';
  circle.classList.add('ripple');

  const existing = button.querySelector('.ripple');
  if (existing) existing.remove();
  button.appendChild(circle);
}


function handleButtonClick(event) {
  const button = event.currentTarget;
  const value  = button.dataset.value; 

  createRipple(event);                

  if (value === 'C')   { clearAll();           }
  else if (value === '+/-') { toggleSign();    }
  else if (value === '%')   { applyPercent();  }
  else if (value === '=')   { calculate();     }
  else if (['+', '-', '*', '/'].includes(value)) {
                              inputOperator(value); }
  else                      { inputNumber(value);  }

  updateDisplay();
}

const allButtons = document.querySelectorAll('.btn');
allButtons.forEach(button => {
  button.addEventListener('click', handleButtonClick);
});


document.addEventListener('keydown', function(event) {
  const key = event.key;


  let matchingButton = null;

  if (key >= '0' && key <= '9') {
    inputNumber(key);
    matchingButton = document.querySelector(`[data-value="${key}"]`);
  }
  else if (key === '.') {
    inputNumber('.');
    matchingButton = document.querySelector('[data-value="."]');
  }
  else if (['+', '-', '*', '/'].includes(key)) {
    inputOperator(key);
    matchingButton = document.querySelector(`[data-value="${key}"]`);
  }
  else if (key === 'Enter' || key === '=') {
    calculate();
    matchingButton = document.querySelector('[data-value="="]');
  }
  else if (key === 'Escape') {
    clearAll();
    matchingButton = document.querySelector('[data-value="C"]');
  }
  else if (key === 'Backspace') {
    
    if (currentValue.length > 1 && !shouldReplace) {
      currentValue = currentValue.slice(0, -1);
    } else {
      currentValue = '0';
    }
  }
  else {
    return; 
  }

  
  if (matchingButton) {
    matchingButton.classList.add('key-press');
    setTimeout(() => matchingButton.classList.remove('key-press'), 120);
  }

  updateDisplay();
});

updateDisplay();