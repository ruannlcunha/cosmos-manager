import { CAMPANHA_URL } from '../../../constants';
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useAdicionarCampanhaPersonagem() {
  const { toastError } = useToast();

  async function _adicionarCampanhaPersonagem(campanhaId, personagemId) {
    const response = await axiosInstance.post(`${CAMPANHA_URL}/${campanhaId}/personagens/${personagemId}`);
    return response.data;
  }

  async function adicionarCampanhaPersonagem(campanhaId, personagemId) {
    try {
      const response = await _adicionarCampanhaPersonagem(campanhaId, personagemId)
      return response
    } catch (error) {
      toastError(error)
    }
  }

  return { adicionarCampanhaPersonagem };
}
