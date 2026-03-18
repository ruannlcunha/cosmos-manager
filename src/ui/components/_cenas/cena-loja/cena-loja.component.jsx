import "./cena-loja.style.css"
import { BotaoPrimario, Imagem, ItemModal, Modal } from "../../"
import { useEffect, useState } from "react";
import { CENA_OBJETOS_TIPO, ICONS } from "../../../../constants";
import { useVisualizarImagem } from "../../../../hook/api/imagem/visualizar-imagem.api";
import { IMAGES } from "../../../../constants/images";
import { useListarPersonagens } from "../../../../hook/api/personagem/listar-personagens.api";
import useGlobalUser from "../../../../context/user/global-user.context";
import CLOUD_TEXTURE from "../../../../assets/img/textures/CLOUDS.png"
import { useVisualizarPersonagem } from "../../../../hook/api/personagem/visualizar-personagem.api";
import { useSocket } from "../../../../hook";
import { useListarItens } from "../../../../hook/api/item/listar-itens.api";
import { useNavigate } from "react-router-dom";

export function CenaLoja({ cena, cenaObjetos, hudAtivo }) {
    const [imagem, setImagem] = useState(null)
    const [titulo, setTitulo] = useState("")
    const [texto, setTexto] = useState("");
    const [itens, setItens] = useState([]);
    const [menuEscolhido, setMenuEscolhido] = useState(0)
    const [personagem, setPersonagem] = useState(null)
    const [personagemId, setPersonagemId] = useState(null)
    const [personagemModal, setPersonagemModal] = useState(false)
    const { visualizarImagem } = useVisualizarImagem()
    const { visualizarPersonagem } = useVisualizarPersonagem()
    const { listarItens } = useListarItens()
    const { personagens, listarPersonagens } = useListarPersonagens()
    const [itemModal, setItemModal] = useState({isOpen: false, item: null, personagem: null, isEditavel: false})
    const [user] = useGlobalUser()
    const { socket } = useSocket();
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [cenaObjetos])

    useEffect(() => {
        if (personagemId) {
            fetchPersonagem()
            socket.on("personagens", async () => {
                fetchPersonagem()
            });
        }
    }, [personagemId])

    async function fetchData() {
        const _titulo = cenaObjetos.find(obj => obj.tipo === CENA_OBJETOS_TIPO.TITULO && obj.exibindo)
        const _texto = cenaObjetos.find(obj => obj.tipo === CENA_OBJETOS_TIPO.TEXTO && obj.exibindo)

        const imagemObj = cenaObjetos.find(obj => obj.tipo === CENA_OBJETOS_TIPO.IMAGEM && obj.exibindo)
        const _imagemData = await visualizarImagem(imagemObj.valor)
        const _imagem = { ..._imagemData, ...imagemObj }

        const _itensData = await listarItens()
        const _itens = cenaObjetos
            .filter(obj => obj.tipo === CENA_OBJETOS_TIPO.ITEM && obj.exibindo)
            .map(obj => {
                const _itemData = _itensData.find(data => data.id === obj.valor)
                return { ...obj, ..._itemData }
            })

        setTitulo(_titulo.valor)
        setTexto(_texto.valor)
        setImagem(_imagem)
        setItens(_itens)
        await listarPersonagens(user.id)
    }

    async function fetchPersonagem() {
        const _personagem = await visualizarPersonagem(personagemId, user.id)
        setPersonagem(_personagem)
    }

    function _setItemModalOpen(state) {
        setItemModal({...itemModal, isOpen: state})
    }

    function handleClicarMenu(menu) {
        if (menu === menuEscolhido) {
            setMenuEscolhido(0)
            return
        }
        setMenuEscolhido(menu)
    }

    function handleEscolherPersonagem(personagem) {
        setPersonagemId(personagem.id)
        setPersonagemModal(false)
    }

    function handleClicarItem(item, personagem, isEditavel) {
        //setItemModal({...itemModal, item, personagem, isEditavel, isOpen: true})
        //Remover a linha abaixo caso queira permitir a edição do item.
        setItemModal({...itemModal, item, personagem: null, isEditavel: false, isOpen: true})
    }

    function renderItem(item, personagem, isEditavel) {
        const _imagem = item.imagem ? item.imagem : ICONS.ITEM_GENERICO

        return <li className="item-card" key={item.id} onClick={() => handleClicarItem(item, personagem, isEditavel)}>
            <section className="item-esquerda">
                <div className="imagem-container">
                    <Imagem data={_imagem} style={!item.imagem ? { opacity: "50%" } : null} />
                </div>
            </section>
            <section className="item-direita">
                <header>
                    <h3>{item.nome}</h3>
                </header>
                <section className="item-custo">
                    <h2>Custo: {item.custo}</h2>
                    <Imagem data={ICONS.DINHEIRO} />
                </section>
                <section>
                    <p>{item.descricao}</p>
                </section>
            </section>
        </li>
    }

    function renderTexto() {
        return (
            <p>{texto}</p>
        )
    }

    function renderComprar() {
        return (
            <ul>
                {
                    itens.map(item => {
                        return renderItem(item, null, false)
                    })
                }
            </ul>
        )
    }

    function renderVender() {
        return personagem ? (
            <ul>
                {
                    personagem.itens.map(item => {
                        return renderItem(item, personagem, true)
                    })
                }
            </ul>
        ) : null
    }

    function renderHud() {
        const perfil = personagem && personagem.visualAtivo ? personagem.visualAtivo.perfil : IMAGES.PERFIL_GENERICO

        return (
            <div className="hud-loja-container">
                <section className="menu-esquerda">
                    <header>
                        <h1>{titulo}</h1>
                    </header>
                    <section>
                        <div className="conteudo-menu">
                            {
                                menuEscolhido === 1 ? renderComprar()
                                    : menuEscolhido === 2 ? renderVender()
                                        : renderTexto()
                            }
                        </div>
                    </section>
                </section>
                <section className="menu-direita">
                    <header>
                        {personagem ?
                            <>
                                <div className="dinheiro">
                                    <Imagem data={ICONS.DINHEIRO} />
                                    <h1>{personagem.dinheiro}</h1>
                                </div>
                                <Imagem data={perfil} className={"personagem-perfil"} />
                            </>
                            : null}
                    </header>
                    <section>
                        <BotaoPrimario onClick={() => handleClicarMenu(1)} className={menuEscolhido === 1 ? "escolhido" : ""}>
                            Comprar
                        </BotaoPrimario>
                        <BotaoPrimario onClick={() => handleClicarMenu(2)} className={menuEscolhido === 2 ? "escolhido" : ""} ativo={personagem}>
                            Vender
                        </BotaoPrimario>
                        <BotaoPrimario onClick={() => setPersonagemModal(true)}>
                            Personagem
                        </BotaoPrimario>
                    </section>
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
                <div className="personagem-menu">
                    <header><h1>{personagem.nome}</h1></header>
                    <BotaoPrimario onClick={() => handleEscolherPersonagem(personagem)}>Escolher</BotaoPrimario>
                    <BotaoPrimario onClick={() => navigate(`/personagem/${personagem.id}`)}>Ver Ficha</BotaoPrimario>
                </div>
            </li>
        )
    }

    return (
        <div className="cena-loja-container" style={cena.fundo ? { backgroundImage: `url(${cena.fundo.dataUri})` } : null}>
            <Imagem data={imagem} className={"loja-imagem"} />
            {hudAtivo ? renderHud() : null}
            <Modal isOpen={personagemModal} setIsOpen={setPersonagemModal}>
                <div className="personagem-loja-modal">
                    <header>
                        <h1>Escolha um personagem</h1>
                    </header>
                    <section>
                        {
                            personagens.map(_personagem => {
                                return renderPersonagemCard(_personagem)
                            })
                        }
                    </section>
                </div>
            </Modal>
            <ItemModal
                personagem={itemModal.personagem}
                setPersonagem={()=>{}}
                item={itemModal.item}
                setItem={()=>{}}
                isOpen={itemModal.isOpen}
                setIsOpen={_setItemModalOpen}
                isEditavel={itemModal.isEditavel}
            />
        </div>
    )
}
