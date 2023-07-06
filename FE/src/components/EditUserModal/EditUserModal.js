import React, { useState, useRef, useEffect } from "react";
import CustomModal from "../CustomModal/CustomModal";
import styles from "../EditUserModal/EditUserModal.module.scss";
import {
  uploadFile,
  updateDisplaynameUserProfile,
  updatePhotoURLUserProfile,
  changePassword,
} from "../../utilities/firebase";

export default function EditUserModal({ userInfo, onClose }) {
  const [inputDisplayName, setInputDisplayName] = useState(
    userInfo.displayName
  );
  const [errInputDisplayName, setErrorInputDisplayName] = useState("");
  const [errInputNewPassword, setErrorInputNewPassword] = useState("");
  const [errURLImage, setErrURLImage] = useState("");
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [urlImage, setURLImage] = useState(userInfo.photoURL);
  const [uploadLocalFile, setUploadLocalFile] = useState();
  const [isProcess, setProcess] = useState(false);
  const inputUploadFileRef = useRef(null);

  useEffect(() => {
    if (!uploadLocalFile) {
      setURLImage(userInfo.photoURL);
      return;
    }

    const objectUrl = URL.createObjectURL(uploadLocalFile);
    setURLImage(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadLocalFile]);

  const handlePictureClick = () => {
    if (isProcess) return;
    inputUploadFileRef.current.click();
  };

  const handleFileChange = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }

    setUploadLocalFile(fileObj);
  };

  const handleUpdateDisplayNamePassword = async () => {
    if (inputDisplayName && inputDisplayName.length > 0 && inputDisplayName != userInfo.displayName)
      await updateDisplaynameUserProfile(inputDisplayName);

    if (inputNewPassword && inputNewPassword.length > 0) await changePassword(inputNewPassword);
  };

  const handleUpdateUserInformation = async (e) => {
    e.preventDefault();

    setProcess(true);

    if (uploadLocalFile) {
      uploadFile(String.toString(userInfo.uid), uploadLocalFile, async (urlImage) => {
        if (urlImage) {
          await updatePhotoURLUserProfile(urlImage);
          setURLImage(urlImage);
        } else setErrURLImage("Cannot get the url image!");

        await handleUpdateDisplayNamePassword();
        setProcess(false);
        onClose();
        setUploadLocalFile(null);
      });
    } else {
      await handleUpdateDisplayNamePassword();
      setProcess(false);
      onClose();
    }
  };

  return (
    <CustomModal
      title="Edit User Information"
      show={true}
      isHasFooter={true}
      isHasEditButton={false}
      isDisableConfirmedButton={isProcess}
      styleTitle={{ fontWeight: "800", fontSize: "24px" }}
      onCloseClick={() => {
        !isProcess && onClose();
      }}
      isExitClickOutside={false}
      onSaveChange={handleUpdateUserInformation}
    >
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div
          className={`${styles["edit_avatar"]}`}
          onClick={handlePictureClick}
        >
          <img
            src={urlImage ? urlImage : "./img/user.png"}
            alt="Avatar"
            class={`${styles["avatar_info"]}`}
          />

          <div className="d-flex justify-content-center align-items-center">
            <i class="fas fa-camera"></i>
            <input
              style={{ display: "none" }}
              ref={inputUploadFileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
        {errURLImage && (
          <div className={`${styles["error"]}`}>{errURLImage}</div>
        )}
      </div>

      <br />

      <div className="d-flex justify-content-center align-items-center">
        <table className={`${styles["table_userInfo"]}`}>
          <tr>
            <td>Email</td>
            <td>{userInfo.email} </td>
          </tr>

          <tr>
            <td>Display Name</td>
            <td>
              <input
                type="text"
                value={inputDisplayName}
                onChange={(e) => setInputDisplayName(e.target.value)}
                disabled={isProcess}
              />
              {errInputDisplayName && (
                <div className={`${styles["error"]}`}>
                  {errInputDisplayName}
                </div>
              )}
            </td>
          </tr>

          <tr>
            <td>New Password</td>
            <td>
              <input
                type="password"
                onChange={(e) => setInputNewPassword(e.target.value)}
                disabled={isProcess}
              />
              {errInputNewPassword && (
                <div className={`${styles["error"]}`}>
                  {errInputNewPassword}
                </div>
              )}
            </td>
          </tr>
        </table>
      </div>
    </CustomModal>
  );
}
