import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';
import SchoolPage from './pages/SchoolPage';  // Unified component import
import { useState, useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import RequestAccess from './pages/RequestAccess';
import ProtectedRoutePage from './components/ProtectedRoutePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import amherstImage from '../public/images/amherst.gif';
import hampshireImage from '../public/images/hampshire.gif';
import mtholyokeImage from '../public/images/mtholyoke.gif';
import smithImage from '../public/images/smith.gif';
import umassImage from '../public/images/umass.gif';

function Home() {
  return (
    <div className="d-flex h-100 text-center">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <h1 className="display-1">Gadgets-to-Go</h1>
        <h2>Campus Selection</h2>
        <main className="px-3">
          <div className="row">
            <div className="mx-auto" style={{ paddingTop: '20px' }}>
              <Link to="/school/amherst">
                <img src={amherstImage} alt="Amherst College" className="img-fluid" />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="mx-auto" style={{ paddingTop: '20px' }}>
              <Link to="/school/hampshire">
                <img src={hampshireImage} alt="Hampshire College" className="img-fluid" />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="mx-auto" style={{ paddingTop: '20px' }}>
              <Link to="/school/mtholyoke">
                <img src={mtholyokeImage} alt="Mount Holyoke College" className="img-fluid" />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="mx-auto" style={{ paddingTop: '20px' }}>
              <Link to="/school/smith">
                <img src={smithImage} alt="Smith College" className="img-fluid" />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="mx-auto" style={{ paddingTop: '20px' }}>
              <Link to="/school/umass">
                <img src={umassImage} alt="University of Massachusetts" className="img-fluid" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true); // New state to track loading
  const location = useLocation();
  // useTokenValidation();  // Custom hook to validate token
  // Check authorization when the app loads (after Shibboleth redirects)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token') || localStorage.getItem('authToken');

    if (token) {
      console.log('Token found:', token);  // Debugging token presence
      // Simulate checking the token (e.g., against backend API)
      setIsAuthorized(true);
      localStorage.setItem('authToken', token);  // Save auth token in localStorage
    } else {
      console.log('No token found, user unauthorized.');
      setIsAuthorized(false);
    }

    setLoading(false);  // Token check is complete, stop loading
  }, [location]);

  if (loading) {
    return <div>Loading...</div>;  // Show a loading screen while checking token
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/school" element={<Home />} />
      <Route path="/protected-route" element = {<ProtectedRoutePage />} />
      <Route path="/school/:school" element={<SchoolPage />} /> 
      <Route path="/admin"
              element={
                <ProtectedRoute isAuthorized={isAuthorized}>
                  <AdminPage />
                </ProtectedRoute>
              }
      />
      <Route
        path="/admin/:location"
        element={
          <ProtectedRoute isAuthorized={isAuthorized}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path='/request-access'
        element={<RequestAccess />}
      />
    </Routes>
  );
}

function RootApp() {
  return (
    <Router basename='/gadgets-to-go'>
      <App />
      <ToastContainer />
    </Router>
  );
}

export default RootApp;
