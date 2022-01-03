import './App.css';

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Authenticate from './components/Authenticate';
import Map from './components/Map';

class App extends Component {
  constructor () {
    super();
    this.default = false;
  }

  render() {
    return (
      <Router>
        <Routes>
            <Route path="/:uid/:handle" element={<Authenticate/>} />
            <Route path='/map' element={<Map/>}/>
        </Routes>
      </Router>
    );
  }
}

export default App;