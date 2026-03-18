import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useMontarBaralho() {
  const { toastError} = useToast();

  async function _montarBaralho(personagemId, data) {
  const response = await axiosInstance.post(`${PERSONAGEM_URL}/${personagemId}/baralho`, data);
  return response;
}

  async function montarBaralho(personagemId, data) {
    try {
      const response = await _montarBaralho(personagemId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { montarBaralho };
}
