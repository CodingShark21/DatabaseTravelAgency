import React, { useState } from "react";

export const Login = (props) => {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [rememberUser, setRememberUser] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers'));
        const user = registeredUsers.find((user) => user.username === Username);
        if (user && user.password === Password) {
            if (rememberUser) {
                localStorage.setItem('currentUser', Username);
            }
            console.log('Welcome back');
        } else {
            console.log('Username and/or password are incorrect');
        }
    }
    

    return (
        <div className="auth-form-container">
            <form className="Login-Form" onSubmit={handleSubmit}>
                <label htmlFor="Username">Username</label>
                <input value={Username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter your Username" id="Username" name="Username" required />
                <label htmlFor="Password">Password</label>
                <input value={Password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your Password" id="Password" name="Password" required />
                <div className="remember-me">
                    <input type="checkbox" id="rememberUser" checked={rememberUser} onChange={(e) => setRememberUser(e.target.checked)} />
                    <label htmlFor="rememberUser">Remember me</label>
                </div>
                <button type="submit">Sign In</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('Register')}>Not Registered yet? Sign Up</button>
        </div>    
    )
}
