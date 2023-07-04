import React from "react";
import styles from './CustomModal.scss'
import "bootstrap/dist/css/bootstrap.min.css";

export default function CustomModal({
  show = false,
  title = '',
  isHasEditButton = false,
  isHasFooter = true,
  isExitClickOutside = true,
  onCloseClick,
  onEditClick,
  onSaveChange,
  styleTitle,
  className,
  children }) {
  return (

    show &&
    <div className={`${className} modal`} style={{ display: "block" }} onClick={isExitClickOutside ? onCloseClick : null}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title align-items-center">
                <span style={styleTitle}>
                  {title}
                </span></h5>
              <div className="d-flex">

                {
                  isHasEditButton &&
                  <button type="button" className={`${styles["btn-close"]} btn-close d-flex`} onClick={onEditClick}>
                    <span aria-hidden="true"><i class="fas fa-edit"></i></span>
                  </button>
                }

                <button type="button" className={`${styles["btn-close"]} btn-close`} onClick={onCloseClick}>
                  <span aria-hidden="true"><i class="fas fa-times"></i></span>
                </button>
              </div>

            </div>
            <div className="modal-body">
              {children}
            </div>

            {
              isHasFooter &&
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={onSaveChange}>Save changes</button>
                <button type="button" className="btn btn-secondary" onClick={onCloseClick}>Close</button>
              </div>
            }

          </div>
        </div>
    </div>

  );
}
