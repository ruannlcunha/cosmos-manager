import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useRemoverLaco() {
  const { toastError } = useToast();

  async function _removerLaco(lacoId) {
  const response = await axiosInstance.delete(`${PERSONAGEM_URL}/lacos/${lacoId}`);
  return response;
}

  async function removerLaco(lacoId) {

    try {
      const response = await _removerLaco(lacoId)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { removerLaco };
}
