import createGlobalState from "react-create-global-state";
import userInicial from "./user_inicial.json";

const stateInStorage = localStorage.getItem("user");
const initialState = stateInStorage ? JSON.parse(stateInStorage) : userInicial;

const [_useGlobalUser, Provider] = createGlobalState(initialState);

function useGlobalUser() {
  const [_user, _setUser] = _useGlobalUser();

  function setUser(user) {
    _setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return [_user, setUser, userInicial];
}

export const GlobalUserProvider = Provider;
export default useGlobalUser;
