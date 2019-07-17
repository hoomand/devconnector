import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <h1>My React App</h1>
      </div>
    </Router>
  );
}

export default App;
