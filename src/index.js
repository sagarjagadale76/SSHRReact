import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/contexts/AuthContext'
import { Amplify } from "aws-amplify"

const root = ReactDOM.createRoot(document.getElementById('root'));

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-west-2_z7yspZ5Jo",
      userPoolClientId: "3i7f2a8sk64vd15d7dftf0q2kl",
      region: "eu-west-2",
    },
  },
})

root.render(
    <BrowserRouter> 
    <AuthProvider>  
    <App /> 
    </AuthProvider>           
    </BrowserRouter>               
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
