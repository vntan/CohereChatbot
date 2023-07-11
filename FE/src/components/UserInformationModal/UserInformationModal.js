import React from 'react'
import styles from './UserInformationModal.module.scss'
import CustomModal from '../CustomModal/CustomModal'

export default function UserInformationModal({
    show,
    userInfo,
    onClose,
    onEditClick,
}) {
    return (
        <CustomModal
            title="User Information"
            show={show}
            isHasFooter={false}
            isHasEditButton={true}
            styleTitle={{ fontWeight: "800", fontSize: "24px" }}
            onCloseClick={onClose}
            onEditClick={onEditClick}
        >
            <img
                src={
                    userInfo.photoURL
                        ? userInfo.photoURL
                        : "./img/user.png"
                }
                alt="Avatar"
                class={`${styles["avatar_info"]} col-5 g-0`}
            />
            <br />

            <div className="d-flex justify-content-center align-items-center">
                <table className={`${styles["table_userInfo"]}`}>
                    <tr>
                        <td>Email</td>
                        <td>{userInfo.email}</td>
                    </tr>

                    <tr>
                        <td >Display Name</td>
                        <td>{userInfo.displayName}</td>
                    </tr>
                </table>
            </div>
        </CustomModal>
    )
}
