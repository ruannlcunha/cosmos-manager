import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarCarta() {
  const { toastError } = useToast();

  async function _alterarCarta(personagemId, cartaId, data) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/${personagemId}/baralho/${cartaId}`, data);
  return response;
}

  async function alterarCarta(personagemId, cartaId, data) {
    try {
      const response = await _alterarCarta(personagemId, cartaId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarCarta };
}
