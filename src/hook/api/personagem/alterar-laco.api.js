import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarLaco() {
  const { toastError } = useToast();

  async function _alterarLaco(lacoId, data) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/lacos/${lacoId}`, data);
  return response;
}

  async function alterarLaco(lacoId, data) {
    try {
      const response = await _alterarLaco(lacoId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarLaco };
}
