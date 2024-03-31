import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { HomePage } from './pages/HomePage'
import { Instances } from './pages/Instances';

function App() {

  return (
    <>
    <Router>
      <Routes>
     <Route path="/" element={<HomePage />} />
     <Route path='/instances' element={<Instances />} />
     </Routes>
    </Router>
    </>
  )
}

export default App