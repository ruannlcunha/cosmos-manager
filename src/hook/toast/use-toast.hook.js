import { toast } from "react-toastify";

export function useToast() {

  function toastSuccess(message) {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  function toastWarning(message) {
    toast.warn(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  function toastError(error) {
    let message = "Erro Interno do Servidor"
    if(error.response) {
      if(error.response.data) {
        if(error.response.data.message) {
          message = error.response.data.message
        }
        else {
          message = error.response.data
        }
      }
      else {
        message = error.response
      }
    }
    else {
      console.log(error);
    }
    
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  return { toastSuccess, toastWarning, toastError };
}
