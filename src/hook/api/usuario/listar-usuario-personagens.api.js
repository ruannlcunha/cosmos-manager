import { USUARIO_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useListarUsuariosPersonagens() {
  const [usuariosPersonagens, setUsuariosPersonagens] = useState([])
  const { toastError } = useToast();

  async function _listarUsuariosPersonagens(usuarioId) {
    const response = await axiosInstance.get(`${USUARIO_URL}/${usuarioId}/personagens`);
    return response.data;
  }

  async function listarUsuariosPersonagens(usuarioId) {
    try {
      const _usuariosPersonagens = await _listarUsuariosPersonagens(usuarioId)
      setUsuariosPersonagens(_usuariosPersonagens)
      return _usuariosPersonagens
    } catch (error) {
      toastError(error)
    }
  }

  return { usuariosPersonagens, setUsuariosPersonagens, listarUsuariosPersonagens };
}
