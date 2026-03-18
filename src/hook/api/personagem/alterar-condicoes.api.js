import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarCondicoes() {
  const { toastError } = useToast();

  async function _alterarCondicoes(personagemId, data) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/${personagemId}/condicoes`, data);
  return response;
}

  async function alterarCondicoes(personagemId, data) {
    try {
      const response = await _alterarCondicoes(personagemId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarCondicoes };
}
