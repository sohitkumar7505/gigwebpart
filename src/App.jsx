import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Nav from './components/Nav';

import Dashboard from './components/dashboard/Dashboard';
import DelhiZoneMap from './components/map/map';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        
      <Route path='/map' element={<DelhiZoneMap/>}/>
        
        <Route path='/' element={<Dashboard/>}/>
      </Routes>
    </Router>
    
  );
}

export default App;
