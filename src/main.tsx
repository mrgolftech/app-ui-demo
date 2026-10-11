import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { HomePage } from './pages/HomePage';
import { RazPage } from './pages/RazPage';
import { PhonicsPage } from './pages/PhonicsPage';
import { DubbingPage } from './pages/DubbingPage';
import { QuizPage } from './pages/QuizPage';
import './styles/tokens.css';
import './styles/shell.css';
import './styles/study.css';
import './styles/home.css';

// HashRouter keeps separate screens deep-linkable inside GitHub Pages and an APK.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<AppShell/>}>
          <Route index element={<HomePage/>}/>
          <Route path="/raz" element={<RazPage/>}/>
          <Route path="/phonics" element={<PhonicsPage/>}/>
          <Route path="/dub" element={<DubbingPage/>}/>
          <Route path="/quiz" element={<QuizPage/>}/>
          <Route path="*" element={<HomePage/>}/>
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
);
