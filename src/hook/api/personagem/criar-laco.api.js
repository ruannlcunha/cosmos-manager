import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarLaco() {
  const { toastError } = useToast();

  async function _criarLaco(data) {
  const response = await axiosInstance.post(`${PERSONAGEM_URL}/lacos`, data);
  return response;
}

  async function criarLaco(data) {
    try {
      const response = await _criarLaco(data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarLaco };
}
