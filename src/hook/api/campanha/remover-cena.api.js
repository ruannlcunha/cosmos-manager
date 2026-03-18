import { CAMPANHA_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useRemoverCena() {
  const { toastError } = useToast();

  async function _removerCena(campanhaId, cenaId, data) {
  const response = await axiosInstance.delete(`${CAMPANHA_URL}/${campanhaId}/cenas/${cenaId}`, data);
  return response;
}

  async function removerCena(campanhaId, cenaId, data) {

    try {
      const response = await _removerCena(campanhaId, cenaId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { removerCena };
}
