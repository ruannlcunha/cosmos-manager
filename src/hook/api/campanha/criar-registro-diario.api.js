import { CAMPANHA_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarRegistroDiario() {
  const { toastSuccess, toastError } = useToast();

  async function _criarRegistroDiario(campanhaId, data) {
    const response = await axiosInstance.post(`${CAMPANHA_URL}/${campanhaId}/diario`, data);
    return response;
  }

  async function criarRegistroDiario(campanhaId, data) {
    try {
      const response = await _criarRegistroDiario(campanhaId, data)
      toastSuccess("Registro criado no diário com sucesso!")
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarRegistroDiario };
}
