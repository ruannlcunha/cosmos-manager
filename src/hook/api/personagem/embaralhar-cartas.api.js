import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useEmbaralharCartas() {
  const { toastError } = useToast();

  async function _embaralharCartas(personagemId, data) {
  const response = await axiosInstance.put(`${PERSONAGEM_URL}/${personagemId}/baralho`, data);
  return response;
}

  async function embaralharCartas(personagemId, data) {
    try {
      const response = await _embaralharCartas(personagemId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { embaralharCartas };
}
