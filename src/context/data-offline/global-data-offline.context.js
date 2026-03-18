import createGlobalState from "react-create-global-state";
import dataOfflineInicial from "./data_offline_inicial.json";

const stateInStorage = localStorage.getItem("dataOffline");
const initialState = stateInStorage ? JSON.parse(stateInStorage) : dataOfflineInicial;

const [_useGlobalDataOffline, Provider] = createGlobalState(initialState);

function useGlobalDataOffline() {
  const [_dataOffline, _setDataOffline] = _useGlobalDataOffline();

  function setDataOffline(dataOffline) {
    _setDataOffline(dataOffline);
    localStorage.setItem("dataOffline", JSON.stringify(dataOffline));
  }

  return [_dataOffline, setDataOffline, dataOfflineInicial];
}

export const GlobalDataOfflineProvider = Provider;
export default useGlobalDataOffline;
