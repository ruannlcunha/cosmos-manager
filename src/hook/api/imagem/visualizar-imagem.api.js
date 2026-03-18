
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";
import { IMAGEM_URL } from '../../../constants';

export function useVisualizarImagem() {
  const { toastError } = useToast();

  async function _visualizarImagem(imagemId) {
  const response = await axiosInstance.get(`${IMAGEM_URL}/${imagemId}`);
  return response.data;
}

  async function visualizarImagem(imagemId) {
    try {
      const response = await _visualizarImagem(imagemId)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { visualizarImagem };
}
