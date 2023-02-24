import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import '../src/css/App.css';
import '../src/css/index.css';
import '../src/css/animate.css'
import '../src/css/bootstrap.css'
import '../src/css/landing.css'
import '../src/css/plugin.css'
import '../src/css/styles.css'
import '../src/css/font-awesome.min.css'
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'
import Details from './pages/Details'


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route key={0} path="/" element={<Home />} />
          <Route key={1} path="/todo/:todoid" element={<Details />} />
          <Route key={2} path="*" element={<div className="p-24">
            <h1 className="text-center text-3xl">Error 404</h1>
            <p className="p-5 text-center text-base">Page not found</p>
          </div>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
