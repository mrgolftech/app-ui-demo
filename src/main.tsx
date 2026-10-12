import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DemoAuthProvider, useDemoAuth } from './auth/DemoAuth';
import { RequireDemoAuth } from './auth/RequireDemoAuth';
import { AppShell } from './components/AppShell';
import { HomePage } from './pages/HomePage';
import { RazPage } from './pages/RazPage';
import { PhonicsPage } from './pages/PhonicsPage';
import { DubbingPage } from './pages/DubbingPage';
import { QuizPage } from './pages/QuizPage';
import { LoginPage } from './pages/LoginPage';
import { PhonicsCatalogPage } from './pages/PhonicsCatalogPage';
import { PhonicsBookPage } from './pages/PhonicsBookPage';
import { ReadingCatalogPage } from './pages/ReadingCatalogPage';
import { ReadingExerciseSelectPage } from './pages/ReadingExerciseSelectPage';
import { ReadingBookPage } from './pages/ReadingBookPage';
import './styles/tokens.css';
import './styles/shell.css';
import './styles/study.css';
import './styles/home.css';
import './styles/login.css';
import './styles/study-exit.css';
import './styles/catalog.css';
import './styles/reader.css';
import './styles/quiz.css';

function LoginRoute(){
 const {signedIn}=useDemoAuth();
 return signedIn?<Navigate to="/" replace/>:<LoginPage/>;
}
function Application(){
 // Android system bars are handled by MainActivity to avoid conflicting WebView calls.
 return <HashRouter><Routes>
  <Route path="/login" element={<LoginRoute/>}/>
  <Route element={<RequireDemoAuth><AppShell/></RequireDemoAuth>}>
   <Route index element={<HomePage/>}/>
   <Route path="/phonics/catalog" element={<PhonicsCatalogPage/>}/>
   <Route path="/phonics/book/:bookId" element={<PhonicsBookPage/>}/>
   <Route path="/reading/catalog" element={<ReadingCatalogPage/>}/>
   <Route path="/reading/exercises" element={<ReadingExerciseSelectPage/>}/>
   <Route path="/reading/book/:bookId/:mode" element={<ReadingBookPage/>}/>
   <Route path="/raz" element={<RazPage/>}/>
   <Route path="/phonics" element={<PhonicsPage/>}/>
   <Route path="/dub" element={<DubbingPage/>}/>
   <Route path="/quiz" element={<QuizPage/>}/>
  </Route>
  <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes></HashRouter>;
}
createRoot(document.getElementById('root')!).render(
 <StrictMode><DemoAuthProvider><Application/></DemoAuthProvider></StrictMode>
);
