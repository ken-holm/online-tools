import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Scale, RefreshCw, Sparkles } from 'lucide-react';
import SEO from '../SEO';

// Base units
const standardUnits = {
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
    // Special handling for temp
  },
  volume: {
    liter: 1,
    milliliter: 0.001,
    cubicMeter: 1000,
    gallon: 3.78541,
    quart: 0.946353,
    pint: 0.473176,
    cup: 0.24,
    fluidOunce: 0.0295735,
  },
};

const standardLabels = {
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

const esotericUnits = {
  length: {
    furlong: 201.168,
    league: 4828.03, // 3 miles
    cubit: 0.4572,
    hand: 0.1016,
    lightYear: 9460730472580800,
    parsec: 30856775814913700,
    horseLength: 2.4, // Approx
  },
  weight: {
    stone: 6350.29,
    slug: 14593.9,
    firkin: 25401.2, // Mass of firkin of butter? Varies. Using ~56lb
    atomicMassUnit: 1.66054e-24,
    jupiterMass: 1.898e30,
  },
  temperature: {
    rankine: 'rankine', // Special logic needed
  },
  volume: {
    butt: 476962, // 126 gallons (approx 476L)
    hogshead: 238481, // 63 gallons
    dram: 3.69669,
    teaspoon: 0.00492892,
    tablespoon: 0.0147868,
    olympicPool: 2500000,
  },
};

const esotericLabels = {
  length: {
    furlong: 'Furlong', league: 'League', cubit: 'Cubit', hand: 'Hand',
    lightYear: 'Light-year', parsec: 'Parsec', horseLength: 'Horse Length',
  },
  weight: {
    stone: 'Stone (st)', slug: 'Slug', firkin: 'Firkin',
    atomicMassUnit: 'Atomic Mass Unit (u)', jupiterMass: 'Mass of Jupiter',
  },
  temperature: {
    rankine: 'Rankine (°R)',
  },
  volume: {
    butt: 'Butt (Pipe)', hogshead: 'Hogshead', dram: 'Dram',
    teaspoon: 'Teaspoon (tsp)', tablespoon: 'Tablespoon (tbsp)',
    olympicPool: 'Olympic Swimming Pool',
  },
};

const UnitConverter = () => {
  const { theme } = useTheme();
  const [category, setCategory] = useState('length');
  const [inputValue, setInputValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [convertedValue, setConvertedValue] = useState(0);
  const [isProMode, setIsProMode] = useState(false);

  const activeUnits = useMemo(() => {
    if (!isProMode) return standardUnits;
    
    // Deep merge for Pro Mode
    const merged = {};
    Object.keys(standardUnits).forEach(cat => {
      merged[cat] = { ...standardUnits[cat], ...(esotericUnits[cat] || {}) };
    });
    return merged;
  }, [isProMode]);

  const activeLabels = useMemo(() => {
    if (!isProMode) return standardLabels;
    
    const merged = {};
    Object.keys(standardLabels).forEach(cat => {
      merged[cat] = { ...standardLabels[cat], ...(esotericLabels[cat] || {}) };
    });
    return merged;
  }, [isProMode]);

  useEffect(() => {
    // Reset units when category or mode changes if current unit is invalid
    const currentCatUnits = activeUnits[category] || {};
    if (!currentCatUnits[fromUnit]) setFromUnit(Object.keys(currentCatUnits)[0]);
    if (!currentCatUnits[toUnit]) setToUnit(Object.keys(currentCatUnits)[1] || Object.keys(currentCatUnits)[0]);
  }, [category, isProMode, activeUnits]);

  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit, category, isProMode]);

  const convert = () => {
    if (isNaN(inputValue)) {
      setConvertedValue('Invalid Input');
      return;
    }

    const value = parseFloat(inputValue);
    let result;

    if (category === 'temperature') {
      // Temp conversion logic
      // Base: Celsius
      let valueInCelsius;
      
      // From -> Celsius
      if (fromUnit === 'celsius') valueInCelsius = value;
      else if (fromUnit === 'fahrenheit') valueInCelsius = (value - 32) * 5 / 9;
      else if (fromUnit === 'kelvin') valueInCelsius = value - 273.15;
      else if (fromUnit === 'rankine') valueInCelsius = (value - 491.67) * 5 / 9;

      // Celsius -> To
      if (toUnit === 'celsius') result = valueInCelsius;
      else if (toUnit === 'fahrenheit') result = (valueInCelsius * 9 / 5) + 32;
      else if (toUnit === 'kelvin') result = valueInCelsius + 273.15;
      else if (toUnit === 'rankine') result = (valueInCelsius + 273.15) * 9 / 5;

    } else {
      // Standard multiplier logic
      const fromFactor = activeUnits[category][fromUnit];
      const toFactor = activeUnits[category][toUnit];

      if (fromFactor === undefined || toFactor === undefined) {
        // Fallback or prevent crash
        return; 
      }
      result = (value * fromFactor) / toFactor;
    }

    if (result !== undefined) {
        // Format nicely for very large/small numbers
        if (Math.abs(result) > 10000 || (Math.abs(result) < 0.001 && result !== 0)) {
            setConvertedValue(result.toExponential(4));
        } else {
            setConvertedValue(Number(result.toFixed(4)).toString()); // Remove trailing zeros
        }
    }
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const currentCategoryUnits = activeUnits[category];
  const currentCategoryUnitLabels = activeLabels[category];

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-8 w-full max-w-2xl mx-auto ${theme.font}`}>
      <SEO 
        title="Unit Converter" 
        description="Convert between various units of length, weight, temperature, and volume instantly. Includes a Pro Mode for esoteric units."
        keywords="unit converter, online converter, length, weight, temperature, volume, conversion tool, esoteric units"
      />
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-5xl font-semibold text-white/90 drop-shadow-md flex items-center gap-3">
          <Scale size={40} className="text-blue-400" />
          Unit Converter
        </h2>
        <button
          onClick={() => setIsProMode(!isProMode)}
          className={`p-2 rounded-full transition-all ${isProMode ? 'bg-yellow-500 text-black rotate-12 scale-110 shadow-[0_0_15px_rgba(234,179,8,0.6)]' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
          title={isProMode ? "Disable Pro Mode" : "Enable Pro Mode (Fun Units)"}
        >
          <Sparkles size={20} />
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 w-full space-y-6 relative overflow-hidden">
        {isProMode && (
            <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                <Sparkles size={100} />
            </div>
        )}

        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-white/80 text-sm font-medium mb-2">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500 capitalize"
          >
            {Object.keys(activeUnits).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
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
              {currentCategoryUnits && Object.keys(currentCategoryUnits).map((unit) => (
                <option key={unit} value={unit}>{currentCategoryUnitLabels[unit] || unit}</option>
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
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500 font-mono"
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
              {currentCategoryUnits && Object.keys(currentCategoryUnits).map((unit) => (
                <option key={unit} value={unit}>{currentCategoryUnitLabels[unit] || unit}</option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UnitConverter;
