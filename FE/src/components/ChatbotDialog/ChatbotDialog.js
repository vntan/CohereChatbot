import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./ChatbotDialog.module.scss";
import { getCurrentUser } from "../../utilities/firebase";

export default function ChatbotDialog({ setOnAddChatName, setOnUpdateChatName, nameChat }) {
    const bottomRef = useRef(null);
    const [nameChatObj, setNameChatObj] = useState(nameChat);
    const [chatDialog, setChatDialog] = useState([]);
    const [isProcessAddTitle, setProcessAddTitle] = useState(false);
    const [isLoadingChat, setLoadingChat] = useState(false);
    const [titleInput, setTitleInput] = useState("");
    const [questionInput, setQuestionInput] = useState("");
    const [isWaitingAnswer, setIsWaitingAnswer] = useState(false);

    useEffect(() => {
        if (isWaitingAnswer){
            localStorage.setItem(
                nameChatObj.chatID,
                JSON.stringify({
                    isWaitingAnswer: true,
                    chatDialog: chatDialog,
                }),
            );
            
            setNameChatObj(nameChat);
            return
        }
        setChatDialog([]);
        setQuestionInput("");
        setIsWaitingAnswer(false);
        setLoadingChat(false);
        setNameChatObj(nameChat);
    }, [nameChat]);

    useEffect(() => {
        localStorage.setItem('Curr', JSON.stringify(nameChatObj))
        if (!nameChatObj || !nameChatObj.chatID) {
            setChatDialog([]);
            setQuestionInput("");
            setTitleInput("");
            return;
        }

        

        const items = JSON.parse(localStorage.getItem(nameChatObj.chatID));

        if (items){
            setChatDialog(items["chatDialog"])
            setIsWaitingAnswer(items.isWaitingAnswer);
            return;
        }

        setChatDialog([]);
        setQuestionInput("");
        setIsWaitingAnswer(false);
        setLoadingChat(true);
        axios
            .post("getOneChat", {
                uid: getCurrentUser().uid,
                chatID: nameChatObj.chatID,
            })
            .then((res) => {
                console.log(res);
                const data = res.data;
                setChatDialog(data["userChat"]);
                setLoadingChat(false);
            })
            .catch((err) => {
                console.log(err);
                setLoadingChat(false);
            });
        setTimeout(() => {
            setLoadingChat(false);
        }, 3000);
    }, [nameChatObj]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatDialog]);

    const handleKeyDown = (e) => {
        // Reset field height
        e.target.style.height = "inherit";

        // Get the computed styles for the element
        const computed = window.getComputedStyle(e.target);

        // Calculate the height
        const height = parseInt(computed.getPropertyValue("padding-top"), 10) + e.target.scrollHeight + parseInt(computed.getPropertyValue("padding-bottom"), 10);

        e.target.style.height = `${Math.min(60, height)}px`;

        if (e.keyCode == 13 && !e.shiftKey) {
            //Stops enter from creating a new line
            e.preventDefault();
            handleSendClick();
            return true;
        }
    };

    const handleKeyDownTitle = (e) => {
        if (e.keyCode == 13) {
            //Stops enter from creating a new line
            e.preventDefault();
            handleAddNewChat();
            return true;
        }
    };

    const handleAddNewChat = () => {
        if (isProcessAddTitle || titleInput == "") return;
        setProcessAddTitle(true);
        axios
            .post("createChat", {
                uid: getCurrentUser().uid,
                chatName: titleInput,
            })
            .then((res) => {
                const data = res["data"];
                const nameChat = {
                    chatID: data["chatID"],
                    chatName: titleInput,
                };

                setNameChatObj({ ...nameChat });
                setOnAddChatName({ ...nameChat });
                setProcessAddTitle(false);
            })
            .catch((err) => {
                console.log(err);
                setProcessAddTitle(false);
            });
    };

    const handleSendClick = () => {
        if (isLoadingChat || isWaitingAnswer || questionInput == "") return;

        const question = questionInput;
        setQuestionInput("");
        chatDialog.push(question);
        setChatDialog([...chatDialog]);
        setIsWaitingAnswer(true);

        const current_chat = { ...nameChatObj };
        axios
            .post("question", {
                uid: getCurrentUser().uid,
                chatID: current_chat.chatID,
                question: question,
            })
            .then((res) => {
                console.log(res);
                const data = res.data;
                
                const item = JSON.parse(localStorage.getItem("Curr"));
                
                if (item.chatID === current_chat.chatID) {
                    chatDialog.push(data["answer"]);
                    setChatDialog([...chatDialog]);
                }

                localStorage.removeItem(current_chat.chatID);
                setIsWaitingAnswer(false);
            })
            .catch((err) => {
                console.log(err);
                setIsWaitingAnswer(false);
            });
    };

    return (
        <>
            <div className={`${styles["chatbot-dialog-content"]} flex-grow-1 d-flex flex-column align-items-center w-100`}>
                <div class={`${styles["chatbot-dialog"]} `}>
                    <div className={`${styles["titleChat"]}`}>
                        {nameChatObj.chatName ? (
                            nameChatObj.chatName
                        ) : (
                            <>
                                <input
                                    type="text"
                                    class={`flex-grow-1`}
                                    onChange={(e) => setTitleInput(e.target.value)}
                                    value={titleInput}
                                    onKeyDown={handleKeyDownTitle}
                                    disabled={isProcessAddTitle}
                                />

                                <div className={`${isProcessAddTitle ? "d-none" : ""}`}>
                                    <i
                                        class="fas fa-check me-2 ml-2"
                                        onClick={(e) => {
                                            handleAddNewChat();
                                        }}></i>
                                </div>
                            </>
                        )}
                    </div>

                    <div className={`${styles["listChat"]}`}>
                        {isLoadingChat ? (
                            <div class={`${styles["loader-container"]}`}>
                                <div class={`${styles["loader"]}`}>
                                    <div class={`${styles["loader--wheel"]}`}></div>
                                    <div class={`${styles["loader--text"]}`}></div>
                                </div>
                            </div>
                        ) : (
                            chatDialog.map((item, pos) => {
                                return pos % 2 == 0 ? (
                                    <>
                                        <div ref={bottomRef}>
                                            <img src="./img/chatbot.png" alt="bot_chat" />
                                            <span>{item}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div ref={bottomRef}>
                                        <img src={getCurrentUser().photoURL ? getCurrentUser().photoURL : "./img/user.png"} alt="bot_chat" />
                                        <span>{item}</span>
                                    </div>
                                );
                            })
                        )}

                        {isWaitingAnswer && (
                            <>
                                <div ref={bottomRef} class={`${styles["waiting-bot"]}`}>
                                    <img src="./img/chatbot.png" alt="bot_chat" />
                                    <span>
                                        <div class={`${styles["dot-pulse"]}`}></div>
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div class={`${styles["input"]} d-flex  justify-content-center align-items-center`}>
                <textarea
                    id="input"
                    rows="1"
                    cols="100"
                    class="g-0"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    value={questionInput}
                    disabled={isLoadingChat || isWaitingAnswer || !nameChatObj.chatID}></textarea>
                <i class="fas fa-paper-plane g-0" onClick={handleSendClick}></i>
            </div>
        </>
    );
}
