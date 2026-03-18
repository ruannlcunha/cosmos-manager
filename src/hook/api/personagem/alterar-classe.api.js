import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarClasse() {
  const { toastError } = useToast();

  async function _alterarClasse(classeId, data) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/classes/${classeId}`, data);
  return response;
}

  async function alterarClasse(classeId, data) {
    try {
      const response = await _alterarClasse(classeId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarClasse };
}
