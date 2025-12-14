import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [is24HourFormat, setIs24HourFormat] = useState(true);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = '';

    if (!is24HourFormat) {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
    }

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${minutes}:${seconds}${ampm}`;
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <h2 className="text-8xl font-bold mb-4">
        {formatTime(time)}
      </h2>
      <p className="text-3xl mb-8">
        {formatDate(time)}
      </p>
      <button
        onClick={() => setIs24HourFormat(!is24HourFormat)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md text-lg font-medium"
      >
        Toggle {is24HourFormat ? '12-Hour' : '24-Hour'} Format
      </button>
    </div>
  );
};

export default Clock;
