import { USUARIO_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useRealizarLogin() {
  const { toastError } = useToast();

  async function _realizarLogin(usuario, senha) {
  const response = await axiosInstance.post(`${USUARIO_URL}/login`, {usuario, senha});
  return response;
}

  async function realizarLogin(usuario, senha) {
    try {
      const response = await _realizarLogin(usuario, senha)
      return response.data;
    } catch (error) {
      toastError(error)
    }
  }

  return { realizarLogin };
}
