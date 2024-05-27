import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Сategories from "./components/Сategories";
import Login from "./components/login/login";
import MyBar from "./components/AppBar";
import Box from "@mui/material/Box";

function App() {
  return (
    <BrowserRouter>
      
     
      <MyBar />
   
      
    </BrowserRouter>
  );
}

export default App;