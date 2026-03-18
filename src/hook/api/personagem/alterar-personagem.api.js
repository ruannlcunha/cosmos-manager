import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarPersonagem() {
  const { toastError } = useToast();

  async function _alterarPersonagem(personagemId, data) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/${personagemId}`, data);
  return response;
}

  async function alterarPersonagem(personagemId, data) {
    try {
      const response = await _alterarPersonagem(personagemId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarPersonagem };
}
