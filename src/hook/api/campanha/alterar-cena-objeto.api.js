import { CAMPANHA_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarCenaObjeto() {
  const { toastError } = useToast();

  async function _alterarCenaObjeto(campanhaId, cenaId, objetoId, data) {
  const response = await axiosInstance.patch(`${CAMPANHA_URL}/${campanhaId}/cenas/${cenaId}/objetos/${objetoId}`, data);
  return response;
}

  async function alterarCenaObjeto(campanhaId, cenaId, objetoId, data) {

    try {
      const response = await _alterarCenaObjeto(campanhaId, cenaId, objetoId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarCenaObjeto };
}
