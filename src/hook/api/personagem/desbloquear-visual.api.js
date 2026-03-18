import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useDesbloquearVisual() {
  const { toastSuccess, toastError } = useToast();

  async function _desbloquearVisual(personagemId, codigoSecreto) {
  const response = await axiosInstance.post(`${PERSONAGEM_URL}/${personagemId}/visuais/desbloquear`, {codigoSecreto});
  return response;
}

  async function desbloquearVisual(personagemId, codigoSecreto) {
    try {
      const response = await _desbloquearVisual(personagemId, codigoSecreto)
      toastSuccess("Visuais foram desbloqueados com sucesso!")
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { desbloquearVisual };
}
