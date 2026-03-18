import { CAMPANHA_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useListarCampanhas() {
  const [campanhas, setCampanhas] = useState([])
  const { toastError } = useToast();

  async function _listarCampanhas(usuarioId) {
    const response = await axiosInstance.get(`${CAMPANHA_URL}/${usuarioId}`);
    return response.data;
  }

  async function listarCampanhas(usuarioId) {
    try {
      const _campanhas = await _listarCampanhas(usuarioId)
      setCampanhas(_campanhas)
      return _campanhas
    } catch (error) {
      toastError(error)
    }
  }

  return { campanhas, setCampanhas, listarCampanhas };
}
