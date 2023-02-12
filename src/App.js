import logo from "./logo.svg";
import "./App.css";
import GridComponent from "./GridComponent";
import axios from "axios";
import { useEffect } from "react";

function App() {
  return (
    <div className="App">
      <h1 style={{ fontFamily: "sans-serif" }}>Live Mode Scanner</h1>
      <GridComponent />
    </div>
  );
}

export default App;
