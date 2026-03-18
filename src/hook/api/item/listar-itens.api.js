import { ITEM_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useListarItens() {
  const [itens, setItens] = useState([])
  const { toastError } = useToast();

  async function _listarItens(filtro) {
    const _filtro = filtro ? filtro : ""
    const response = await axiosInstance.get(`${ITEM_URL}/?filtro=${_filtro}`);
    return response.data;
  }

  async function listarItens(filtro) {
    try {
      const _itens = await _listarItens(filtro)
      setItens(_itens)
      return _itens
    } catch (error) {
      toastError(error)
    }
  }

  return { itens, setItens, listarItens };
}
