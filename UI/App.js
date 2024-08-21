import React, { useState } from "react";
import './App.css';
import { Login } from "./Login";
import { Register } from "./Register";

function App() {
  const [currentForm, setcurrentForm] = useState('Login');

  const toggleForm = (formName) => {
    setcurrentForm(formName);
  }

  // Check if user is already authenticated
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('authenticated') === 'true');

  const authenticateUser = (username, password) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Check if user is registered
    const user = registeredUsers.find((user) => user.username === username);
    if (user) {
      if (user.password === password) {
        setAuthenticated(true);
        localStorage.setItem('authenticated', true);
        console.log('Welcome back!');
      } else {
        console.log('Invalid password');
      }
    } else {
      console.log('Username not registered');
    }
  }

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.setItem('authenticated', false);
  }

  return (
    <div className="App">
      {
        currentForm === 'Login' ? <Login onFormSwitch={toggleForm} authenticateUser={authenticateUser} authenticated={authenticated} handleLogout={handleLogout}/> : <Register onFormSwitch={toggleForm}/>
      }
    </div>
  );
}

export default App;
