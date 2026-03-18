import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarVisualVisibilidade() {
  const { toastError } = useToast();

  async function _alterarVisualVisibilidade(visualId, visibilidade) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/visuais/${visualId}`, {visivel: visibilidade});
  return response;
}

  async function alterarVisualVisibilidade(visualId, visibilidade) {
    try {
      const response = await _alterarVisualVisibilidade(visualId, visibilidade)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarVisualVisibilidade };
}
