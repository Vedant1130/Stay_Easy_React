import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={1500}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
  );
};

// ✅ Simplified Toast Function using Object Lookup
export const showToast = (message, type = "success") => {
  const toastTypes = {
    success: toast.success,
    error: toast.error,
    warning: toast.warn,
    info: toast.info,
  };

  // Call the correct toast function or fallback to default toast
  (toastTypes[type] || toast)(message);
};

export default ToastNotification;
