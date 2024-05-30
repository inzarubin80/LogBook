import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Сategories from "./components/Сategories";
import Login from "./components/login/login";
import MyBar from "./components/AppBar";
import Box from "@mui/material/Box";
import { WithUser } from './Shared/UserContainer'

function App() {
  return (
    <WithUser>
    <BrowserRouter>
      <MyBar /> 
    </BrowserRouter>
    </WithUser>
  );
}

export default App;