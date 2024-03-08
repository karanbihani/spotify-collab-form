import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Form from './components/Form';
import Login from './components/Login';
import Callback from './components/Callback';
import LoginGoogle from './components/LoginGoogle';

function App() {
  return (
    <>
    <Router>
        <Routes>
            <Route path='/' element={<LoginGoogle />}></Route>
            <Route path="/callback" element={<Callback />}></Route>
            <Route path="/add" element={<Form />}></Route>
        </Routes>
    </Router>      
    </>
  );
}
export default App;
