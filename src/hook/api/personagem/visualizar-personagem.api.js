import { PERSONAGEM_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useVisualizarPersonagem() {
  const [personagem, setPersonagem] = useState(null)
  const { toastError } = useToast();

  async function _visualizarPersonagem(personagemId, usuarioId) {
    const response = await axiosInstance.get(`${PERSONAGEM_URL}/${personagemId}${usuarioId ? `?usuarioId=${usuarioId}`: ""}`);
    return response.data;
  }

  async function visualizarPersonagem(personagemId, usuarioId) {
    try {
      const _personagem = await _visualizarPersonagem(personagemId, usuarioId)
      setPersonagem(_personagem)
      return _personagem
    } catch (error) {
      toastError(error)
    }
  }

  return { personagem, setPersonagem, visualizarPersonagem };
}
