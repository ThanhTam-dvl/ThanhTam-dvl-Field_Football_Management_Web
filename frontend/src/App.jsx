import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import UserProfile from './pages/UserProfile';
import ScrollToTop from './components/ScrollToTop';
import './assets/styles/styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/profile" element={<UserProfile />} />
        {/* sau này thêm /booking, /find-match, /admin/* */}
      </Routes>
    </Router>
  );
}

export default App;
