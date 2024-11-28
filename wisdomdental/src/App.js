import HomePage from './Pages/HomePage';
import Header from './components/Header';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import FeedbackPage from './Pages/FeedbackPage';
import CreateAccountPage from './Pages/CreateAccountPage';
import PatientDashboard from './Pages/PatientDashboard';
import StaffDashboard from './Pages/StaffDashboard';
import Admin from './Pages/Admin';
import { InformationPage } from './Pages/Information';
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollToTop from './components/ScrollToTop'
import { useState, useEffect } from 'react';

function App() {


  const [user, setUser] = useState(null);

  useEffect (() => {
    const savedUser = JSON.parse(sessionStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
    console.log("verifying session storage: ",sessionStorage.getItem('user'));
  }

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');  
  };

  return (
    <div>
      <ScrollToTop />
        <div className="App">
          <Header onLogout={handleLogout} />
            <Routes>
              <Route path = '/' element={<HomePage />} />
              <Route path='login' element={<LoginPage onLogin={handleLogin} />} />
              <Route path='feedback' element={<FeedbackPage />} />
              <Route path='createAccount' element={<CreateAccountPage />} />

              <Route path='patientDashboard' element={user ? <PatientDashboard user={user} /> : <Navigate to="/login" />}/>
              <Route path='staffDashboard' element={user && user.Role && user.Role !== 'Admin' ? <StaffDashboard user={user} /> : <Navigate to='/login' />} />
              <Route path='adminDashboard' element={user && user.Role === 'Admin' ? <Admin user={user} /> : <Navigate to='/login' />} />

              <Route path='info' element={<InformationPage />} />
            </Routes>
        </div>
    </div>
  );
}

export default App;