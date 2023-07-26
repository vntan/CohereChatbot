import React, { useState, useEffect } from "react";
import { logout, getCurrentUser } from "../../utilities/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./MainPage-Mobile.module.scss";
import AboutUsModal from "../../components/AboutUsModal/AboutUsModal";
import UserInformationModal from "../../components/UserInformationModal/UserInformationModal";
import EditUserModal from "../../components/EditUserModal/EditUserModal";
import HistoricalChats from "../../components/HistoricalChatsComponent/HistoricalChatsComponent";
import ChatbotDialog from "../../components/ChatbotDialog/ChatbotDialog";

export default function MainPageMobile() {
  const [userInfo, setUserInfo] = useState(getCurrentUser());
  const [isHoveringSetting, setIsHoveringSetting] = useState(false);
  const [isOpenAboutUs, setIsOpenAboutUs] = useState(false);
  const [isOpenUserInformation, setIsOpenUserInformation] = useState(false);
  const [isOpenEditUserInformation, setIsOpenEditUserInformation] =
    useState(false);
  const [updateChatName, setUpdateChatName] = useState({});
  const [addChatName, setAddChatName] = useState({});
  const [nameChatObj, setNameChatObj] = useState({});
  const [IsOpenNavBar, setIsOpenNavBar] = useState(false);

  useEffect(() => {
    setUserInfo(getCurrentUser());
  }, [isOpenEditUserInformation]);

  const handleUserInformationEditClick = () => {
    setIsOpenUserInformation(false);
    setIsOpenEditUserInformation(true);
  };

  const handleOnChatClick = (nameObj) => {
    setNameChatObj({
      ...nameObj,
    });
  };

  const handleOnCreateChat = () => {
    setNameChatObj({});
  };

  const handleOnDeleteChat = (nameObj) => {
    if (nameObj.chatID === nameChatObj.chatID) {
      setNameChatObj({});
    }
  };

  const handleOnEditChat = (nameObj) => {
    if (nameObj.chatID === nameChatObj.chatID) {
      setNameChatObj({
        ...nameObj,
      });
    }
  };

  const handleOnNavBarClick = () => {
    setIsOpenNavBar(!IsOpenNavBar);
  };


  return (
    <div class="container-fluid">
      <div class={`${styles["main-content"]} row`}>
        {IsOpenNavBar && (
          <div
            class={`${styles["control-panel"]} ${styles["control-panel--rounded"]} d-sm-flex flex-column d-flex justify-content-between`}
          >
            <div
              class={`${styles["user_info"]} d-flex justify-content-center align-items-center`}
            >
              <img src={userInfo.photoURL ? userInfo.photoURL : "./img/user.png"} alt="Avatar" class={`${styles["avatar"]} col-5 g-0`} />
              <span class="flex-grow-1">{userInfo.displayName}</span>
              <i
                class="fas fa-cog me-1 ml-1"
                onClick={() => setIsHoveringSetting(!isHoveringSetting)}
              >
                {isHoveringSetting && (
                  <div
                    onMouseOver={() => setIsHoveringSetting(true)}
                    className={`${styles["config_popup"]}`}
                  >
                    <div
                      onClick={() => setIsOpenUserInformation(true)}
                      onMouseOut={() =>
                        setIsHoveringSetting(!isHoveringSetting)
                      }
                    >
                      User Information
                    </div>
                    <div
                      onClick={() => logout()}
                      onMouseOut={() =>
                        setIsHoveringSetting(!isHoveringSetting)
                      }
                    >
                      Sign Out
                    </div>
                  </div>
                )}
              </i>

              <i
                onClick={() => handleOnNavBarClick()}
                class="fa fa-bars"
              ></i>
            </div>

            <div class={`${styles["container-historical-chats"]} flex-grow-1`}>
              <div class={`${styles["line"]}`}></div>

              <HistoricalChats
                addChatName={addChatName}
                updateChatName={updateChatName}
                onChatClick={handleOnChatClick}
                onCreateChat={handleOnCreateChat}
                onDeleteChat={handleOnDeleteChat}
                onEditChat={handleOnEditChat}
              ></HistoricalChats>
            </div>
          </div>
        )}

        <div
          class={`${styles["chatbot"]} g-0 col-sm-8 col-lg-9 d-flex flex-column align-items-center justify-content-between`}
        >
          <div
            class={`${styles["title"]} d-flex justify-content-center align-items-center`}
          >
            <i
              onClick={() => handleOnNavBarClick()}
              class="fa fa-bars"
              aria-hidden="true"
            ></i>
            <h1>Cohere Chatbot</h1>
            <img src="./img/thunder.png" alt="thunder" />
          </div>

          <ChatbotDialog
            setOnAddChatName={setAddChatName}
            setOnUpdateChatName={setUpdateChatName}
            nameChat={nameChatObj}
          ></ChatbotDialog>
        </div>

        <UserInformationModal
          show={isOpenUserInformation}
          userInfo={userInfo}
          onClose={() => setIsOpenUserInformation(false)}
          onEditClick={handleUserInformationEditClick}
        ></UserInformationModal>

        <AboutUsModal
          show={isOpenAboutUs}
          onClose={() => setIsOpenAboutUs(false)}
        ></AboutUsModal>

        {/* Edit User Modal Here */}
        {isOpenEditUserInformation && (
          <div class={`${styles["editUserModal"]}`}>
            <EditUserModal
              userInfo={getCurrentUser()}
              onClose={() => setIsOpenEditUserInformation(false)}
            ></EditUserModal>
          </div>
        )}
        <div class={`${styles["line"]}`}></div>
        <div
          class={`${styles["about_us"]} d-flex align-items-center`}
          onClick={() => setIsOpenAboutUs(true)}
        >
          <i class="fas fa-info-circle me-2"></i>
          <span>About us</span>
        </div>
      </div>
    </div>
  );
}
