import React, { useState, useEffect } from "react";
import axios from "axios";

import { logout, getCurrentUser } from "../../utilities/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./MainPage-Desktop.module.scss";
import AboutUsModal from "../../components/AboutUsModal/AboutUsModal";
import UserInformationModal from "../../components/UserInformationModal/UserInformationModal";
import EditUserModal from "../../components/EditUserModal/EditUserModal";
import HistoricalChats from "../../components/HistoricalChatsComponent/HistoricalChatsComponent";
import ChatbotDialog from "../../components/ChatbotDialog/ChatbotDialog";

export default function MainPageDesktop() {
    const [userInfo, setUserInfo] = useState(getCurrentUser());
    const [isHoveringSetting, setIsHoveringSetting] = useState(false);
    const [isOpenAboutUs, setIsOpenAboutUs] = useState(false);
    const [isOpenUserInformation, setIsOpenUserInformation] = useState(false);
    const [isOpenEditUserInformation, setIsOpenEditUserInformation] = useState(false);
    const [isUpdateHistoricalListChats, setIsUpdateHistoricalListChats] = useState(false);

    useEffect(() => {
        setUserInfo(getCurrentUser());
    }, [isOpenEditUserInformation]);



    const handleUserInformationEditClick = () => {
        setIsOpenUserInformation(false);
        setIsOpenEditUserInformation(true);
    };







    return (
        <div class="container-fluid">
            <div class={`${styles["main-content"]} row`}>
                <div class={`${styles["control-panel"]} ${styles["control-panel--rounded"]} g-0 col-sm-4 col-lg-3 d-none d-sm-flex flex-column d-flex justify-content-between`}>
                    <div class={`${styles["user_info"]} d-flex  justify-content-center align-items-center`}>
                        <img src={userInfo.photoURL ? userInfo.photoURL : "./img/user.png"} alt="Avatar" class={`${styles["avatar"]} col-5 g-0`} />
                        <span class="flex-grow-1">{userInfo.displayName}</span>
                        <i class="fas fa-cog" onClick={() => setIsHoveringSetting(!isHoveringSetting)}>
                            {isHoveringSetting && (
                                <div onMouseOver={() => setIsHoveringSetting(true)} className={`${styles["config_popup"]}`}>
                                    <div onClick={() => setIsOpenUserInformation(true)} onMouseOut={() => setIsHoveringSetting(!isHoveringSetting)}>
                                        User Information
                                    </div>
                                    <div onClick={() => logout()} onMouseOut={() => setIsHoveringSetting(!isHoveringSetting)}>
                                        Sign Out
                                    </div>
                                </div>
                            )}
                        </i>
                    </div>

                    <div class={`${styles["container-historical-chats"]} flex-grow-1`}>
                        <div class={`${styles["line"]}`}></div>
                       
                        <HistoricalChats isUpdateChats={isUpdateHistoricalListChats}></HistoricalChats>

                        <div class={`${styles["line"]}`}></div>
                    </div>

                    <div class={`${styles["about_us"]} d-flex align-items-center`} onClick={() => setIsOpenAboutUs(true)}>
                        <i class="fas fa-info-circle me-2"></i>
                        <span>About us</span>
                    </div>
                </div>

                <div class={`${styles["chatbot"]} g-0 col-sm-8 col-lg-9 d-flex flex-column align-items-center justify-content-between`}>
                    <div class={`${styles["title"]} d-flex justify-content-center align-items-center`}>
                        <h1>Cohere Chatbot</h1>
                        <img src="./img/thunder.png" alt="thunder" />
                    </div>
                    
                    <ChatbotDialog></ChatbotDialog>


                </div>

                <AboutUsModal show={isOpenAboutUs} onClose={() => setIsOpenAboutUs(false)}></AboutUsModal>
                <UserInformationModal
                    show={isOpenUserInformation}
                    userInfo={userInfo}
                    onClose={() => setIsOpenUserInformation(false)}
                    onEditClick={handleUserInformationEditClick}
                ></UserInformationModal>

                {/* Edit User Modal Here */}
                {isOpenEditUserInformation && <EditUserModal userInfo={getCurrentUser()} onClose={() => setIsOpenEditUserInformation(false)}></EditUserModal>}
            </div>
        </div>
    );
}
