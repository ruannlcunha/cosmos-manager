import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useRemoverPersonagem() {
  const { toastError, toastSuccess } = useToast();

  async function _removerPersonagem(personagemId) {
    const response = await axiosInstance.delete(`${PERSONAGEM_URL}/${personagemId}`);
    return response;
  }

  async function removerPersonagem(personagemId) {

    try {
      const response = await _removerPersonagem(personagemId)
      toastSuccess("Personagem removido.")
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { removerPersonagem };
}
