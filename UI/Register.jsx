import React, { useState } from "react";

export const Register = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    registeredUsers.push({ username, password, name, email });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    props.onFormSwitch('Login');
  }

  return (
    <div className="auth-form-container">
      <form className="Register-Form" onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Your Full Name"/>
        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your Email" id="email" name="email"/>
        <label htmlFor="username">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter your Username" id="username" name="username"/>
        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your Password" id="password" name="password"/>
        <button type="submit">Sign In</button>
      </form>
      <button className="link-btn" onClick={() => props.onFormSwitch('Login')}>Already have an account? Sign In</button>
    </div>
  )
}
