import { useState } from 'react';
import { axiosInstance } from '../_base/axios-instance.api';

export function useVerificarConexao() {
  const [conexao, setconexao] = useState({loading: true, result: false})

  async function _verificarConexao() {
    const response = await axiosInstance.get(`conexao`);
    return response;
  }

  async function verificarConexao() {
    try {
      const response = await _verificarConexao()
      setconexao({loading: false, result: response})
      return response;
    } catch (error) {
      setconexao({loading: false, result: false})
      return false
    }
  }

  return { conexao, setconexao, verificarConexao };
}
