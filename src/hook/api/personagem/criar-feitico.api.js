import { PERSONAGEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarFeitico() {
  const { toastError } = useToast();

  async function _criarFeitico(personagemId, imagem_id, nome, descricao, custo, alvos, duracao, ofensivo) {
  const response = await axiosInstance.post(`${PERSONAGEM_URL}/feiticos`, {personagemId, imagem_id, nome, descricao, custo, alvos, duracao, ofensivo});
  return response;
}

  async function criarFeitico(personagemId, imagem_id, nome, descricao, custo, alvos, duracao, ofensivo) {
    try {
      const response = await _criarFeitico(personagemId, imagem_id, nome, descricao, custo, alvos, duracao, ofensivo)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarFeitico };
}
