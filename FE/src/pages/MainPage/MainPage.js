import React from 'react'
import { logout } from '../../utilities/firebase'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./MainPage.module.scss"


export default function MainPage() {
    const [titleChat, setTitleChat] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const handleSignOut = () => {
        logout();
    }

  return (
    <div class="container-fluid">
        <div class={`${styles["main-content"]} row`}>
            <div class={`${styles["control-panel"]} g-0 col-sm-4 col-lg-3 d-none d-sm-flex flex-column`}>
                <div class={`${styles["user_info"]} d-flex  justify-content-center align-items-center`}>
                    <img src="/img/user.png" alt="Avatar" class={`${styles["avatar"]} col-5 g-0`}/>
                    <span class="flex-grow-1">Username</span>
                    <i class="fas fa-cog"></i>
                </div>
                
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
                <div class={`${styles["user_info"]} d-flex align-items-center`}>
                    <i class="fas fa-info-circle me-2"></i>
                    <span onClick={() => setIsOpen(true)}>About us</span>
                    
                </div>
            </div>
            <div class={`${styles["chatbot"]} g-0 col-sm-8 col-lg-9 d-flex flex-column align-items-center`}> 
                <div class={`${styles["title"]} d-flex justify-content-center align-items-center`}>
                    <h1>Cohere Chatbot</h1>
                    <img src="./img/thunder.png" alt="thunder"/>
                </div>
                <div className='titleChat'>{titleChat}</div>
                <div class={`${styles["chatbot-dialog"]} flex-grow-1`}>
                    <div>
                        <img src="./img/bot_chat.png" alt="bot_chat"/>
                        <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                    </div>
                    
                    <div>
                        <img src="./img/user.png" alt="bot_chat"/>
                        <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                    </div>

                    <div>
                        <img src="./img/bot_chat.png" alt="bot_chat"/>
                        <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                    </div>

                    <div>
                        <img src="./img/user.png" alt="bot_chat"/>
                        <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quis expedita, numquam voluptas cum facere nemo doloribus! Possimus non earum quaerat ratione quasi quis, neque quibusdam quod est, aliquam nostrum?</span>
                    </div>
                </div>

                <div class={`${styles["input"]} d-flex  justify-content-center align-items-center`}>
                    <textarea id="input" rows="1" cols="100" class="g-0"></textarea>
                    <i class="fas fa-paper-plane g-0"></i>
                </div>
            </div>
        </div>
    </div>
  )
}
