import "./ficha.style.css"
import { BackButton, BotaoPrimario, ContainerScreen, FichaClasses, FichaInventario, FichaArcano, FichaSocial, FichaStatus, Imagem, VisuaisModal } from "../../components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useVisualizarPersonagem } from "../../../hook/api/personagem/visualizar-personagem.api";
import { ICONS } from "../../../constants";
import { useForm, useSocket } from "../../../hook";
import { useAlterarPersonagem } from "../../../hook/api/personagem/alterar-personagem.api";
import useGlobalUser from "../../../context/user/global-user.context";
import { IMAGES } from "../../../constants/images";
import { useVerificarConexao } from "../../../hook/api/_base/verificar-conexao.api";
import useGlobalDataOffline from "../../../context/data-offline/global-data-offline.context";

export function FichaScreen({ modoOffline }) {
  const [menuEscolhido, setMenuEscolhido] = useState(1);
  const [emCrise, setEmCrise] = useState(false);
  const [visualModal, setVisualModal] = useState(false);
  const [nomeIsForm, setNomeIsForm] = useState(false)
  const { personagemId } = useParams();
  const { conexao, verificarConexao } = useVerificarConexao()
  const { socket } = useSocket();
  const [user] = useGlobalUser()
  const [dataOffline, setDataOffline] = useGlobalDataOffline();
  const { personagem, setPersonagem, visualizarPersonagem } = useVisualizarPersonagem();
  const { alterarPersonagem } = useAlterarPersonagem();
  const { formData, setFormData, handleChange } = useForm({ nome: "", });

  useEffect(() => {
    verificarConexao()
  }, [])

  useEffect(() => {
    if (conexao.result && !modoOffline) {
      visualizarPersonagem(personagemId, user.id);
      socket.on("personagens", async () => {
        visualizarPersonagem(personagemId, user.id)
      });
    }
    else if(modoOffline) {
      setPersonagem(dataOffline.personagem);
    }

  }, [conexao.result, personagemId, menuEscolhido]);

  useEffect(() => {
    if (personagem) {
      setEmCrise(Number(personagem.pontos.pv_atual) <= (Number(personagem.pontos.pv_maximo) / 2))
      document.documentElement.style.setProperty("--fundo-tema", `var(--tema-${personagem.cor_tema})`);
      setFormData({ nome: personagem.nome })
      if(dataOffline) setDataOffline({...dataOffline, personagem})
    }
  }, [personagem])

  function handleEstiloMenu(menu) {
    return menuEscolhido === menu ? "menu-escolhido" : ""
  }

  async function handleSalvarNome() {
    if(!modoOffline) await alterarPersonagem(personagem.id, { nome: formData.nome })
    setPersonagem({ ...personagem, nome: formData.nome })
    setNomeIsForm(false)
  }

  return personagem ? (
    <ContainerScreen>
      <BackButton navigateTo={modoOffline ? "/offline" : null} />
      <div className="ficha-container">
        <VisuaisModal personagem={personagem} setPersonagem={setPersonagem} isOpen={visualModal} setIsOpen={setVisualModal} />
        <section className="personagem">
          {personagem ? (
            <>
              <div className="nome-input">
                {
                  !nomeIsForm ? <h1 onClick={() => setNomeIsForm(true)}>{personagem.nome}</h1>
                    : <>
                      <input type="text" name={"nome"} value={formData.nome} onChange={handleChange} />
                      <BotaoPrimario onClick={handleSalvarNome}>
                        <Imagem data={ICONS.SUCESSO} />
                      </BotaoPrimario>
                    </>
                }

              </div>
              <Imagem
                data={personagem.visualAtivo ? personagem.visualAtivo.sprite : IMAGES.SPRITE_GENERICO}
                style={
                  !personagem.pontos.pv_atual ? { filter: "saturate(0%) brightness(25%)" }
                    : emCrise ? { animation: "sprite-em-crise 1.5s ease-in-out alternate infinite" }
                      : null
                }
              />
              <BotaoPrimario onClick={() => setVisualModal(true)}>Alterar Visual</BotaoPrimario>
            </>
          ) : null}
        </section>

        <section className="ficha-section">
          <div className="ficha-menu">
            <header className="ficha-header">
              <ul>
                <li className={handleEstiloMenu(1)} onClick={(() => setMenuEscolhido(1))}>
                  <h1>STATUS</h1>
                </li>
                <li className={handleEstiloMenu(2)} onClick={(() => setMenuEscolhido(2))}>
                  <h1>CLASSES</h1>
                </li>
                <li className={handleEstiloMenu(3)} onClick={(() => setMenuEscolhido(3))}>
                  <h1>INVENTÁRIO</h1>
                </li>
                <li className={handleEstiloMenu(4)} onClick={(() => setMenuEscolhido(4))}>
                  <h1>ARCANO</h1>
                </li>
                <li className={handleEstiloMenu(5)} onClick={(() => setMenuEscolhido(5))} style={{ borderRight: "none" }}>
                  <h1>SOCIAL</h1>
                </li>
              </ul>
            </header>
            {
              menuEscolhido === 1 ? <FichaStatus personagem={personagem} setPersonagem={setPersonagem} modoOffline={modoOffline} /> :
                menuEscolhido === 2 ? <FichaClasses personagem={personagem} setPersonagem={setPersonagem} modoOffline={modoOffline} /> :
                  menuEscolhido === 3 ? <FichaInventario personagem={personagem} setPersonagem={setPersonagem} modoOffline={modoOffline} /> :
                    menuEscolhido === 4 ? <FichaArcano personagem={personagem} setPersonagem={setPersonagem} modoOffline={modoOffline} /> :
                      menuEscolhido === 5 ? <FichaSocial personagem={personagem} setPersonagem={setPersonagem} modoOffline={modoOffline} /> :
                        null
            }

          </div>
        </section>

      </div>
    </ContainerScreen>
  ) : null;
}
