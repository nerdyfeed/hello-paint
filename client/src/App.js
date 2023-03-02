import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import SettingBar from './components/SettingBar';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';

import './styles/app.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route
          path="/:id"
          element={
            <>
              <Toolbar />
              <SettingBar />
              <Canvas />
            </>
          }
        ></Route>
        <Route path="*" element={<Navigate to={`f${(+new Date()).toString(16)}`} />} />
      </Routes>
    </div>
  );
}

export default App;
