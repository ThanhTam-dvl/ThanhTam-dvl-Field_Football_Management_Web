import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './assets/styles/styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* sau này thêm /booking, /find-match, /admin/* */}
      </Routes>
    </Router>
  );
}

export default App;
