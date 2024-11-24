import HomePage from './Pages/HomePage';
import Header from './components/Header';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import FeedbackPage from './Pages/FeedbackPage';
import CreateAccountPage from './Pages/CreateAccountPage';
import PatientDashboard from './Pages/PatientDashboard';
import StaffDashboard from './Pages/StaffDashboard';
import Admin from './Pages/Admin';
import { InformationPage } from './Pages/Information';
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <div>
      <ScrollToTop />

      <div className="App">
          <Header />
          <Routes>
            <Route path = '/' element={<HomePage />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='feedback' element={<FeedbackPage />} />
            <Route path='createAccount' element={<CreateAccountPage />} />
            <Route path='patientDashboard' element={<PatientDashboard />} />
            <Route path='staffDashboard' element={<StaffDashboard />} />
            <Route path='adminDashboard' element={<Admin />} />
            <Route path='info' element={<InformationPage />} />
          </Routes>
      </div>
    </div>
  );
}

export default App;