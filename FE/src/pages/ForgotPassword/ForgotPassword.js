import React, { useState, useEffect } from 'react'
import styles from './ForgotPassword.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import { sendPasswordReset } from '../../utilities/firebase'
import {Link} from "react-router-dom";

export default function ForgotPassword(){

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const resetPasswordwithEmail = async (e) => {
        e.preventDefault();
        if (email.length === 0) {
          setError('Please fill your email');
          return;
        }

        const validEmail = new RegExp(
          '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
        );

        if (!validEmail.exec(email)) {
          setError('Please check your email address!');
          return;
        }

        const reset = await sendPasswordReset(email);
        if (reset === null) {
          setError("Reset Password Failed!");
          return;
        }
        setError('')
    }

    useEffect(() => {
        setError('')
      }, [])

    return (
      <div className={`${styles["bg-size"]} ${styles["bg-color"]} container-fluid g-0 d-flex flex-column justify-content-center align-items-center`}>
        <div className={`${styles["header"]} p-4`}>
          <div className={`${styles["header-firstChild"]}`}></div>
          <h1 className={`${styles["header-title"]}`}>Cohere chatbot</h1>
          <div className={`${styles["header-lastChild"]}`}></div> 
        </div>
        <div className={`${styles["mainContent"]} bg-white row`}>
          <div className="icon col-sm-4 d-none d-sm-flex flex-column justify-content-center align-items-center">
            <img src="./img/icon_chatbot.png" alt="chatbot" className={styles["mainContent-icon"]} />
          </div>
          <div className={`${styles["mainContent-resetForm"]} col-sm-8 d-sm-flex flex-column justify-content-center align-items-center`}>
  
          <div className={`${styles["wrapperForm"]} h-100 w-75 d-flex flex-column justify-content-center`}>
              <h2 className={`${styles["wrapperForm-title"]}`}>RESET PASSWORD</h2>
              {
                error.length !== 0 &&
                <div className={`${styles["wrapperForm-alert"]} alert alert-danger`} role="alert">
                  {error}
                </div>
              }
              <form className={`${styles["form"]} alert-danger`}>
                <div>
                  <label for="txtEmail">Email</label>
                  <input type="text" className={`form-control ${styles["form-control"]} no-border`} id="txtEmail"
                    placeholder="Email" value={email}
                    onChange={
                      (e) => {
                        setEmail(e.target.value);
                        setError('')
                      }
                    } />
                  <div></div>
                </div>
  
                <div className="d-flex flex-column align-items-center justify-content-center" >
                  <button className={`btn ${styles["btn-primary"]} w-100`} onClick={resetPasswordwithEmail}>ENTER</button>
                </div>
              </form>
  
              <div className={`${styles["line"]}`}>OR</div>

              <div className="d-flex flex-column align-items-center justify-content-center">
  
              </div>
  
              <div className={`${styles["signup"]}`}>You don't have an account? <Link to="/register">Join Now</Link></div>
  
            </div>
          </div>
        </div>
  
  
      </div>
    )
}
