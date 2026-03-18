import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useRemoverFeitico() {
  const { toastError } = useToast();

  async function _removerFeitico(feiticoId) {
  const response = await axiosInstance.delete(`${PERSONAGEM_URL}/feiticos/${feiticoId}`);
  return response;
}

  async function removerFeitico(feiticoId) {

    try {
      const response = await _removerFeitico(feiticoId)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { removerFeitico };
}
