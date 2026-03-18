import { CAMPANHA_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useListarCenaObjetos() {
  const [cenaObjetos, setCenaObjetos] = useState([])
  const { toastError } = useToast();

  async function _listarCenaObjetos(campanhaId, cenaId) {
    const response = await axiosInstance.get(`${CAMPANHA_URL}/${campanhaId}/cenas/${cenaId}/objetos`);
    return response.data;
  }

  async function listarCenaObjetos(campanhaId, cenaId) {
    try {
      const _cenaObjetos = await _listarCenaObjetos(campanhaId, cenaId)
      setCenaObjetos(_cenaObjetos)
      return _cenaObjetos
    } catch (error) {
      toastError(error)
    }
  }

  return { cenaObjetos, setCenaObjetos, listarCenaObjetos };
}
