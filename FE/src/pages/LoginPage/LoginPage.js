import React, { useState, useEffect } from 'react'
import styles from './LoginPage.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import { logInWithEmailAndPassword, signInWithGoogle } from '../../utilities/firebase'
import { Link } from "react-router-dom";

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
    <div className={`${styles["bg-size"]} ${styles["bg-color"]} container-fluid g-0 d-flex flex-column justify-content-center align-items-center`}>
      <div className="header p-4">
        <div className={`${styles["header-firstChild"]}`}></div>
        <h1 className={`${styles["header-title"]}`}>Cohere chatbot</h1>
        <div className={`${styles["header-lastChild"]}`}></div>
      </div>

      <div className={`${styles["mainContent"]} bg-white row`}>
        <div className="col-sm-4 d-none d-sm-flex flex-column justify-content-center align-items-center">
          <img src="./img/icon_chatbot.png" alt="chatbot" className={styles["mainContent-icon"]} />
        </div>

        <div className={`${styles["mainContent-loginForm"]} col-sm-8 d-sm-flex flex-column justify-content-center align-items-center`}>

          <div className={`${styles["wrapperForm"]} h-100 w-75 d-flex flex-column justify-content-center`}>
            <h2 className={`${styles["wrapperForm-title"]}`}>LOGIN</h2>

            {
              error.length !== 0 &&
              <div className={`${styles["wrapperForm-alert"]} alert alert-danger`} role="alert">
                {error}
              </div>
            }

            <form className={`${styles["wrapperForm-form"]} alert-danger`}>
              <div>
                <label for="txtEmail">Email</label>
                <input type="text" className={`form-control ${styles["form-control"]} no-border`} id="txtEmail"
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
                <input type="password" className={`form-control ${styles["form-control"]} no-border`} id="txtPassword"
                  placeholder="Password" value={password}
                  onChange={
                    (e) => {
                      setPassword(e.target.value)
                      setError('')
                    }
                  } />
                <div className={`forget_password ${styles["forget_password"]}`}><Link to="/forgetpassword">* Forget password</Link></div>
              </div>

              <div className="d-flex flex-column align-items-center justify-content-center" >
                <button className={`btn ${styles["btn-primary"]} w-100`}  onClick={handleEmailSignIn}>ENTER</button>
              </div>
            </form>

            <div className={`${styles["line"]}`}>OR</div>


            <div className="d-flex flex-column align-items-center justify-content-center">

              <button className={`btn ${styles["btn-primary"]} w-100`} onClick={handleGoogleSignIn}>
                <i className="fab fa-google"> </i> SIGN IN WITH GOOGLE

              </button>
            </div>

            <div className={`${styles["signup"]}`}>You don't have an account? <Link to="/register">Join Now</Link> </div>

          </div>
        </div>

      </div>


    </div>
  )
}
