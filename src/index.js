import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
//import {Button} from 'react-bootstrap'
//import 'bootstrap/dist/css/bootstrap.css'
import App from './App';
import './index.css';
 import Countries from './Countries'
import './countries.css'

ReactDOM.render(
  <React.StrictMode>
    <div style={{display: 'flex'}}>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <App /> 
      </div>
      <div style={{display: 'flex', flexDirection: 'column',  paddingLeft: '400px'}}>
        <Countries />
      </div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
