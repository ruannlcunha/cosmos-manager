import { USUARIO_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarUsuario() {
  const { toastError } = useToast();

  async function _criarUsuario(apelido, nome_de_usuario, senha, role) {
    const response = await axiosInstance.post(`${USUARIO_URL}/`, { apelido, nome_de_usuario, senha, role });
    return response;
  }

  async function criarUsuario(apelido, nome_de_usuario, senha, role) {
    try {
      const response = await _criarUsuario(apelido, nome_de_usuario, senha, role)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarUsuario };
}
