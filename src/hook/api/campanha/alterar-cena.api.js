import { CAMPANHA_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarCena() {
  const { toastError } = useToast();

  async function _alterarCena(campanhaId, cenaId, data) {
  const response = await axiosInstance.patch(`${CAMPANHA_URL}/${campanhaId}/cenas/${cenaId}`, data);
  return response;
}

  async function alterarCena(campanhaId, cenaId, data) {

    try {
      const response = await _alterarCena(campanhaId, cenaId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarCena };
}
