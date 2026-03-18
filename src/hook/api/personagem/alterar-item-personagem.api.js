import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarItemPersonagem() {
  const { toastError } = useToast();

  async function _alterarItemPersonagem(itemId, data) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/itens/${itemId}`, data);
  return response;
}

  async function alterarItemPersonagem(itemId, data) {

    try {
      const response = await _alterarItemPersonagem(itemId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarItemPersonagem };
}
