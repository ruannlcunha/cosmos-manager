import { ITEM_URL } from '../../../constants';
import { axiosInstance } from '../_base/axios-instance.api';
import { useToast } from "../../toast/use-toast.hook";

export function useCriarItem() {
  const { toastError } = useToast();

  async function _criarItem(data) {
  const response = await axiosInstance.post(`${ITEM_URL}/`, data);
  return response;
}

  async function criarItem(data) {
    try {
      const response = await _criarItem(data)
      return response;
    } catch (error) {
      toastError(error)
    }
  }

  return { criarItem };
}
