import "./home-campanhas.style.css";
import { BotaoPrimario, ContainerScreen, Header, Imagem } from "../../components";
import useGlobalUser from "../../../context/user/global-user.context";
import { useForm, useSound } from "../../../hook";
import { useEffect, useState } from "react";
import { useListarCampanhas } from "../../../hook/api/campanha/listar-campanhas.api";
import { ICONS } from "../../../constants";
import { useNavigate } from "react-router-dom";
import CLOUDS from "../../../assets/img/backgrounds/CLOUDS.png"

export function HomeCampanhasScreen() {
  const { playClick } = useSound();
  const navigate = useNavigate();
  const [user, setUser] = useGlobalUser();
  const { campanhas, setCampanhas, listarCampanhas } = useListarCampanhas();
  const [campanhasFiltrados, setCampanhasFiltrados] = useState([])
  const { formData, setFormData, handleChange } = useForm({ filtro: "" });

  useEffect(() => {
    fetchCampanhas()
  }, [])

  useEffect(() => {
    if (campanhas) {
      setCampanhasFiltrados(campanhas.filter(_campanha => _campanha.nome.toLowerCase().includes(formData.filtro.toLowerCase())))
    }
  }, [campanhas, formData.filtro])

  async function fetchCampanhas() {
    const _campanhas = await listarCampanhas(user.id)
    setCampanhasFiltrados(_campanhas)
  }

  function renderCampanhaMenu(campanha) {
    return (
      <div className="campanha-menu">
        <header><h1>{campanha.nome}</h1></header>
        <section>
          <BotaoPrimario onClick={() => navigate(`/campanha/${campanha.id}`)}>Acessar Campanha</BotaoPrimario>
        </section>
      </div>
    )
  }

  function renderCampanhaCard(campanha) {
    const capa = campanha.capa ? campanha.capa.dataUri : null

    return (
      <li className="campanha-card" style={{backgroundImage: `url(${capa})`}}
      >
        {renderCampanhaMenu(campanha)}
      </li>
    )
  }

  return (
    <ContainerScreen>
      <div className="home-campanhas-screen">
        <Header idSelected={2} />
        <section className="campanhas-section">
          <div className="pesquisar-input">
            <Imagem data={ICONS.LUPA} />
            <input type="text" name={"filtro"} value={formData.filtro} onChange={handleChange} placeholder="Pesquisar campanhas." />
          </div>
          <ul>
            {campanhasFiltrados ?
              campanhasFiltrados.map(_campanha => {
                return renderCampanhaCard(_campanha)
              })
              : null}
          </ul>
        </section>
      </div>
    </ContainerScreen>
  )
}
