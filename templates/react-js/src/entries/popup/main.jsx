import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "../../components/App.jsx";
import '../../styles/global.css'
import Popup from './Popup.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Popup/>
  </React.StrictMode>,
)
