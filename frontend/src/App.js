import HomePage from './features/home/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
      <BrowserRouter>
      <Routes>
      <Route path="/" >
        <Route index element={<HomePage />} />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
