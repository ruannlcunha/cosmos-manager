import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarPersonagem() {
  const { toastError, toastSuccess } = useToast();

  async function _criarPersonagem(data) {
  const response = await axiosInstance.post(`${PERSONAGEM_URL}/`, data);
  return response;
}

  async function criarPersonagem(data) {
    try {
      const response = await _criarPersonagem(data)
      toastSuccess(`Seu personagem de id (${response.data}) foi criado com sucesso!`)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarPersonagem };
}
