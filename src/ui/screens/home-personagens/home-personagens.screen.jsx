import "./home-personagens.style.css";
import { BotaoPrimario, ContainerScreen, Header, Imagem } from "../../components";
import useGlobalUser from "../../../context/user/global-user.context";
import { useForm, useSound } from "../../../hook";
import { useEffect, useState } from "react";
import { useListarPersonagens } from "../../../hook/api/personagem/listar-personagens.api";
import CLOUD_TEXTURE from "../../../assets/img/textures/CLOUDS.png"
import { ICONS } from "../../../constants";
import { IMAGES } from "../../../constants/images";
import { useNavigate } from "react-router-dom";
import { downloadJson } from "../../../utils/download-json.util";

export function HomePersonagensScreen() {
  const { playClick } = useSound();
  const navigate = useNavigate();
  const [user] = useGlobalUser();
  const { personagens, setPersonagens, listarPersonagens } = useListarPersonagens();
  const [personagensFiltrados, setPersonagensFiltrados] = useState([])
  const { formData, setFormData, handleChange } = useForm({ filtro: "" });

  useEffect(() => {
    fetchPersonagens()
  }, [])

  useEffect(() => {
    if (personagens) {
      setPersonagensFiltrados(personagens.filter(_personagem => _personagem.nome.toLowerCase().includes(formData.filtro.toLowerCase())))
    }
  }, [personagens, formData.filtro])

  async function fetchPersonagens() {
    const _personagens = await listarPersonagens(user.id)
    setPersonagensFiltrados(_personagens)
  }

  function handleBaixarFicha(personagem) {
    playClick(2);
    downloadJson(personagem, `ficha-${personagem.nome.toLowerCase()}-cosmos-manager`);
  }

  function renderPersonagemMenu(personagem) {
    return (
      <div className="personagem-menu">
        <header><h1>{personagem.nome}</h1></header>
        <section>
          <BotaoPrimario onClick={() => navigate(`/personagem/${personagem.id}`)}>Acessar Ficha</BotaoPrimario>
          {personagem.baralho?<BotaoPrimario onClick={() => navigate(`/personagem/${personagem.id}/baralho`)}>Acessar Baralho</BotaoPrimario>:null}
          {/* <BotaoPrimario onClick={()=>handleBaixarFicha(personagem)}>Baixar Ficha</BotaoPrimario> */}
        </section>
      </div>
    )
  }

  function renderPersonagemCard(personagem) {
    const corTema = personagem.cor_tema ? personagem.cor_tema : "cinza";
    const sprite = personagem.visualAtivo ? personagem.visualAtivo.sprite : IMAGES.SPRITE_GENERICO;

    return (
      <li className="personagem-card" style={{
        background:
          `linear-gradient(transparent 15%, var(--black) 95%), url(${CLOUD_TEXTURE}), linear-gradient(var(--tema-${corTema}) 25%, var(--white) 100%)`
      }}
      >
        <Imagem data={sprite} />
        {renderPersonagemMenu(personagem)}
      </li>
    )
  }

  return (
    <ContainerScreen>
      <div className="home-personagens-screen">
        <Header idSelected={1} />
        <section className="personagens-section">
          <div className="pesquisar-input">
            <Imagem data={ICONS.LUPA} />
            <input type="text" name={"filtro"} value={formData.filtro} onChange={handleChange} placeholder="Pesquisar personagens." />
          </div>
          <ul>
            {personagensFiltrados ?
              personagensFiltrados.map(_personagem => {
                return renderPersonagemCard(_personagem)
              })
              : null}
          </ul>
        </section>
      </div>
    </ContainerScreen>
  )
}
