import { CAMPANHA_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarCampanha() {
  const { toastError } = useToast();

  async function _criarCampanha(data) {
  const response = await axiosInstance.post(`${CAMPANHA_URL}/`, data);
  return response;
}

  async function criarCampanha(data) {
    try {
      const response = await _criarCampanha(data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarCampanha };
}
