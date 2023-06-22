import React, { useState, useEffect } from 'react'
import './LoginPage.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { logInWithEmailAndPassword, signInWithGoogle } from '../../utilities/firebase'
import {Link} from "react-router-dom";

export default function LoginPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    setError('')
  }, [])

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    // const user = await signInWithGoogle(); 
    if (username.length == 0 || password.length == 0) {
      setError('Please fill all required fields');
      return;
    }

    const validEmail = new RegExp(
      '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
    );
    if (!validEmail.exec(username)) {
      setError('Please check your email address!');
      return;
    }

    const user = await logInWithEmailAndPassword(username, password);

    if (user == null) {
      setError("Login Failed!");
      return;
    }
    setError('')
  }

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    const user = await signInWithGoogle();

    if (user == null) {
      setError("Login Failed!");
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
        <div className="login_form col-sm-8 d-sm-flex flex-column justify-content-center align-items-center">

          <div className="h-100 w-75 d-flex flex-column justify-content-center">
            <h2>LOGIN</h2>

            {
              error.length !== 0 &&
              <div class="alert alert-danger " role="alert">
                {error}
              </div>
            }

            <form>
              <div>
                <label for="txtEmail">Email</label>
                <input type="text" className="form-control no-border" id="txtEmail"
                  placeholder="Email" value={username}
                  onChange={
                    (e) => {
                      setUsername(e.target.value);
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
                <div className='forget_password'><Link to="/forgetpassword">* Forget password</Link></div>
              </div>

              <div className="d-flex flex-column align-items-center justify-content-center" >
                <button className="btn btn-primary w-100" onClick={handleEmailSignIn}>ENTER</button>
              </div>
            </form>

            <div className='line'>OR</div>


            <div className="d-flex flex-column align-items-center justify-content-center">

              <button className="btn btn-primary w-100" onClick={handleGoogleSignIn}>
                <i class="fab fa-google"> </i> SIGN IN WITH GOOGLE

              </button>
            </div>

            <div className='signup'>You don't have an account? <Link to="/register">Join Now</Link> </div>

          </div>
        </div>
      </div>


    </div>
  )
}
