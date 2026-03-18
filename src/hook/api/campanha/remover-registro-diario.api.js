import { CAMPANHA_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useRemoverRegistroDiario() {
  const { toastError } = useToast();

  async function _removerRegistroDiario(diarioId) {
  const response = await axiosInstance.delete(`${CAMPANHA_URL}/diario/${diarioId}`);
  return response;
}

  async function removerRegistroDiario(diarioId) {

    try {
      const response = await _removerRegistroDiario(diarioId)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { removerRegistroDiario };
}
