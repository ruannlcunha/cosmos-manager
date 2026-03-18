import { RECEITA_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarReceita() {
  const { toastError, toastSuccess } = useToast();

  async function _criarReceita(data) {
  const response = await axiosInstance.post(`${RECEITA_URL}/`, data);
  return response;
}

  async function criarReceita(data) {
    try {
      const response = await _criarReceita(data)
      toastSuccess(`Sua receita de id (${response.data}) foi criada com sucesso!`)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarReceita };
}
