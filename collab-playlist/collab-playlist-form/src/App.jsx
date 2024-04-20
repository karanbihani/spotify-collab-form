import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Form from './components/Form';
import Login from './components/Login';
import Callback from './components/Callback';
import LoginGoogle from './components/LoginGoogle';
import SpotifyInput from './components/SpotifyInput';
import React from "react";

function App() {
  return (
    <div className="app-container" >
      <div className='l1'>
      <Router>
        <Routes>
          <Route path='/' element={<LoginGoogle />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/old/add" element={<Form />} />
          <Route path="/add" element={<SpotifyInput />} />
        </Routes>
      </Router>
      </div>
    </div>
  );
}
export default App;
