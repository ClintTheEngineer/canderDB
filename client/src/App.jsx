import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { HomePage } from './pages/HomePage'
import { Instances } from './pages/Instances';
import { Register } from './pages/Register';
import { Login } from './pages/Login';

function App() {
  const [setToken] = useState('');
  return (
    <>
    <Router>
     <Routes>
     <Route path="/" element={<HomePage />} />
     <Route path='/instances' element={<Instances />} />
     <Route path='/register' element={<Register />} />
     <Route path='/login' element={<Login setToken={setToken}/>} />
     </Routes>
    </Router>
    </>
  )
}

export default App