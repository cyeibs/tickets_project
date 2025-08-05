import { Slide, ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "./Toast.module.scss";

export interface ToastProps {
  position?:
    | "top-right"
    | "top-center"
    | "top-left"
    | "bottom-right"
    | "bottom-center"
    | "bottom-left";
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
}

export const Toast = ({
  position = "top-center",
  autoClose = 3000,
  hideProgressBar = true,
  closeOnClick = false,
  pauseOnHover = true,
  draggable = true,
}: ToastProps) => {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop
      closeOnClick={closeOnClick}
      rtl={false}
      transition={Slide}
      pauseOnFocusLoss
      draggable={draggable}
      pauseOnHover={pauseOnHover}
      closeButton={false}
      limit={1}
    />
  );
};

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
};
