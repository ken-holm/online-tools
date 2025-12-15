import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Scale, RefreshCw } from 'lucide-react';
import SEO from '../SEO';

// Conversion factors (base unit: meter, gram, celsius, liter)
const units = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    micrometer: 0.000001,
    nanometer: 0.000000001,
    mile: 1609.34,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
    nauticalMile: 1852,
  },
  weight: {
    gram: 1,
    kilogram: 1000,
    milligram: 0.001,
    pound: 453.592,
    ounce: 28.3495,
    tonne: 1000000,
  },
  temperature: {
    celsius: 1,
    fahrenheit: (val) => (val - 32) * 5 / 9, // To Celsius
    kelvin: (val) => val - 273.15, // To Celsius
    fromCelsius: {
      fahrenheit: (val) => (val * 9 / 5) + 32,
      kelvin: (val) => val + 273.15,
    },
  },
  volume: {
    liter: 1,
    milliliter: 0.001,
    cubicMeter: 1000,
    gallon: 3.78541,
    quart: 0.946353,
    pint: 0.473176,
    cup: 0.24, // Approx
    fluidOunce: 0.0295735,
  },
};

const unitLabels = {
  length: {
    meter: 'Meter (m)', kilometer: 'Kilometer (km)', centimeter: 'Centimeter (cm)',
    millimeter: 'Millimeter (mm)', micrometer: 'Micrometer (µm)', nanometer: 'Nanometer (nm)',
    mile: 'Mile (mi)', yard: 'Yard (yd)', foot: 'Foot (ft)', inch: 'Inch (in)',
    nauticalMile: 'Nautical Mile (nm)',
  },
  weight: {
    gram: 'Gram (g)', kilogram: 'Kilogram (kg)', milligram: 'Milligram (mg)',
    pound: 'Pound (lb)', ounce: 'Ounce (oz)', tonne: 'Tonne (t)',
  },
  temperature: {
    celsius: 'Celsius (°C)', fahrenheit: 'Fahrenheit (°F)', kelvin: 'Kelvin (K)',
  },
  volume: {
    liter: 'Liter (L)', milliliter: 'Milliliter (ml)', cubicMeter: 'Cubic Meter (m³)',
    gallon: 'Gallon (gal)', quart: 'Quart (qt)', pint: 'Pint (pt)', cup: 'Cup',
    fluidOunce: 'Fluid Ounce (fl oz)',
  },
};

const UnitConverter = () => {
  const { theme } = useTheme();
  const [category, setCategory] = useState('length');
  const [inputValue, setInputValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [convertedValue, setConvertedValue] = useState(0);

  useEffect(() => {
    // Set default units when category changes
    const defaultUnits = Object.keys(units[category]);
    setFromUnit(defaultUnits[0]);
    setToUnit(defaultUnits[1] || defaultUnits[0]); // Ensure 'to' unit is different if possible
  }, [category]);

  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit, category]); // Re-run conversion if any input changes

  const convert = () => {
    if (isNaN(inputValue)) {
      setConvertedValue('Invalid Input');
      return;
    }

    const value = parseFloat(inputValue);
    let result;

    if (category === 'temperature') {
      // Convert 'from' to Celsius first
      let valueInCelsius;
      if (fromUnit === 'celsius') valueInCelsius = value;
      else if (fromUnit === 'fahrenheit') valueInCelsius = units.temperature.fahrenheit(value);
      else if (fromUnit === 'kelvin') valueInCelsius = units.temperature.kelvin(value);

      // Convert from Celsius to 'to' unit
      if (toUnit === 'celsius') result = valueInCelsius;
      else if (toUnit === 'fahrenheit') result = units.temperature.fromCelsius.fahrenheit(valueInCelsius);
      else if (toUnit === 'kelvin') result = units.temperature.fromCelsius.kelvin(valueInCelsius);

    } else {
      // General conversion for length, weight, volume
      const fromFactor = units[category][fromUnit];
      const toFactor = units[category][toUnit];

      if (fromFactor === undefined || toFactor === undefined) {
        setConvertedValue('N/A');
        return;
      }
      result = (value * fromFactor) / toFactor;
    }

    setConvertedValue(result.toFixed(4)); // Round to 4 decimal places
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const currentCategoryUnits = units[category];
  const currentCategoryUnitLabels = unitLabels[category];

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-8 w-full max-w-2xl mx-auto ${theme.font}`}>
      <SEO 
        title="Unit Converter" 
        description="Convert between various units of length, weight, temperature, and volume instantly."
        keywords="unit converter, online converter, length, weight, temperature, volume, conversion tool"
      />
      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md flex items-center gap-3">
        <Scale size={40} className="text-blue-400" />
        Unit Converter
      </h2>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 w-full space-y-6">
        
        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-white/80 text-sm font-medium mb-2">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
          >
            {Object.keys(units).map((cat) => (
              <option key={cat} value={cat} className="capitalize">{cat}</option>
            ))}
          </select>
        </div>

        {/* Conversion Input */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label htmlFor="inputValue" className="block text-white/80 text-sm font-medium mb-2">From Value</label>
            <input
              id="inputValue"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter value"
            />
          </div>
          <div className="flex-1 w-full">
            <label htmlFor="fromUnit" className="block text-white/80 text-sm font-medium mb-2">From Unit</label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
            >
              {Object.keys(currentCategoryUnits).map((unit) => (
                <option key={unit} value={unit}>{currentCategoryUnitLabels[unit]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleSwapUnits}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white shadow-md transition-colors"
            title="Swap Units"
          >
            <RefreshCw size={24} />
          </button>
        </div>

        {/* Conversion Output */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label htmlFor="convertedValue" className="block text-white/80 text-sm font-medium mb-2">Converted Value</label>
            <input
              id="convertedValue"
              type="text"
              value={convertedValue}
              readOnly
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex-1 w-full">
            <label htmlFor="toUnit" className="block text-white/80 text-sm font-medium mb-2">To Unit</label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
            >
              {Object.keys(currentCategoryUnits).map((unit) => (
                <option key={unit} value={unit}>{currentCategoryUnitLabels[unit]}</option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UnitConverter;
