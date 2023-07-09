import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../utilities/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./HistoricalChatsComponent.module.scss";
import axios from "axios";

export default function HistoricalChats({ isUpdateChats }) {
    const [chatList, setChatList] = useState([]);
    const [editChatName, setEditChatName] = useState("");
    const [deleteChatName, setDeleteChatName] = useState("");
    const [inputChatName, setInputChatName] = useState("");
    const [isProcessAdd, setProcessAdd] = useState(false);
    const [isProcessEdit, setProcessEdit] = useState(false);
    const [isProcessDelete, setProcessDetele] = useState(false);

    useEffect(() => {
        getChatNameList();
    }, []);

    const createNewChat = (name) => {
        setProcessAdd(true);
        axios
            .post("createChat", {
                uid: getCurrentUser().uid,
                chatName: name,
            })
            .then((res) => {
                console.log(res);
                chatList.push(name);
                setChatList([...chatList]);
                setProcessAdd(false);
            })
            .catch((err) => {
                console.log(err);
                setProcessAdd(false);
            });
    };

    const getChatNameList = () => {
        axios
            .post("getHistoricalChat", {
                uid: getCurrentUser().uid,
            })
            .then((res) => {
                console.log(res);
                const data = res["data"];
                const listHistory = data["listHistoricalChats"];
                setChatList(listHistory);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCreateChatClick = () => {
        //TODO
        createNewChat("Test " + Math.floor(Math.random() * 100).toString());
    };

    const handleDeleteChat = (name) => {
        setProcessDetele(true);
        setDeleteChatName(name);
        axios
            .post("deleteChat", {
                uid: getCurrentUser().uid,
                chatName: name,
            })
            .then((res) => {
                chatList.splice(chatList.indexOf(name), 1);
                setChatList([...chatList]);
                setProcessDetele(false);
                setDeleteChatName("");
            })
            .catch((err) => {
                console.log(err);
                setProcessDetele(false);
                setDeleteChatName("");
            });
    };

    const handleEditNameChat = (name) => {
        setEditChatName(name);
        setInputChatName(name);
    };

    const handleConfirmEditNameChat = (name) => {
        //TODO
        setProcessEdit(true);
        setTimeout(() => {
            
            setEditChatName("");
            setProcessEdit(false);
        }, 3000);

        /* Tham khảo
            setProcessEdit(true);
            const index = chatList.indexOf(name)
            if (index >= 0) chatList[index] = inputChatName;
            setChatList([...chatList]);
            setEditChatName("");
            setProcessEdit(false); 
        */
    };

    return (
        <>
            <div class={`${isProcessAdd && styles["loading-cursor"]} ${styles["chat_new"]} d-flex align-items-center`} onClick={handleCreateChatClick}>
                <i class="fas fa-plus-circle"></i>
                <span>Add new chat</span>
            </div>
            <div class={`${styles["history_panel_title"]}`}>History</div>
            <div class={`${styles["history_panel"]} flex-grow-1`}>
                {
                    // <!-- Chat Item -->
                    chatList.map((nameChat) => {
                        let isEdit = false;
                        if (nameChat === editChatName) isEdit = true;
                        return (
                            <div class={`${styles["chat_item"]} ${(isProcessDelete && nameChat == deleteChatName) || (isProcessEdit && nameChat == editChatName) ? styles["loading-cursor"] : ""} chat_item_edit d-flex align-items-center`}>
                                <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                                {isEdit ? (
                                    <input type="text" class={`flex-grow-1`} onChange={(e) => setInputChatName(e.target.value)} value={inputChatName} disabled={isProcessEdit} />
                                ) : (
                                    <span class={`${isProcessDelete && nameChat == deleteChatName ? styles["text-decoration-line-through"] : ""} flex-grow-1`}>{nameChat}</span>
                                )}

                                {!isEdit ? (
                                    <div class={`${isProcessDelete || isProcessEdit ? "" : styles["func"]} d-none`}>
                                        <i class="fas fa-edit me-1" onClick={() => handleEditNameChat(nameChat)}></i>
                                        <i
                                            class="fas fa-trash-alt"
                                            onClick={() => {
                                                handleDeleteChat(nameChat);
                                            }}
                                        ></i>
                                    </div>
                                ) : (
                                    <div class={`${styles["edit"]} ${isProcessDelete || isProcessEdit ? "d-none" : ""}`}>
                                        <i class="fas fa-check me-2 ml-2" onClick={() => handleConfirmEditNameChat(nameChat)}></i>
                                        <i class="fas fa-times" onClick={() => setEditChatName("")}></i>
                                    </div>
                                )}
                            </div>
                        );
                    })
                }
            </div>
        </>
    );
}
