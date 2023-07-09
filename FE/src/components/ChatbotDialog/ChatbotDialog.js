import React from "react";
import styles from './ChatbotDialog.module.scss'
import {getCurrentUser } from "../../utilities/firebase";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ChatbotDialog() {

    const handleKeyDown = (e) => {
        // Reset field height
        e.target.style.height = "inherit";

        // Get the computed styles for the element
        const computed = window.getComputedStyle(e.target);

        // Calculate the height
        const height = parseInt(computed.getPropertyValue("padding-top"), 10) + e.target.scrollHeight + parseInt(computed.getPropertyValue("padding-bottom"), 10);

        e.target.style.height = `${Math.min(60, height)}px`;
    };
    
    return (
        <>
            <div className={`${styles["chatbot-dialog-content"]} flex-grow-1 d-flex flex-column align-items-center w-100`}>
                <div class={`${styles["chatbot-dialog"]} `}>
                    <div className={`${styles["titleChat"]}`}>COHERE API</div>

                    <div className={`${styles["listChat"]}`}>
                        <div>
                            <img src="./img/chatbot.png" alt="bot_chat" />
                            <span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi
                                quis, neque quibusdam quod est, aliquam nostrum?
                            </span>
                        </div>

                        <div>
                            <img src={getCurrentUser().photoURL ? getCurrentUser().photoURL : "./img/user.png"} alt="bot_chat" />
                            <span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi
                                quis, neque quibusdam quod est, aliquam nostrum?
                            </span>
                        </div>

                        <div>
                            <img src="./img/chatbot.png" alt="bot_chat" />
                            <span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi
                                quis, neque quibusdam quod est, aliquam nostrum?
                            </span>
                        </div>

                        <div>
                            <img src={getCurrentUser().photoURL ? getCurrentUser().photoURL : "./img/user.png"} alt="bot_chat" />
                            <span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi
                                quis, neque quibusdam quod est, aliquam nostrum?
                            </span>
                        </div>

                        <div>
                            <img src="./img/chatbot.png" alt="bot_chat" />
                            <span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi
                                quis, neque quibusdam quod est, aliquam nostrum?
                            </span>
                        </div>

                        <div>
                            <img src={getCurrentUser() && getCurrentUser().photoURL ? getCurrentUser().photoURL : "./img/user.png"} alt="bot_chat" />
                            <span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi
                                quis, neque quibusdam quod est, aliquam nostrum?
                            </span>
                        </div>

                        <div>
                            <img src="./img/chatbot.png" alt="bot_chat" />
                            <span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi
                                quis, neque quibusdam quod est, aliquam nostrum?
                            </span>
                        </div>

                        <div>
                            <img src={getCurrentUser().photoURL ? getCurrentUser().photoURL : "./img/user.png"} alt="bot_chat" />
                            <span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi
                                quis, neque quibusdam quod est, aliquam nostrum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo
                                doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                                quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?Lorem ipsum dolor
                                sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque
                                quibusdam quod est, aliquam nostrum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus!
                                Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class={`${styles["input"]} d-flex  justify-content-center align-items-center`}>
                <textarea id="input" rows="1" cols="100" class="g-0" onKeyDown={handleKeyDown}></textarea>
                <i class="fas fa-paper-plane g-0"></i>
            </div>
        </>
    );
}
