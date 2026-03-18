import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useRemoverItemPersonagem() {
  const { toastError } = useToast();

  async function _removerItemPersonagem(itemId) {
  const response = await axiosInstance.delete(`${PERSONAGEM_URL}/itens/${itemId}`);
  return response;
}

  async function removerItemPersonagem(itemId) {

    try {
      const response = await _removerItemPersonagem(itemId)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { removerItemPersonagem };
}
