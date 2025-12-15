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
import Counter from './components/tools/Counter';
import PasswordGenerator from './components/tools/PasswordGenerator';
import QrCode from './components/tools/QrCode';
import TextUtilities from './components/tools/TextUtilities';
import UnitConverter from './components/tools/UnitConverter';
import JsonFormatter from './components/tools/JsonFormatter';
import MarkdownViewer from './components/tools/MarkdownViewer';
import IpSubnetCalculator from './components/tools/IpSubnetCalculator';
import BandwidthCalculator from './components/tools/BandwidthCalculator';
import UrlEncoderDecoder from './components/tools/UrlEncoderDecoder';
import Base64EncoderDecoder from './components/tools/Base64EncoderDecoder';
import IpValidator from './components/tools/IpValidator';
import JwtDebugger from './components/tools/JwtDebugger';
import Analytics from './components/Analytics';

const NotFound = () => (
  <div className="text-center text-red-500 text-3xl font-bold">404 - Page Not Found</div>
);

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Clock />} />
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
          <Route path="counter" element={<Counter />} />
          <Route path="password-generator" element={<PasswordGenerator />} />
          <Route path="qr-code" element={<QrCode />} />
          <Route path="text-utilities" element={<TextUtilities />} />
          <Route path="unit-converter" element={<UnitConverter />} />
          <Route path="json-formatter" element={<JsonFormatter />} />
          <Route path="markdown-viewer" element={<MarkdownViewer />} />
          <Route path="ip-subnet-calculator" element={<IpSubnetCalculator />} />
          <Route path="bandwidth-calculator" element={<BandwidthCalculator />} />
          <Route path="url-encoder-decoder" element={<UrlEncoderDecoder />} />
          <Route path="base64-encoder-decoder" element={<Base64EncoderDecoder />} />
          <Route path="ip-validator" element={<IpValidator />} />
          <Route path="jwt-debugger" element={<JwtDebugger />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;