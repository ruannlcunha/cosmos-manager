import { CAMPANHA_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useListarCenas() {
  const [cenas, setCenas] = useState([])
  const { toastError } = useToast();

  async function _listarCenas(campanhaId) {
    const response = await axiosInstance.get(`${CAMPANHA_URL}/${campanhaId}/cenas`);
    return response.data;
  }

  async function listarCenas(campanhaId) {
    try {
      const _cenas = await _listarCenas(campanhaId)
      setCenas(_cenas)
      return _cenas
    } catch (error) {
      toastError(error)
    }
  }

  return { cenas, setCenas, listarCenas };
}
