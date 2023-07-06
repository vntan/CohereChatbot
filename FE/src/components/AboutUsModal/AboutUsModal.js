import React from 'react'
import CustomModal from '../CustomModal/CustomModal'

export default function AboutUsModal({
    show=false,
    onClose
}) {
    return (
        <CustomModal
            title="About us"
            show={show}
            isHasFooter={false}
            isHasEditButton={false}
            styleTitle={{ fontWeight: "800", fontSize: "24px" }}
            onCloseClick={onClose}
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
    )
}
