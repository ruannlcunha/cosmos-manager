import { USUARIO_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useAdicionarUsuarioPersonagem() {
  const { toastError } = useToast();

  async function _adicionarUsuarioPersonagem(usuarioId, personagemId) {
    const response = await axiosInstance.post(`${USUARIO_URL}/${usuarioId}/personagens/${personagemId}`);
    return response.data;
  }

  async function adicionarUsuarioPersonagem(usuarioId, personagemId) {
    try {
      const response = await _adicionarUsuarioPersonagem(usuarioId, personagemId)
      return response
    } catch (error) {
      toastError(error)
    }
  }

  return { adicionarUsuarioPersonagem };
}
