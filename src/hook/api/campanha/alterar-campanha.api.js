import { CAMPANHA_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarCampanha() {
  const { toastError } = useToast();

  async function _alterarCampanha(campanhaId, data) {
  const response = await axiosInstance.patch(`${CAMPANHA_URL}/${campanhaId}`, data);
  return response;
}

  async function alterarCampanha(campanhaId, data) {

    try {
      const response = await _alterarCampanha(campanhaId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarCampanha };
}
