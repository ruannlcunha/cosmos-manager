import { PERSONAGEM_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useListarPersonagens() {
  const [personagens, setPersonagens] = useState([])
  const { toastError } = useToast();

  async function _listarPersonagens(usuarioId) {
    const response = await axiosInstance.get(`${PERSONAGEM_URL}/${usuarioId ? `?usuarioId=${usuarioId}`: ""}`);
    return response.data;
  }

  async function listarPersonagens(usuarioId) {
    try {
      const _personagens = await _listarPersonagens(usuarioId)
      setPersonagens(_personagens)
      return _personagens
    } catch (error) {
      toastError(error)
    }
  }

  return { personagens, setPersonagens, listarPersonagens };
}
