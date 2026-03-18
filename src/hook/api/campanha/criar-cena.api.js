import { CAMPANHA_URL } from '../../../constants';
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useCriarCena() {
  const { toastError } = useToast();

  async function _criarCena(campanhaId, data) {
    const response = await axiosInstance.post(`${CAMPANHA_URL}/${campanhaId}/cenas`, data);
    return response.data;
  }

  async function criarCena(campanhaId, data) {
    try {
      const response = await _criarCena(campanhaId, data)
      return response
    } catch (error) {
      toastError(error)
    }
  }

  return { criarCena };
}
