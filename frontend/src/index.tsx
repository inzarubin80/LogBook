import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App';
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>


    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>

  </React.StrictMode>
);