import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarEquipamento() {
  const { toastError } = useToast();

  async function _alterarEquipamento(equipamentoId, data) {
  const response = await axiosInstance.patch(`${PERSONAGEM_URL}/equipamentos/${equipamentoId}`, data);
  return response;
}

  async function alterarEquipamento(equipamentoId, data) {
    try {
      const response = await _alterarEquipamento(equipamentoId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarEquipamento };
}
