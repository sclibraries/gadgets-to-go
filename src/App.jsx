import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Amherst from './pages/Amherst';
import Hampshire from './pages/Hampshire';
import MtHolyoke from './pages/MtHolyoke';
import Smith from './pages/Smith';
import UMass from './pages/UMass';

function Home() {
  return (
    <div className="d-flex h-100 text-center">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <h1 className="display-1">Gadgets-to-Go</h1>
        <h2>Campus Selection</h2>
        <main className="px-3">
          <div className="row">
            <div className="mx-auto" style={{ paddingTop: '20px' }}>
              <Link to="/amherst">
                <img src="/images/amherst.gif" alt="Amherst College" className="img-fluid" />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="mx-auto" style={{ paddingTop: '20px' }}>
              <Link to="/hampshire">
                <img src="/images/hampshire.gif" alt="Hampshire College" className="img-fluid" />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="mx-auto" style={{ paddingTop: '20px' }}>
              <Link to="/mtholyoke">
                <img src="/images/mtholyoke.gif" alt="Mount Holyoke College" className="img-fluid" />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="mx-auto" style={{ paddingTop: '20px' }}>
              <Link to="/smith">
                <img src="/images/smith.gif" alt="Smith College" className="img-fluid" />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="mx-auto" style={{ paddingTop: '20px' }}>
              <Link to="/umass">
                <img src="/images/umass.gif" alt="University of Massachusetts" className="img-fluid" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/amherst" element={<Amherst />} />
        <Route path="/hampshire" element={<Hampshire />} />
        <Route path="/mtholyoke" element={<MtHolyoke />} />
        <Route path="/smith" element={<Smith />} />
        <Route path="/umass" element={<UMass />} />
      </Routes>
    </Router>
  );
}

export default App;