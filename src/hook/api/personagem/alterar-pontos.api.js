import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarPontos() {
  const { toastError } = useToast();

  async function _alterarPontos(personagemId, data) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/${personagemId}/pontos`, data);
  return response;
}

  async function alterarPontos(personagemId, data) {
    try {
      const response = await _alterarPontos(personagemId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarPontos };
}
