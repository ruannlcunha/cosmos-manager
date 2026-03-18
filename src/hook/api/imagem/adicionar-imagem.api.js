
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";
import { IMAGEM_URL } from '../../../constants';

export function useAdicionarImagem() {
  const { toastError } = useToast();

  async function _adicionarImagem(data) {
  const response = await axiosInstance.post(`${IMAGEM_URL}/`, data);
  return response;
}

  async function adicionarImagem(data) {
    try {
      const response = await _adicionarImagem(data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { adicionarImagem };
}
