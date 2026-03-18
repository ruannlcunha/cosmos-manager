import { USUARIO_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useAdicionarUsuarioCampanha() {
  const { toastError } = useToast();

  async function _adicionarUsuarioCampanha(usuarioId, campanhaId) {
    const response = await axiosInstance.post(`${USUARIO_URL}/${usuarioId}/campanhas/${campanhaId}`);
    return response.data;
  }

  async function adicionarUsuarioCampanha(usuarioId, campanhaId) {
    try {
      const response = await _adicionarUsuarioCampanha(usuarioId, campanhaId)
      return response
    } catch (error) {
      toastError(error)
    }
  }

  return { adicionarUsuarioCampanha };
}
