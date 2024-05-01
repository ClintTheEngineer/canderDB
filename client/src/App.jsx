import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { HomePage } from './pages/HomePage'
import { Instances } from './pages/Instances';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { PrivateRoutes } from './pages/PrivateRoutes';
import { InstanceNames } from './pages/InstanceNames';
import { AdminInstanceNames } from './admin-pages/AdminInstanceNames';
import { Documentation } from './pages/Documentation';

function App() {
 const [setToken] = useState('');
  return (
    <>
    <Router>
     <Routes>
     <Route path="/" element={<HomePage />} />     
     <Route path='/register' element={<Register />} />
     <Route path='/login' element={<Login setToken={setToken}/>} />
     <Route path='/docs' element={<Documentation />} />
     <Route element={<PrivateRoutes />}>
     <Route path='/instances' element={<Instances />} />
     <Route path=':pathParam' element={<InstanceNames />}  />
     <Route path='/admin-instances' element={<AdminInstanceNames />} />
     </Route>
     </Routes>
    </Router>
    </>
  )
}

export default App