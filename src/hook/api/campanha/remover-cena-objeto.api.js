import { CAMPANHA_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useRemoverCenaObjeto() {
  const { toastError, toastSuccess } = useToast();

  async function _removerCenaObjeto(campanhaId, cenaId, objetoId) {
  const response = await axiosInstance.delete(`${CAMPANHA_URL}/${campanhaId}/cenas/${cenaId}/objetos/${objetoId}`);
  return response;
}

  async function removerCenaObjeto(campanhaId, cenaId, objetoId) {

    try {
      const response = await _removerCenaObjeto(campanhaId, cenaId, objetoId)
      toastSuccess("Objeto removido com sucesso!")
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { removerCenaObjeto };
}
