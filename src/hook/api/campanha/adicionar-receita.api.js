import { CAMPANHA_URL } from '../../../constants';
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useAdicionarReceita() {
  const { toastError } = useToast();

  async function _adicionarReceita(campanhaId, receitaId) {
    const response = await axiosInstance.post(`${CAMPANHA_URL}/${campanhaId}/receitas/${receitaId}`);
    return response.data;
  }

  async function adicionarReceita(campanhaId, receitaId) {
    try {
      const _campanha = await _adicionarReceita(campanhaId, receitaId)
      return _campanha
    } catch (error) {
      toastError(error)
    }
  }

  return { adicionarReceita };
}
