import { createHashRouter } from "react-router-dom";
import { 
  RootScreen,
  FichaScreen,
  StartScreen,
  LoginScreen,
  HomePersonagensScreen,
  ModoOfflineScreen,
  HomeCampanhasScreen,
  CampanhaScreen,
  BaralhoScreen,
  HomeAdmScreen,
  CenaScreen,
  StreamPersonagem,
  StreamCenaScreen,
} from "../ui/screens";
import { PrivateRoute } from "./private-route.component";
import { USER_ROLE } from "../constants";

export const router = createHashRouter([
  {
    path: "*",
    element: <RootScreen />,
  },
  { 
    path: `/`,
    element: <RootScreen />,
    children: [
      {
        path: `/`,
        element: <StartScreen />,
      },
      // {
      //   path: `/offline`,
      //   element: <ModoOfflineScreen />,
      // },
      {
        path: `/login`,
        element: <LoginScreen />,
      },
      {
        path: `/home/personagens`,
        element: <PrivateRoute Screen={HomePersonagensScreen} />,
      },
      {
        path: `/home/campanhas`,
        element: <PrivateRoute Screen={HomeCampanhasScreen} />,
      },
      {
        path: `/home/adm`,
        element: <PrivateRoute Screen={HomeAdmScreen} role={USER_ROLE.ADM}/>,
      },
      {
        path: `/personagem/:personagemId`,
        element: <PrivateRoute Screen={FichaScreen} />,
      },
      {
        path: `/campanha/:campanhaId`,
        element: <PrivateRoute Screen={CampanhaScreen} />,
      },
      {
        path: `/campanha/:campanhaId/cena/:cenaId`,
        element: <PrivateRoute Screen={CenaScreen} />,
      },
      {
        path: `/personagem/:personagemId/baralho`,
        element: <PrivateRoute Screen={BaralhoScreen} />,
      },
      {
        path: `/stream/personagem/:personagemId`,
        element: <StreamPersonagem/>,
      },
      {
        path: `/stream/campanha/:campanhaId/cena`,
        element: <StreamCenaScreen/>,
      },
      // {
      //   path: `/offline/personagem`,
      //   element: <FichaScreen modoOffline={true}/>,
      // },
    ],
  },
]);
