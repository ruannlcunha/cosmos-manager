import { USUARIO_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarUsuario() {
  const { toastError } = useToast();

  async function _alterarUsuario(usuarioId, data) {
    const response = await axiosInstance.patch(`${USUARIO_URL}/${usuarioId}`, data);
    return response;
  }

  async function alterarUsuario(usuarioId, data) {
    try {
      const response = await _alterarUsuario(usuarioId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarUsuario };
}
