import { RECEITA_URL } from '../../../constants';
import { useState } from "react";
import { useToast } from "../../toast/use-toast.hook";
import { axiosInstance } from '../_base/axios-instance.api';

export function useListarReceitas() {
  const [receitas, setReceitas] = useState([])
  const { toastError } = useToast();

  async function _listarReceitas() {
    const response = await axiosInstance.get(`${RECEITA_URL}/`);
    return response.data;
  }

  async function listarReceitas() {
    try {
      const _receitas = await _listarReceitas()
      setReceitas(_receitas)
      return _receitas
    } catch (error) {
      toastError(error)
    }
  }

  return { receitas, setReceitas, listarReceitas };
}
