import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Clock from './components/tools/Clock';
import Countdown from './components/tools/Countdown';
import Timer from './components/tools/Timer';
import Message from './components/tools/Message';
import Stopwatch from './components/tools/Stopwatch';
import Breathing from './components/tools/Breathing';
import Pomodoro from './components/tools/Pomodoro';
import WorldClock from './components/tools/WorldClock';
import Metronome from './components/tools/Metronome';
import Calculator from './components/tools/Calculator';
import Prompter from './components/tools/Prompter';
import Counter from './components/tools/Counter'; // Import the new Counter component

const NotFound = () => (
  <div className="text-center text-red-500 text-3xl font-bold">404 - Page Not Found</div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <div className="flex flex-col items-center justify-center h-full text-white">
              <h2 className="text-4xl font-bold mb-4">Welcome to tools.holmcc.com!</h2>
              <p className="text-xl mb-8">Select a tool from the navigation above.</p>
            </div>
          } />
          <Route path="clock" element={<Clock />} />
          <Route path="countdown" element={<Countdown />} />
          <Route path="timer" element={<Timer />} />
          <Route path="message" element={<Message />} />
          <Route path="stopwatch" element={<Stopwatch />} />
          <Route path="breathing" element={<Breathing />} />
          <Route path="pomodoro" element={<Pomodoro />} />
          <Route path="world-clock" element={<WorldClock />} />
          <Route path="metronome" element={<Metronome />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="prompter" element={<Prompter />} />
          <Route path="counter" element={<Counter />} /> {/* New Counter Route */}
          {/* Future tools will have their routes here */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;