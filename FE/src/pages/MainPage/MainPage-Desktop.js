import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { logout } from '../../utilities/firebase'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./MainPage-Desktop.module.scss"


export default function MainPageDesktop() {
    const [titleChat, setTitleChat] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)

    const handleKeyDown = (e) => {
        // Reset field height
        e.target.style.height = 'inherit';

        // Get the computed styles for the element
        const computed = window.getComputedStyle(e.target);

        // Calculate the height
        const height = parseInt(computed.getPropertyValue('padding-top'), 10)
            + e.target.scrollHeight
            + parseInt(computed.getPropertyValue('padding-bottom'), 10)

        e.target.style.height = `${Math.min(60, height)}px`;
    }

    const handleClose = () => setIsOpen(false);

    const handleSignOut = () => {
        logout();
    }

    return (
        <div class="container-fluid">
            <div class={`${styles["main-content"]} row`}>
                <div class={`${styles["control-panel"]} ${styles["control-panel--rounded"]} g-0 col-sm-4 col-lg-3 d-none d-sm-flex flex-column d-flex justify-content-between`}>
                    <div class={`${styles["user_info"]} d-flex  justify-content-center align-items-center`}>
                        <img src="/img/user.png" alt="Avatar" class={`${styles["avatar"]} col-5 g-0`} />
                        <span class="flex-grow-1">Username</span>
                        <i class="fas fa-cog">
                            <div className={`${styles["config_popup"]} d-none`}>
                                <div>User Information</div>
                                <div>Sign Out</div>
                            </div>
                        </i>
                    </div>

                    <div class={`flex-grow-1`}>
                        <div class={`${styles["line"]}`}></div>
                        <div class={`${styles["chat_new"]} d-flex align-items-center`}>
                            <i class="fas fa-plus-circle"></i>
                            <span>Add new chat</span>
                        </div>

                        <div class={`${styles["history_panel_title"]}`}>History</div>
                        {/* <!-- History Panel --> */}
                        <div class={`${styles["history_panel"]} flex-grow-1`}>

                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>

                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt='chat_icon'></img>
                                <span class="flex-grow-1">Cohere API</span>
                                <div class="d-none">
                                    <i class="fas fa-edit me-1"></i>
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                            </div>
                        </div>
                        <div class={`${styles["line"]}`}></div>
                    </div>

                    <div class={`${styles["about_us"]} d-flex align-items-center`} onClick={() => setIsOpen(true)}>
                        <i class="fas fa-info-circle me-2"></i>
                        <span>About us</span>
                    </div>
                </div>

                <div class={`${styles["chatbot"]} g-0 col-sm-8 col-lg-9 d-flex flex-column align-items-center justify-content-between`}>
                    <div class={`${styles["title"]} d-flex justify-content-center align-items-center`}>
                        <h1>Cohere Chatbot</h1>
                        <img src="./img/thunder.png" alt="thunder" />
                    </div>
                    <div className={`${styles["chatbot-dialog-content"]} flex-grow-1 d-flex flex-column align-items-center w-100`}>

                        
                         <div class={`${styles["chatbot-dialog"]} `}>
                            <div className={`${styles["titleChat"]}`}>
                                COHERE API
                            </div>

                            <div className={`${styles["listChat"]}`}>
                                <div>
                                    <img src="./img/bot_chat.png" alt="bot_chat" />
                                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                                </div>

                                <div>
                                    <img src="./img/user.png" alt="bot_chat" />
                                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                                </div>

                                <div>
                                    <img src="./img/bot_chat.png" alt="bot_chat" />
                                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                                </div>

                                <div>
                                    <img src="./img/user.png" alt="bot_chat" />
                                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                                </div>

                                <div>
                                    <img src="./img/bot_chat.png" alt="bot_chat" />
                                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                                </div>

                                <div>
                                    <img src="./img/user.png" alt="bot_chat" />
                                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                                </div>

                                <div>
                                    <img src="./img/bot_chat.png" alt="bot_chat" />
                                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                                </div>

                                <div>
                                    <img src="./img/user.png" alt="bot_chat" />
                                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                                </div>

                            </div>


                        </div>
                    </div>

                    <div class={`${styles["input"]} d-flex  justify-content-center align-items-center`}>
                        <textarea id="input" rows="1" cols="100" class="g-0" onKeyDown={handleKeyDown}></textarea>
                        <i class="fas fa-paper-plane g-0"></i>
                    </div>
                </div>


                <Modal show={isOpen} onHide={handleClose} className={`${styles["modalBox"]}`}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <span style={{ fontWeight: '800', fontSize: '24px' }}>About us</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <span style={{ fontFamily: 'Arial' }}>
                            <b style={{ fontFamily: 'Arial' }}>* GIÁO VIÊN HƯỚNG DẪN:</b> <br />
                            1. Đinh Điền <br />
                            2. Nguyễn Bảo Long <br />
                            <br />
                            <b style={{ fontFamily: 'Arial' }}>* THÀNH VIÊN NHÓM:</b> <br />
                            1. 20127323 - Võ Nhật Tân <br />
                            2. 20127447 - Ngô Đức Bảo <br />
                            3. 20127681 - Nguyễn Thiên Phúc <br />
                        </span>
                    </Modal.Body>

                </Modal>

            </div>



        </div>
    )
}
