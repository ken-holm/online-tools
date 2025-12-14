import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-5xl font-bold mb-8">tools.holmcc.com</h1>
      <div className="flex items-center space-x-4 mb-8">
        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg text-xl font-semibold"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="text-lg">
          Edit <code className="bg-gray-700 px-2 py-1 rounded">src/App.jsx</code> to get started.
        </p>
      </div>
    </div>
  );
}

export default App;