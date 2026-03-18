import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarVisualAtivo() {
  const { toastError } = useToast();

  async function _alterarVisualAtivo(personagemId, visualId) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/${personagemId}/visuais/ativo`, {visualId});
  return response;
}

  async function alterarVisualAtivo(personagemId, visualId) {
    try {
      const response = await _alterarVisualAtivo(personagemId, visualId)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarVisualAtivo };
}
