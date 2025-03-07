import { toast } from "react-toastify";

const ToastMessage = (type, message) => {
  const options = {
    style: { fontFamily: "Outfit, sans-serif" },
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;                  
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    default:
      toast(message, options);
  }
};
export default ToastMessage;
