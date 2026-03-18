import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useRemoverClasse() {
  const { toastError } = useToast();

  async function _removerClasse(classeId) {
  const response = await axiosInstance.delete(`${PERSONAGEM_URL}/classes/${classeId}`);
  return response;
}

  async function removerClasse(classeId) {

    try {
      const response = await _removerClasse(classeId)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { removerClasse };
}
