import HomePage from './Pages/HomePage';
import Header from './components/Header';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';

function App() {
  return (
    <div className="App">
        <Header />
        <Routes>
          <Route path = '/' element={<HomePage />} />
          <Route path='login' element={<LoginPage />} />
        </Routes>
    </div>
  );
}

export default App;
