import './App.css';

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Authenticate from './components/Authenticate';
import Map from './components/Map';
import Loading from './components/Loading';
import Error from './components/Error';
import Home from './components/Home';

class App extends Component {
  constructor () {
    super();
    this.default = false;
  }

  render() {
    return (
      <Router>
        <Routes>
            <Route path="/home" element={<Home/>} />
            <Route path="/:uid/:handle" element={<Authenticate/>} />
            <Route path='/map' element={<Map/>}/>
            <Route path='/loading' element={<Loading/>}/>
            <Route path='/error' element={<Error/>}/>
        </Routes>
      </Router>
    );
  }
}

export default App;