import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarVisual() {
  const { toastError, toastSuccess } = useToast();

  async function _criarVisual(personagemId, data) {
  const response = await axiosInstance.post(`${PERSONAGEM_URL}/visuais/${personagemId}`, data);
  return response;
}

  async function criarVisual(personagemId, data) {
    try {
      const response = await _criarVisual(personagemId, data)
      toastSuccess(`Seu visual de id (${response.data}) foi criado com sucesso!`)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarVisual };
}
