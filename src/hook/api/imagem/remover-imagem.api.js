
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";
import { IMAGEM_URL } from '../../../constants';

export function useRemoverImagem() {
  const { toastError } = useToast();

  async function _removerImagem(imagemId) {
  const response = await axiosInstance.delete(`${IMAGEM_URL}/${imagemId}`);
  return response;
}

  async function removerImagem(imagemId) {
    try {
      const response = await _removerImagem(imagemId)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { removerImagem };
}
