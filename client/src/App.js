import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import "./App.css";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Landing />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
