import { ITEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useRemoverItem() {
  const { toastError } = useToast();

  async function _removerItem(itemId) {
  const response = await axiosInstance.delete(`${ITEM_URL}/${itemId}`);
  return response;
}

  async function removerItem(itemId) {
    try {
      const response = await _removerItem(itemId)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { removerItem };
}
