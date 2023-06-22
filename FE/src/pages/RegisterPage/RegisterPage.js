import React, { useState, useEffect } from 'react'
import './RegisterPage.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { registerWithEmailAndPassword } from '../../utilities/firebase'
import {Link} from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    setError('')
  }, [])

  const handleSignUp = async (e) => {
    e.preventDefault();
    // const user = await signInWithGoogle(); 
    if (email.length === 0 || password.length === 0) {
      setError('Please fill all required fields');
      return;
    }

    const validEmail = new RegExp(
      '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
    );

    if (!validEmail.exec(email)) {
      setError('Please check your email address!');
      return;
    }

    if(password !== confirmPassword){
      setError('Password and confirm password do not match!');
      return;
    }

    const register = await registerWithEmailAndPassword(userName, email, password);

    if (register == null) {
      setError("Register Failed!");
      return;
    }
    setError('')
  }
  return (
    <div className="container-fluid g-0  background-color d-flex flex-column justify-content-center align-items-center">
    <div className="header p-4">
      <div></div>
      <h1>Cohere chatbot</h1>
      <div></div>
    </div>
    <div className="main-content bg-white row">
      <div className="icon col-sm-4 d-none d-sm-flex flex-column justify-content-center align-items-center">
        <img src="./img/icon_chatbot.png" alt="chatbot" />
      </div>
      <div className="register_form col-sm-8 d-sm-flex flex-column justify-content-center align-items-center">

        <div className="h-100 w-75 d-flex flex-column justify-content-center">
          <h2>REGISTER</h2>
          {
            error.length !== 0 &&
            <div class="alert alert-danger " role="alert">
              {error}
            </div>
          }
          <form>
          <div>
              <label for="txtEmail">User name</label>
              <input type="text" className="form-control no-border" id="txtEmail"
                placeholder="User name" value={userName}
                onChange={
                  (e) => {
                    setUserName(e.target.value);
                    setError('')
                  }
                } />
              <div></div>
            </div>

            <div>
              <label for="txtEmail">Email</label>
              <input type="text" className="form-control no-border" id="txtEmail"
                placeholder="Email" value={email}
                onChange={
                  (e) => {
                    setEmail(e.target.value);
                    setError('')
                  }
                } />
              <div></div>
            </div>

            <div>
            <label for="txtPassword">Password</label>
              <input type="password" className="form-control no-border" id="txtPassword"
                    placeholder="Password" value={password}
                    onChange={
                      (e) => {
                        setPassword(e.target.value)
                        setError('')
                      }
                  } />
            </div>
            <div>
            <label for="txtPassword">Confirm Password</label>
              <input type="password" className="form-control no-border" id="txtPassword"
                    placeholder="Password" value={confirmPassword}
                    onChange={
                      (e) => {
                        setConfirmPassword(e.target.value)
                        setError('')
                      }
                  } />
            </div>

            <div className="d-flex flex-column align-items-center justify-content-center" >
              <button className="btn btn-primary w-100" onClick={handleSignUp}>ENTER</button>
            </div>
          </form>

          <div className='line'>OR</div>


          <div className="d-flex flex-column align-items-center justify-content-center">

          </div>

          <div className='signin'>You already have an account? <Link to="/login">Join Now</Link> </div>

        </div>
      </div>
    </div>


  </div>
  )
}
