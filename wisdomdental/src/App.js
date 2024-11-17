import HomePage from './Pages/HomePage';
import Header from './components/Header';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import FeedbackPage from './Pages/FeedbackPage';

function App() {
  return (
    <div className="App">
        <Header />
        <Routes>
          <Route path = '/' element={<HomePage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='feedback' element={<FeedbackPage />} />
        </Routes>
    </div>
  );
}

export default App;
