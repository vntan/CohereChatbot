import React, { useState, useEffect } from 'react'
import './ForgotPassword.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, sendPasswordReset } from '../../utilities/firebase'
import {Link} from "react-router-dom";

export default function ForgotPassword(){

    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const resetPasswordwithEmail = async (e) => {
        e.preventDefault();
        if (username.length === 0) {
          setError('Please fill your email');
          return;
        }

        const validEmail = new RegExp(
          '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
        );

        if (!validEmail.exec(username)) {
          setError('Please check your email address!');
          return;
        }

        const reset = await sendPasswordReset(auth, username);
        if (reset == null) {
          setError("Reset Password Failed!");
          return;
        }
        setError('')
    }

    useEffect(() => {
        setError('')
      }, [])

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
              <h2>RESET PASSWORD</h2>
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
  
                <div className="d-flex flex-column align-items-center justify-content-center" >
                  <button className="btn btn-primary w-100" onClick={resetPasswordwithEmail}>ENTER</button>
                </div>
              </form>
  
              <div className='line'>OR</div>
  
  
              <div className="d-flex flex-column align-items-center justify-content-center">
  
              </div>
  
              <div className='signup'>You don't have an account? <Link to="/register">Join Now</Link> </div>
  
            </div>
          </div>
        </div>
  
  
      </div>
    )
}
