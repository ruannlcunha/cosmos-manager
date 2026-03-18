import { CAMPANHA_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarRegistroDiario() {
  const { toastError } = useToast();

  async function _alterarRegistroDiario(diarioId, data) {
  const response = await axiosInstance.patch(`${CAMPANHA_URL}/diario/${diarioId}`, data);
  return response;
}

  async function alterarRegistroDiario(diarioId, data) {

    try {
      const response = await _alterarRegistroDiario(diarioId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarRegistroDiario };
}
