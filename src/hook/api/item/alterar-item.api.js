import { ITEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useAlterarItem() {
  const { toastError } = useToast();

  async function _alterarItem(itemId, data) {
  const response = await axiosInstance.patch(`${ITEM_URL}/${itemId}`, data);
  return response;
}

  async function alterarItem(itemId, data) {
    try {
      const response = await _alterarItem(itemId, data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { alterarItem };
}
