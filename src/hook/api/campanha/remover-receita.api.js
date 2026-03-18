import { CAMPANHA_URL } from '../../../constants';
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useRemoverReceita() {
  const { toastSuccess, toastError } = useToast();

  async function _removerReceita(campanhaId, receitaId) {
    const response = await axiosInstance.delete(`${CAMPANHA_URL}/${campanhaId}/receitas/${receitaId}`);
    return response.data;
  }

  async function removerReceita(campanhaId, receitaId) {
    try {
      const _campanha = await _removerReceita(campanhaId, receitaId)
      toastSuccess("Receita removida com sucesso!")
      return _campanha
    } catch (error) {
      toastError(error)
    }
  }

  return { removerReceita };
}
