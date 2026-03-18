import { CAMPANHA_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useVisualizarCampanha() {
  const [campanha, setCampanha] = useState(null)
  const { toastError } = useToast();

  async function _visualizarCampanha(campanhaId, usuarioId) {
    const response = await axiosInstance.get(`${CAMPANHA_URL}/${usuarioId}/${campanhaId}`);
    return response.data;
  }

  async function visualizarCampanha(campanhaId, usuarioId) {
    try {
      const _campanha = await _visualizarCampanha(campanhaId, usuarioId)
      setCampanha(_campanha)
      return _campanha
    } catch (error) {
      toastError(error)
    }
  }

  return { campanha, setCampanha, visualizarCampanha };
}
