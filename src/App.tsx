import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Link, Route } from "react-router-dom";
import Home from "./pages/home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <nav>
        <div className="menu">
          <Link to="/">Home</Link>
        </div>
      </nav>
    </div>
  );
}

export default App;
