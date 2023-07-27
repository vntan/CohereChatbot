import React, { useState, useEffect } from "react";
import { logout, getCurrentUser } from "../../utilities/firebase";
import {
  redirect,
} from "react-router-dom";
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
  const [isOnAddChatName, setOnAddChatName] = useState(false);
  const [addChatName, setAddChatName] = useState({});
  const [nameChatObj, setNameChatObj] = useState({});
  const [IsOpenNavBar, setIsOpenNavBar] = useState(false);
  const [IsOpenChatbotDialog, setIsOpenChatbotDialog] = useState(true);

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
    setIsOpenChatbotDialog(!IsOpenChatbotDialog);
  };

  const logOutUser = () => {
    logout();
    redirect("/", { replace: true });
  };


  return (
    <div class="container-fluid">
      <div class={`${styles["main-content"]} row`}>
        <div
          class={`${styles["chatbot"]} g-0 col-sm-8 col-lg-9 d-flex flex-column align-items-center justify-content-between`}
        >
          <div
            class={`${styles["title"]} d-flex justify-content-center align-items-center`}
          >
            <i class="fa fa-bars" onClick={() => handleOnNavBarClick()}></i>
            <h1>Cohere Chatbot</h1>
            <img src="./img/thunder.png" alt="thunder" />
          </div>
          {/* control-panel here */}
          {IsOpenNavBar && (
            <div
              class={`${styles["control-panel"]} ${styles["control-panel--rounded"]} d-sm-flex flex-column d-flex justify-content-between`}
            >
              <div
                class={`${styles["user_info"]} d-flex justify-content-center align-items-center`}
              >
                <img
                  src={userInfo.photoURL ? userInfo.photoURL : "./img/user.png"}
                  alt="Avatar"
                  class={`${styles["avatar"]} col-5 g-0`}
                />
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
                        onClick={logOutUser}
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
                  class="fa fa-times"
                ></i>
              </div>

              <div
                class={`${styles["container-historical-chats"]} flex-grow-1`}
                onClick={() => handleOnNavBarClick()}
              >
                <div class={`${styles["line"]}`}></div>

                <HistoricalChats
                  isOnAddChatName={isOnAddChatName}
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
          {/* chatbot-dialog here */}
          {IsOpenChatbotDialog && (
            <ChatbotDialog
              setOnAddChatName={setOnAddChatName}
              setChatName={setAddChatName}
              setOnUpdateChatName={setUpdateChatName}
              nameChat={nameChatObj}
            ></ChatbotDialog>
          )}
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
