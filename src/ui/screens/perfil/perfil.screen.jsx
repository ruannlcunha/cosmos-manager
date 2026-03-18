import "./perfil.style.css";
import { AudioContainer, ContainerScreen, Header, HomeSection, MenuOption } from "../../components";
import { ICONS } from "../../../constants/images";
import { useNavigate } from "react-router-dom";
import useGlobalUser from "../../../context/user/global-user.context";
import { downloadJson } from "../../../utils";
import { useMusic, useSound } from "../../../hook";
import { useEffect } from "react";
import { PERSONAGENS_DATA } from "../../../database";
import basePersonagem from "../../../database/personagens/_base/_base-pessoal.personagem.json";
import { MUSICS } from "../../../constants/audios/musics.constant";

export function PerfilScreen() {
  const navigate = useNavigate();
  const { startMusic } = useMusic();
  const { playClick } = useSound();
  const [user, setUser] = useGlobalUser();

  useEffect(() => {
    //cheat()
    startMusic(true);
  });

  function cheat() {
    const novosPersonagens = [];
    for (let i = 0; i < PERSONAGENS_DATA.length; i++) {
      const _visuais = [
        ...PERSONAGENS_DATA[i].visuais.map((visual) => {
          return visual.visualId;
        })
      ];
      const _personagem = {
        ...basePersonagem,
        nome: i === 0 ? "Aventureiro" : null,
        personagemId: PERSONAGENS_DATA[i].id,
        visuais: _visuais
      };
      novosPersonagens.push(_personagem);
    }

    const _user = {
      ...user,
      personagens: novosPersonagens
    };
    setUser(_user);
  }

  function handleSalvarJogo() {
    playClick(2);
    downloadJson(user);
  }

  function handleCarregarJogo() {
    playClick(2);
  }

  function handleChange(e) {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      setUser(json);
      navigate(0);
    };
  }

  return (
    <ContainerScreen>
      <AudioContainer audio={MUSICS.TOWN} />
      <div className="perfil-screen">
        <Header idSelected={6} />
        <HomeSection titulo={"Perfil"} icon={ICONS.PERFIL}>
          <MenuOption navigateTo={"/perfil/personagens"} icon={ICONS.PESSOAS} text={"Personagens"} />
          {/*
                    <MenuOption
                    navigateTo ={"/perfil"}
                    icon={ICONS.INVENTARIO}
                    text={"Inventário"}
                    />
                    */}
          <MenuOption icon={ICONS.SALVAR_JOGO} text={"Salvar Jogo"} onClick={handleSalvarJogo} />
          <label className="carregar-option" onClick={handleCarregarJogo} htmlFor="userFile">
            <img src={ICONS.CARREGAR_JOGO} alt={`Símbolo de Carregar Jogo`} />
            Carregar Jogo
          </label>
          <input id="userFile" name="userFile" type="file" className="user-input" onChange={handleChange} accept=".json" />
        </HomeSection>

        <section className="perfil-section"></section>
      </div>
    </ContainerScreen>
  );
}
