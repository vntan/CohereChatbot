import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../utilities/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./HistoricalChatsComponent.module.scss";
import axios from "axios";

export default function HistoricalChats({ addChatName = { chatID: "", chatName: "" }, updateChatName = { chatID: "", rename: "" }, onChatClick = () => {}, onCreateChat = () => {}, onDeleteChat = () => {}, onEditChat = () => {} }) {
    const [chatList, setChatList] = useState([]);
    const [inputChatName, setInputChatName] = useState("");
    const [isProcessAdd, setProcessAdd] = useState(false);

    const [editChatID, setEditChatID] = useState("");
    const [isProcessEdit, setProcessEdit] = useState(false);

    const [deleteChatID, setDeleteID] = useState("");
    const [isProcessDelete, setProcessDelete] = useState(false);

    useEffect(() => {
        getChatNameList();
    }, []);

    useEffect(() => {
        if (updateChatName.chatID && updateChatName.chatID != "") {
            if (updateChatName.rename && updateChatName.rename != "") {
                const index = chatList.findIndex((item) => item.chatID === updateChatName.chatID);
                if (index >= 0) chatList[index] = updateChatName.rename;
            }
        }
    }, [updateChatName]);

    useEffect(() => {
        if (addChatName.chatID && addChatName.chatID != "") {
            if (addChatName.chatName && addChatName.chatName != "") {
                chatList.push({
                    ...addChatName
                });
                setChatList([...chatList]);
            }
        }
    }, [addChatName]);


    const getChatNameList = () => {
        axios
            .post("apis/getHistoricalChat", {
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
        onCreateChat();
    };

    const handleDeleteChat = (nameChatObj, pos) => {
        setProcessDelete(true);
        setDeleteID(nameChatObj.chatID);
        axios
            .post("apis/deleteChat", {
                uid: getCurrentUser().uid,
                chatID: nameChatObj.chatID,
            })
            .then((res) => {
                chatList.splice(pos, 1);
                setChatList([...chatList]);
                setProcessDelete(false);
                setDeleteID("");
                onDeleteChat(nameChatObj);
            })
            .catch((err) => {
                console.log(err);
                setProcessDelete(false);
                setDeleteID("");
            });
    };

    const handleEditNameChat = (nameChatObj) => {
        setEditChatID(nameChatObj.chatID);
        setInputChatName(nameChatObj.chatName);
    };

    const handleCancelNameChat = () => {
        setEditChatID("");
    };

    const handleConfirmEditNameChat = (nameChatObj, pos) => {
        if (inputChatName === nameChatObj.chatName || inputChatName == "") {
            setProcessEdit(false);
            setEditChatID("");
            return;
        }

        setProcessEdit(true);
        setEditChatID(nameChatObj.chatID);
        axios
            .post("apis/renameChat", {
                uid: getCurrentUser().uid,
                chatID: nameChatObj.chatID,
                newChatName: inputChatName,
            })
            .then((res) => {
                chatList[pos].chatName = inputChatName;
                setChatList([...chatList]);
                setProcessEdit(false);
                setEditChatID("");
                onEditChat(nameChatObj);
            })
            .catch((err) => {
                console.log(err);
                setProcessEdit(false);
                setEditChatID("");
            });
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
                    chatList.map((nameChatObj, pos) => {
                        const isEdit = editChatID === nameChatObj.chatID;
                        const isIDChatDelete = deleteChatID === nameChatObj.chatID;
                        const isIDChatEdit = editChatID === nameChatObj.chatID;

                        const isLoading = (isProcessDelete && isIDChatDelete) || (isProcessEdit && isIDChatEdit);
                        return (
                            <>
                                <div
                                    onClick={(e) => {
                                        if (isIDChatDelete || isIDChatEdit) return;
                                        onChatClick(nameChatObj);
                                    }}
                                    class={`${styles["chat_item"]} ${isLoading ? styles["loading-cursor"] : ""} chat_item_edit d-flex align-items-center`}>
                                    <img src="img/chat_icon.png" class="me-2" alt="chat_icon"></img>
                                    {!isEdit ? (
                                        <>
                                            <span class={`${isProcessDelete && isIDChatDelete ? styles["text-decoration-line-through"] : ""} flex-grow-1`}>{nameChatObj.chatName}</span>

                                            <div class={`${isProcessDelete || isProcessEdit ? "d-none" : styles["func"]} d-none`}>
                                                <i
                                                    class="fas fa-edit me-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditNameChat(nameChatObj);
                                                    }}></i>
                                                <i
                                                    class="fas fa-trash-alt"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteChat(nameChatObj, pos);
                                                    }}></i>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <input type="text" class={`flex-grow-1`} onChange={(e) => setInputChatName(e.target.value)} value={inputChatName} disabled={isProcessEdit} />

                                            <div class={` ${isProcessDelete || isProcessEdit ? "d-none" : styles["edit"]}`}>
                                                <i
                                                    class="fas fa-check me-2 ml-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleConfirmEditNameChat(nameChatObj, pos);
                                                    }}></i>
                                                <i
                                                    class="fas fa-times"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCancelNameChat();
                                                    }}></i>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        );
                    })
                }
            </div>
        </>
    );
}
