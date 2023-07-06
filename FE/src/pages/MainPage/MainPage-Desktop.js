import React, { useState, useEffect } from "react";
import CustomModal from "../../components/CustomModal/CustomModal";

import { logout, getCurrentUser } from "../../utilities/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./MainPage-Desktop.module.scss";
import AboutUsModal from "../../components/AboutUsModal/AboutUsModal";
import UserInformationModal from "../../components/UserInformationModal/UserInformationModal";
import EditUserModal from "../../components/EditUserModal/EditUserModal";

export default function MainPageDesktop() {

  const [userInfo, setUserInfo] = useState(getCurrentUser());
  const [isHoveringSetting, setIsHoveringSetting] = useState(false);
  const [isOpenAboutUs, setIsOpenAboutUs] = useState(false);
  const [isOpenUserInformation, setIsOpenUserInformation] = useState(false);
  const [isOpenEditUserInformation, setIsOpenEditUserInformation] =
    useState(false);

  useEffect(()=>{
    setUserInfo(getCurrentUser());
  }, [isOpenEditUserInformation])

  const handleKeyDown = (e) => {
    // Reset field height
    e.target.style.height = "inherit";

    // Get the computed styles for the element
    const computed = window.getComputedStyle(e.target);

    // Calculate the height
    const height =
      parseInt(computed.getPropertyValue("padding-top"), 10) +
      e.target.scrollHeight +
      parseInt(computed.getPropertyValue("padding-bottom"), 10);

    e.target.style.height = `${Math.min(60, height)}px`;
  };

  const handleUserInformationEditClick = () => {
    setIsOpenUserInformation(false);
    setIsOpenEditUserInformation(true);
  };

  return (
    <div class="container-fluid">
      <div class={`${styles["main-content"]} row`}>
        <div
          class={`${styles["control-panel"]} ${styles["control-panel--rounded"]} g-0 col-sm-4 col-lg-3 d-none d-sm-flex flex-column d-flex justify-content-between`}
        >
          <div
            class={`${styles["user_info"]} d-flex  justify-content-center align-items-center`}
          >
            <img
              src={
                userInfo.photoURL
                  ? userInfo.photoURL
                  : "./img/user.png"
              }
              alt="Avatar"
              class={`${styles["avatar"]} col-5 g-0`}
            />
            <span class="flex-grow-1">{userInfo.displayName}</span>
            <i
              class="fas fa-cog"
              onClick={() => setIsHoveringSetting(!isHoveringSetting)}
            >
              {isHoveringSetting && (
                <div
                  onMouseOver={() => setIsHoveringSetting(true)}
                  className={`${styles["config_popup"]}`}
                >
                  <div
                    onClick={() => setIsOpenUserInformation(true)}
                    onMouseOut={() => setIsHoveringSetting(!isHoveringSetting)}
                  >
                    User Information
                  </div>
                  <div
                    onClick={() => logout()}
                    onMouseOut={() => setIsHoveringSetting(!isHoveringSetting)}
                  >
                    Sign Out
                  </div>
                </div>
              )}
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
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>

              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div
                class={`${styles["chat_item"]} chat_item_edit d-flex align-items-center`}
              >
                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                <span class="flex-grow-1">Cohere API</span>
                <div class="d-none">
                  <i class="fas fa-edit me-1"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
            </div>
            <div class={`${styles["line"]}`}></div>
          </div>

          <div
            class={`${styles["about_us"]} d-flex align-items-center`}
            onClick={() => setIsOpenAboutUs(true)}
          >
            <i class="fas fa-info-circle me-2"></i>
            <span>About us</span>
          </div>
        </div>

        <div
          class={`${styles["chatbot"]} g-0 col-sm-8 col-lg-9 d-flex flex-column align-items-center justify-content-between`}
        >
          <div
            class={`${styles["title"]} d-flex justify-content-center align-items-center`}
          >
            <h1>Cohere Chatbot</h1>
            <img src="./img/thunder.png" alt="thunder" />
          </div>
          <div
            className={`${styles["chatbot-dialog-content"]} flex-grow-1 d-flex flex-column align-items-center w-100`}
          >
            <div class={`${styles["chatbot-dialog"]} `}>
              <div className={`${styles["titleChat"]}`}>COHERE API</div>

              <div className={`${styles["listChat"]}`}>
                <div>
                  <img src="./img/chatbot.png" alt="bot_chat" />
                  <span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam quis expedita, numquam voluptas cum facere nemo
                    doloribus! Possimus non earum quaerat ratione quasi quis,
                    neque quibusdam quod est, aliquam nostrum?
                  </span>
                </div>

                <div>
                  <img
                    src={
                      userInfo.photoURL
                        ? userInfo.photoURL
                        : "./img/user.png"
                    }
                    alt="bot_chat"
                  />
                  <span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam quis expedita, numquam voluptas cum facere nemo
                    doloribus! Possimus non earum quaerat ratione quasi quis,
                    neque quibusdam quod est, aliquam nostrum?
                  </span>
                </div>

                <div>
                  <img src="./img/chatbot.png" alt="bot_chat" />
                  <span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam quis expedita, numquam voluptas cum facere nemo
                    doloribus! Possimus non earum quaerat ratione quasi quis,
                    neque quibusdam quod est, aliquam nostrum?
                  </span>
                </div>

                <div>
                  <img
                    src={
                      userInfo.photoURL
                        ? userInfo.photoURL
                        : "./img/user.png"
                    }
                    alt="bot_chat"
                  />
                  <span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam quis expedita, numquam voluptas cum facere nemo
                    doloribus! Possimus non earum quaerat ratione quasi quis,
                    neque quibusdam quod est, aliquam nostrum?
                  </span>
                </div>

                <div>
                  <img src="./img/chatbot.png" alt="bot_chat" />
                  <span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam quis expedita, numquam voluptas cum facere nemo
                    doloribus! Possimus non earum quaerat ratione quasi quis,
                    neque quibusdam quod est, aliquam nostrum?
                  </span>
                </div>

                <div>
                  <img
                    src={
                      userInfo && userInfo.photoURL
                        ? userInfo.photoURL
                        : "./img/user.png"
                    }
                    alt="bot_chat"
                  />
                  <span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam quis expedita, numquam voluptas cum facere nemo
                    doloribus! Possimus non earum quaerat ratione quasi quis,
                    neque quibusdam quod est, aliquam nostrum?
                  </span>
                </div>

                <div>
                  <img src="./img/chatbot.png" alt="bot_chat" />
                  <span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam quis expedita, numquam voluptas cum facere nemo
                    doloribus! Possimus non earum quaerat ratione quasi quis,
                    neque quibusdam quod est, aliquam nostrum?
                  </span>
                </div>

                <div>
                  <img
                    src={
                      userInfo.photoURL
                        ? userInfo.photoURL
                        : "./img/user.png"
                    }
                    alt="bot_chat"
                  />
                  <span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam quis expedita, numquam voluptas cum facere nemo
                    doloribus! Possimus non earum quaerat ratione quasi quis,
                    neque quibusdam quod est, aliquam nostrum?Lorem ipsum dolor
                    sit amet consectetur adipisicing elit. Quisquam quis
                    expedita, numquam voluptas cum facere nemo doloribus!
                    Possimus non earum quaerat ratione quasi quis, neque
                    quibusdam quod est, aliquam nostrum?Lorem ipsum dolor sit
                    amet consectetur adipisicing elit. Quisquam quis expedita,
                    numquam voluptas cum facere nemo doloribus! Possimus non
                    earum quaerat ratione quasi quis, neque quibusdam quod est,
                    aliquam nostrum?Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Quisquam quis expedita, numquam voluptas
                    cum facere nemo doloribus! Possimus non earum quaerat
                    ratione quasi quis, neque quibusdam quod est, aliquam
                    nostrum?Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Quisquam quis expedita, numquam voluptas cum facere
                    nemo doloribus! Possimus non earum quaerat ratione quasi
                    quis, neque quibusdam quod est, aliquam nostrum?
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            class={`${styles["input"]} d-flex  justify-content-center align-items-center`}
          >
            <textarea
              id="input"
              rows="1"
              cols="100"
              class="g-0"
              onKeyDown={handleKeyDown}
            ></textarea>
            <i class="fas fa-paper-plane g-0"></i>
          </div>
        </div>

        <AboutUsModal
          show={isOpenAboutUs}
          onClose={() => setIsOpenAboutUs(false)}
        ></AboutUsModal>
        <UserInformationModal
          show={isOpenUserInformation}
          userInfo={userInfo}
          onClose={() => setIsOpenUserInformation(false)}
          onEditClick={handleUserInformationEditClick}
        ></UserInformationModal>

        {/* Edit User Modal Here */}
        {isOpenEditUserInformation && (
          <EditUserModal
            userInfo={getCurrentUser()}
            onClose={() => setIsOpenEditUserInformation(false)}
          ></EditUserModal>
        )}
      </div>
    </div>
  );
}
