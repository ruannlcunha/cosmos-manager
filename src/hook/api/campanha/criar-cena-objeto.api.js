import { CAMPANHA_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarCenaObjeto() {
  const { toastError } = useToast();

  async function _criarCenaObjeto(campanhaId, cenaId, data) {
  const response = await axiosInstance.post(`${CAMPANHA_URL}/${campanhaId}/cenas/${cenaId}/objetos`, data);
  return response;
}

  async function criarCenaObjeto(campanhaId, cenaId, data) {

    try {
      const response = await _criarCenaObjeto(campanhaId, cenaId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarCenaObjeto };
}
