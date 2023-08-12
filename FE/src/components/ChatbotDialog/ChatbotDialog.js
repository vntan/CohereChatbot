import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./ChatbotDialog.module.scss";
import { getCurrentUser } from "../../utilities/firebase";
import { formatDate } from "../../utilities/format";

export default function ChatbotDialog({ setOnAddChatName, setChatName, setOnUpdateChatName, nameChat }) {
    const bottomRef = useRef(null);
    const [nameChatObj, setNameChatObj] = useState(nameChat);
    const [chatDialog, setChatDialog] = useState([]);
    const [isProcessAddTitle, setProcessAddTitle] = useState(false);
    const [isLoadingChat, setLoadingChat] = useState(false);
    const [titleInput, setTitleInput] = useState("");
    const [questionInput, setQuestionInput] = useState("");
    const [isWaitingAnswer, setIsWaitingAnswer] = useState(false);
    const [listModels, setListModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState("");

    useEffect(() => {
        axios
            .get("apis/models")
            .then((res) => {
                const data = res.data;
                setListModels(data);
                if (data.length > 0) setSelectedModel(data[0]);
            })
            .catch((err) => {
                setListModels(["command-nightly"]);
                setSelectedModel(listModels[0]);
            });
    }, []);

    useEffect(() => {
        if (chatDialog.length !== 0 && chatDialog.length % 2 === 0 && !isWaitingAnswer) {
            setIsWaitingAnswer(true);
            axios
                .post("apis/loadProcess", {
                    uid: getCurrentUser().uid,
                    chatID: nameChatObj.chatID,
                })
                .then((res) => {
                    //console.log(res);
                    const data = res.data;
                    setChatDialog(data["userChat"]);
                    setIsWaitingAnswer(false);
                })
                .catch((err) => {
                    //console.log(err);
                    setIsWaitingAnswer(false);
                });
        }
    }, [chatDialog]);

    useEffect(() => {
        setChatDialog([]);
        setQuestionInput("");
        setLoadingChat(false);
        setNameChatObj(nameChat);
    }, [nameChat]);

    useEffect(() => {
        setChatDialog([]);
        setQuestionInput("");
        setIsWaitingAnswer(false);

        if (nameChatObj.chatID !== null && nameChatObj.chatID !== "") {
            setLoadingChat(true);
            axios
                .post("apis/loadChat", {
                    uid: getCurrentUser().uid,
                    chatID: nameChatObj.chatID,
                })
                .then((res) => {
                    //console.log(res);
                    const data = res.data;
                    setChatDialog(data["userChat"]);
                    setLoadingChat(false);
                })
                .catch((err) => {
                    //console.log(err);
                    setLoadingChat(false);
                });
        }
    }, [nameChatObj]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }, [chatDialog, isWaitingAnswer]);

    const handleKeyDown = (e) => {
        // Reset field height
        e.target.style.height = "inherit";

        // Get the computed styles for the element
        const computed = window.getComputedStyle(e.target);

        // Calculate the height
        const height = parseInt(computed.getPropertyValue("padding-top"), 10) + e.target.scrollHeight + parseInt(computed.getPropertyValue("padding-bottom"), 10);

        e.target.style.height = `${Math.min(60, height)}px`;

        if (e.keyCode === 13 && !e.shiftKey) {
            //Stops enter from creating a new line
            e.preventDefault();
            handleSendClick();
            return true;
        }
    };

    const handleKeyDownTitle = (e) => {
        if (e.keyCode === 13) {
            //Stops enter from creating a new line
            e.preventDefault();
            handleAddNewChat();
            return true;
        }
    };

    const handleAddNewChat = () => {
        if (isProcessAddTitle || titleInput === "") return;
        setProcessAddTitle(true);
        setOnAddChatName(true);

        axios
            .post("apis/createChat", {
                uid: getCurrentUser().uid,
                chatName: titleInput,
            })
            .then((res) => {
                const data = res["data"];
                const nameChat = {
                    chatID: data["chatID"],
                    chatName: titleInput,
                    createTime: data["createTime"],
                };

                setNameChatObj({ ...nameChat });
                setChatName({ ...nameChat });
                setTitleInput("");
                setProcessAddTitle(false);
                setOnAddChatName(false);
            })
            .catch((err) => {
                //console.log(err);
                setTitleInput("");
                setProcessAddTitle(false);
                setOnAddChatName(false);
            });
    };

    const handleSendClick = () => {
        if (isLoadingChat || isWaitingAnswer || questionInput === "") return;

        const question = questionInput;
        setQuestionInput("");
        chatDialog.push({
            message: question,
            time: new Date().toString(),
        });
        setChatDialog([...chatDialog]);
        setIsWaitingAnswer(true);

        const current_chat = { ...nameChatObj };
        axios
            .post("apis/question", {
                uid: getCurrentUser().uid,
                chatID: current_chat.chatID,
                question: question,
                model: selectedModel,
            })
            .then((res) => {
                //console.log(res);
                const data = res.data;

                const item = JSON.parse(localStorage.getItem("CurrentChat"));
            
                if (item.chatID === current_chat.chatID) {
                    chatDialog[chatDialog.length - 1].time = data["questionTime"];
                    chatDialog.push({
                        message: data["answer"],
                        time: data["answerTime"],
                    });
                    setChatDialog([...chatDialog]);
                    setIsWaitingAnswer(false);
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 400) {
                    axios
                        .post("apis/loadChat", {
                            uid: getCurrentUser().uid,
                            chatID: nameChatObj.chatID,
                        })
                        .then((res) => {
                            //console.log(res);
                            const data = res.data;
                            setChatDialog(data["userChat"]);
                        })
                        .catch((err) => {
                            //console.log(err);
                        });
                }
                else setIsWaitingAnswer(false);
            });
    };

    return (
        <>
            <div className={`${styles["chatbot-dialog-content"]} flex-grow-1 d-flex flex-column align-items-center w-100`}>
                <div class={`${styles["chatbot-dialog"]} `}>
                    <div className={`${styles["titleChat"]}`}>
                        {nameChatObj.chatName ? (
                            <>
                                <div>{nameChatObj.chatName}</div>
                                <div>
                                    <label for="models">Model: </label>
                                    <select
                                        value={selectedModel}
                                        id="models"
                                        onChange={(e) => {
                                            setSelectedModel(e.target.value);
                                        }}>
                                        {listModels.map((model) => {
                                            return <option value={model}>{model}</option>;
                                        })}
                                    </select>
                                </div>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    class={`${styles["inputTitleName"]} flex-grow-1`}
                                    onChange={(e) => setTitleInput(e.target.value)}
                                    value={titleInput}
                                    onKeyDown={handleKeyDownTitle}
                                    disabled={isProcessAddTitle}
                                    placeholder="Input your title"
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
                                return pos % 2 === 0 ? (
                                    <>
                                        <div ref={bottomRef} title={formatDate(item["time"])}>
                                            <img src="./img/chatbot.png" alt="bot_chat" />
                                            <span>{item["message"]}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div ref={bottomRef} title={formatDate(item["time"])}>
                                        <img src={getCurrentUser().photoURL ? getCurrentUser().photoURL : "./img/user.png"} alt="bot_chat" />
                                        <span>{item["message"]}</span>
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
