import { CAMPANHA_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useVisualizarCena() {
  const [cena, setCena] = useState(null)
  const { toastError } = useToast();

  async function _visualizarCena(campanhaId, cenaId) {
    const response = await axiosInstance.get(`${CAMPANHA_URL}/${campanhaId}/cenas/${cenaId}`);
    return response.data;
  }

  async function visualizarCena(campanhaId, cenaId) {
    try {
      const _cena = await _visualizarCena(campanhaId, cenaId)
      setCena(_cena)
      return _cena
    } catch (error) {
      toastError(error)
    }
  }

  return { cena, setCena, visualizarCena };
}
