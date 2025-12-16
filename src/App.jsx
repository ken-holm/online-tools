import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Analytics from './components/Analytics';

// Lazy Load Components
const Clock = lazy(() => import('./components/tools/Clock'));
const Countdown = lazy(() => import('./components/tools/Countdown'));
const Timer = lazy(() => import('./components/tools/Timer'));
const Message = lazy(() => import('./components/tools/Message'));
const Stopwatch = lazy(() => import('./components/tools/Stopwatch'));
const Breathing = lazy(() => import('./components/tools/Breathing'));
const Pomodoro = lazy(() => import('./components/tools/Pomodoro'));
const WorldClock = lazy(() => import('./components/tools/WorldClock'));
const Metronome = lazy(() => import('./components/tools/Metronome'));
const Calculator = lazy(() => import('./components/tools/Calculator'));
const Prompter = lazy(() => import('./components/tools/Prompter'));
const Counter = lazy(() => import('./components/tools/Counter'));
const PasswordGenerator = lazy(() => import('./components/tools/PasswordGenerator'));
const QrCode = lazy(() => import('./components/tools/QrCode'));
const TextUtilities = lazy(() => import('./components/tools/TextUtilities'));
const UnitConverter = lazy(() => import('./components/tools/UnitConverter'));
const JsonFormatter = lazy(() => import('./components/tools/JsonFormatter'));
const MarkdownViewer = lazy(() => import('./components/tools/MarkdownViewer'));
const IpSubnetCalculator = lazy(() => import('./components/tools/IpSubnetCalculator'));
const BandwidthCalculator = lazy(() => import('./components/tools/BandwidthCalculator'));
const UrlEncoderDecoder = lazy(() => import('./components/tools/UrlEncoderDecoder'));
const Base64EncoderDecoder = lazy(() => import('./components/tools/Base64EncoderDecoder'));
const IpValidator = lazy(() => import('./components/tools/IpValidator'));
const JwtDebugger = lazy(() => import('./components/tools/JwtDebugger'));
const RegexTester = lazy(() => import('./components/tools/RegexTester'));

const NotFound = () => (
  <div className="text-center text-red-500 text-3xl font-bold mt-10">404 - Page Not Found</div>
);

const Loading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Suspense fallback={<Loading />}><Clock /></Suspense>} />
          <Route path="clock" element={<Suspense fallback={<Loading />}><Clock /></Suspense>} />
          <Route path="countdown" element={<Suspense fallback={<Loading />}><Countdown /></Suspense>} />
          <Route path="timer" element={<Suspense fallback={<Loading />}><Timer /></Suspense>} />
          <Route path="message" element={<Suspense fallback={<Loading />}><Message /></Suspense>} />
          <Route path="stopwatch" element={<Suspense fallback={<Loading />}><Stopwatch /></Suspense>} />
          <Route path="breathing" element={<Suspense fallback={<Loading />}><Breathing /></Suspense>} />
          <Route path="pomodoro" element={<Suspense fallback={<Loading />}><Pomodoro /></Suspense>} />
          <Route path="world-clock" element={<Suspense fallback={<Loading />}><WorldClock /></Suspense>} />
          <Route path="metronome" element={<Suspense fallback={<Loading />}><Metronome /></Suspense>} />
          <Route path="calculator" element={<Suspense fallback={<Loading />}><Calculator /></Suspense>} />
          <Route path="prompter" element={<Suspense fallback={<Loading />}><Prompter /></Suspense>} />
          <Route path="counter" element={<Suspense fallback={<Loading />}><Counter /></Suspense>} />
          <Route path="password-generator" element={<Suspense fallback={<Loading />}><PasswordGenerator /></Suspense>} />
          <Route path="qr-code" element={<Suspense fallback={<Loading />}><QrCode /></Suspense>} />
          <Route path="text-utilities" element={<Suspense fallback={<Loading />}><TextUtilities /></Suspense>} />
          <Route path="unit-converter" element={<Suspense fallback={<Loading />}><UnitConverter /></Suspense>} />
          <Route path="json-formatter" element={<Suspense fallback={<Loading />}><JsonFormatter /></Suspense>} />
          <Route path="markdown-viewer" element={<Suspense fallback={<Loading />}><MarkdownViewer /></Suspense>} />
          <Route path="ip-subnet-calculator" element={<Suspense fallback={<Loading />}><IpSubnetCalculator /></Suspense>} />
          <Route path="bandwidth-calculator" element={<Suspense fallback={<Loading />}><BandwidthCalculator /></Suspense>} />
          <Route path="url-encoder-decoder" element={<Suspense fallback={<Loading />}><UrlEncoderDecoder /></Suspense>} />
          <Route path="base64-encoder-decoder" element={<Suspense fallback={<Loading />}><Base64EncoderDecoder /></Suspense>} />
          <Route path="ip-validator" element={<Suspense fallback={<Loading />}><IpValidator /></Suspense>} />
          <Route path="jwt-debugger" element={<Suspense fallback={<Loading />}><JwtDebugger /></Suspense>} />
          <Route path="regex-tester" element={<Suspense fallback={<Loading />}><RegexTester /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
