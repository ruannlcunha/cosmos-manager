import { USUARIO_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useListarUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const { toastError } = useToast();

  async function _listarUsuarios() {
    const response = await axiosInstance.get(`${USUARIO_URL}/`);
    return response.data;
  }

  async function listarUsuarios() {
    try {
      const _usuarios = await _listarUsuarios()
      setUsuarios(_usuarios)
      return _usuarios
    } catch (error) {
      toastError(error)
    }
  }

  return { usuarios, setUsuarios, listarUsuarios };
}
