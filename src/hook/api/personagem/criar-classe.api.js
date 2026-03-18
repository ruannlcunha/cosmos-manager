import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarClasse() {
  const { toastError } = useToast();

  async function _criarClasse(data) {
  const response = await axiosInstance.post(`${PERSONAGEM_URL}/classes`, data);
  return response;
}

  async function criarClasse(data) {
    try {
      const response = await _criarClasse(data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarClasse };
}
