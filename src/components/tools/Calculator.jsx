import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } '../../context/ThemeContext';

const Calculator = () => {
  const { theme } = useTheme();
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState('');
  const [operator, setOperator] = useState(null);
  const [prevValue, setPrevValue] = useState(null);

  const calculate = useCallback(() => {
    const pVal = parseFloat(prevValue);
    const cVal = parseFloat(currentValue);
    if (isNaN(pVal) || isNaN(cVal)) return display;

    switch (operator) {
      case '+': return pVal + cVal;
      case '-': return pVal - cVal;
      case '*': return pVal * cVal;
      case '/': return cVal === 0 ? 'Error' : pVal / cVal;
      default: return cVal;
    }
  }, [prevValue, currentValue, operator, display]);

  const handleNumberClick = useCallback((num) => {
    if (operator === null && prevValue === null) {
      setCurrentValue(currentValue === '0' ? String(num) : currentValue + num);
      setDisplay(currentValue === '0' ? String(num) : currentValue + num);
    } else if (operator !== null && prevValue !== null && currentValue === '') {
      setCurrentValue(String(num));
      setDisplay(String(num));
    } else {
      setCurrentValue(currentValue + num);
      setDisplay(currentValue + num);
    }
  }, [currentValue, operator, prevValue]);

  const handleOperatorClick = useCallback((nextOperator) => {
    if (prevValue === null) {
      setPrevValue(parseFloat(currentValue));
      setCurrentValue('');
      setOperator(nextOperator);
      setDisplay(currentValue + nextOperator);
    } else if (currentValue !== '') {
      const result = calculate();
      setPrevValue(result);
      setOperator(nextOperator);
      setCurrentValue('');
      setDisplay(result + nextOperator);
    } else {
      setOperator(nextOperator);
      setDisplay(prevValue + nextOperator);
    }
  }, [currentValue, operator, prevValue, display, calculate]);

  const handleEquals = useCallback(() => {
    if (operator && prevValue !== null && currentValue !== '') {
      const result = calculate();
      setDisplay(String(result));
      setPrevValue(result);
      setCurrentValue('');
      setOperator(null);
    }
  }, [currentValue, operator, prevValue, calculate]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setCurrentValue('');
    setOperator(null);
    setPrevValue(null);
  }, []);

  const handleSignToggle = useCallback(() => {
    setCurrentValue(String(parseFloat(currentValue) * -1));
    setDisplay(String(parseFloat(display) * -1));
  }, [currentValue, display]);

  const handlePercentage = useCallback(() => {
    setCurrentValue(String(parseFloat(currentValue) / 100));
    setDisplay(String(parseFloat(display) / 100));
  }, [currentValue, display]);

  const handleButtonClick = useCallback((btn) => {
    if (btn === 'AC') handleClear();
    else if (btn === '=') handleEquals();
    else if (['/', '*', '-', '+'].includes(btn)) handleOperatorClick(btn);
    else if (btn === '+/-') handleSignToggle();
    else if (btn === '%') handlePercentage();
    else handleNumberClick(btn);
  }, [handleClear, handleEquals, handleOperatorClick, handleSignToggle, handlePercentage, handleNumberClick]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (/[0-9]/.test(event.key)) {
        handleNumberClick(event.key);
      } else if (['+', '-', '*', '/'].includes(event.key)) {
        handleOperatorClick(event.key);
      } else if (event.key === 'Enter') {
        event.preventDefault(); // Prevent new line in some contexts
        handleEquals();
      } else if (event.key === 'Backspace') {
        // Optional: Implement backspace functionality
      } else if (event.key === '.') {
        handleNumberClick('.');
      } else if (event.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberClick, handleOperatorClick, handleEquals, handleClear]);

  const buttons = [
    'AC', '+/-', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '=',
  ];

  const getButtonClass = (btn) => {
    let base = "flex items-center justify-center p-4 rounded-lg shadow-md text-white font-bold transition-colors text-2xl";
    if (['/', '*', '-', '+', '='].includes(btn)) {
      return `${base} bg-blue-600 hover:bg-blue-700`;
    } else if (['AC', '+/-', '%'].includes(btn)) {
      return `${base} bg-gray-600 hover:bg-gray-700`;
    } else if (btn === '0') {
        return `${base} col-span-2 bg-gray-700 hover:bg-gray-600`;
    }
    return `${base} bg-gray-700 hover:bg-gray-600`;
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-full p-4 ${theme.font}`}>
      <h2 className="text-4xl md:text-6xl font-semibold text-white/90 mb-8 drop-shadow-md text-center">
        Simple Calculator
      </h2>

      <div 
        className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6 max-w-sm w-full"
      >
        {/* Display */}
        <div className="bg-black/30 rounded-lg p-4 mb-4 text-right overflow-hidden border border-gray-600">
          <div className="text-gray-400 text-sm h-5">{prevValue} {operator} {currentValue}</div>
          <div className="text-white text-5xl font-mono tabular-nums break-all h-14 flex items-center justify-end">
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={getButtonClass(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;

