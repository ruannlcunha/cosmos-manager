import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarItemPersonagem() {
  const { toastError } = useToast();

  async function _criarItemPersonagem(data) {
  const response = await axiosInstance.post(`${PERSONAGEM_URL}/itens`, data);
  return response;
}

  async function criarItemPersonagem(data) {
    try {
      const response = await _criarItemPersonagem(data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarItemPersonagem };
}
