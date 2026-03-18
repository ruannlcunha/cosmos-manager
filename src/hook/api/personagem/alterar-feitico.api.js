import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarFeitico() {
  const { toastError } = useToast();

  async function _alterarFeitico(feiticoId, data) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/feiticos/${feiticoId}`, data);
  return response;
}

  async function alterarFeitico(feiticoId, data) {

    try {
      const response = await _alterarFeitico(feiticoId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarFeitico };
}
