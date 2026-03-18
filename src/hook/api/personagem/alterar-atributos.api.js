import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarAtributos() {
  const { toastError } = useToast();

  async function _alterarAtributos(personagemId, data) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/${personagemId}/atributos`, data);
  return response;
}

  async function alterarAtributos(personagemId, data) {
    try {
      const response = await _alterarAtributos(personagemId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarAtributos };
}
