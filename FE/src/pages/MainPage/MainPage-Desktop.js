import React from "react";
import Modal from "react-bootstrap/Modal";
import CustomModal from "../../components/CustomModel/CustomModal";

import { logout, getCurrentUser } from "../../utilities/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./MainPage-Desktop.module.scss";
import { signOut } from "firebase/auth";

export default function MainPageDesktop() {
  const [titleChat, setTitleChat] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenEdit, setIsOpenEdit] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(!isHovering);
  };

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

  const handleClose = () => setIsOpen(false);

  const handleOpenEdit = () => setIsOpenEdit(true);
  const handleCloseEdit = () => setIsOpenEdit(false);

  const handleSignOut = () => {
    logout();
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
                getCurrentUser().photoURL
                  ? getCurrentUser().photoURL
                  : "./img/user.png"
              }
              alt="Avatar"
              class={`${styles["avatar"]} col-5 g-0`}
            />
            <span class="flex-grow-1">{getCurrentUser().displayName}</span>
            <i class="fas fa-cog" onClick={handleMouseOut}>
              {isHovering && (
                <div
                  onMouseOver={handleMouseOver}
                  className={`${styles["config_popup"]}`}
                >
                  <div onClick={handleOpenEdit} onMouseOut={handleMouseOut}>
                    User Information
                  </div>
                  <div onClick={handleSignOut} onMouseOut={handleMouseOut}>
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
            onClick={() => setIsOpen(true)}
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
                      getCurrentUser().photoURL
                        ? getCurrentUser().photoURL
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
                      getCurrentUser().photoURL
                        ? getCurrentUser().photoURL
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
                      getCurrentUser().photoURL
                        ? getCurrentUser().photoURL
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
                      getCurrentUser().photoURL
                        ? getCurrentUser().photoURL
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



        <CustomModal
          title="User Information"
          show={isOpen}
          isHasFooter={false}
          isHasEditButton={false}
          styleTitle={{ fontWeight: "800", fontSize: "24px" }}
          onCloseClick={handleClose}
          className={`${styles["modalBox"]}`}
        >
          <span style={{ fontFamily: "Arial" }}>
            <b style={{ fontFamily: "Arial" }}>* GIÁO VIÊN HƯỚNG DẪN:</b>{" "}
            <br />
            1. Đinh Điền <br />
            2. Nguyễn Bảo Long <br />
            <br />
            <b style={{ fontFamily: "Arial" }}>* THÀNH VIÊN NHÓM:</b> <br />
            1. 20127323 - Võ Nhật Tân <br />
            2. 20127447 - Ngô Đức Bảo <br />
            3. 20127681 - Nguyễn Thiên Phúc <br />
          </span>
        </CustomModal>


        <CustomModal
          title="User Information"
          show={isOpenEdit}
          isHasFooter={false}
          isHasEditButton={true}
          styleTitle={{ fontWeight: "800", fontSize: "24px" }}
          onCloseClick={handleCloseEdit}
          className={`${styles["modalBox"]}`}
        >
          <img
            src={
              getCurrentUser().photoURL
                ? getCurrentUser().photoURL
                : "./img/user.png"
            }
            alt="Avatar"
            class={`${styles["avatar_info"]} col-5 g-0`}
          />
          <br />

          <div className="d-flex justify-content-center align-items-center">
            <table style={{
              fontFamily: "Arial",
              display: "block",
            }}>
              <tr>
                <td>Email</td>
                <td>{getCurrentUser().email}{" "}</td>
              </tr>

              <tr>
                <td >Display Name</td>
                <td>{getCurrentUser().displayName}{" "}</td>
              </tr>
            </table>
          </div>


        </CustomModal>
      </div>
    </div>
  );
}
