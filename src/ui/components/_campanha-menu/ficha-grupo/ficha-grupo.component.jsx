import { useEffect, useState } from "react";
import "./ficha-grupo.style.css"
import { DIARIO_CATEGORIAS, ICONS, USER_ROLE } from "../../../../constants";
import { Imagem } from "../../imagem/imagem.component";
import { BotaoPrimario } from "../../botao-primario/botao-primario.component";
import useGlobalUser from "../../../../context/user/global-user.context";
import { ReceitaCard } from "../../receita-card/receita-card.component";
import { DiarioModal, ReceitaModal } from "../..";
import { useRemoverReceita } from "../../../../hook/api/campanha/remover-receita.api";
import { useForm } from "../../../../hook";

export function FichaGrupo({ campanha, setCampanha, modoOffline }) {
    const [menuEscolhido, setMenuEscolhido] = useState(1);
    const [receitas, setReceitas] = useState([]);
    const [diario, setDiario] = useState([]);
    const [diarioFiltrado, setDiarioFiltrado] = useState([]);
    const [receitaOpen, setReceitaOpen] = useState(false);
    const [diarioSelecionado, setDiarioSelecionado] = useState(null);
    const [diarioOpen, setDiarioOpen] = useState(false);
    const { removerReceita } = useRemoverReceita()
    const [user] = useGlobalUser()
    const [categorias, setCategorias] = useState([])
    const { formData, setFormData, handleChange } = useForm({ filtroDiario: "" });

    useEffect(() => {
        setReceitas([...campanha.receitas])
        setDiario([...campanha.diario])
    }, [campanha, menuEscolhido])

    useEffect(() => {
        if (diario) {
            setDiarioFiltrado(diario.filter(_diario =>
                (categorias.some(categoria => categoria === _diario.categoria) || !categorias.length) &&
                _diario.nome.toLowerCase().includes(formData.filtroDiario.toLowerCase())
            ))
        }
    }, [diario, categorias, formData.filtroDiario])

    useEffect(() => {
        setCategorias([])
        setFormData({ filtroDiario: "" })
    }, [menuEscolhido])

    function handleEstiloMenu(menu) {
        return menuEscolhido === menu ? "menu-escolhido" : ""
    }

    function handleAdicionarReceita() {
        setReceitaOpen(true)
    }

    async function handleRemoverReceita(receita) {
        await removerReceita(campanha.id, receita.id)
        const novasReceitas = campanha.receitas.filter(_receita => _receita.id !== receita.id)
        setCampanha({ ...campanha, receitas: novasReceitas })
    }

    function handleClicarCategoria(categoria) {
        if (categorias.some(_categoria => _categoria === categoria.data)) {
            setCategorias(categorias.filter(_categoria => _categoria !== categoria.data))
        }
        else {
            setCategorias([...categorias, categoria.data])
        }
    }

    function handleClicarRegistroDiario(registroDiario) {
        setDiarioSelecionado(registroDiario)
        setDiarioOpen(true)
    }

    function handleAdicionarRegistroDiario() {
        setDiarioSelecionado(null)
        setDiarioOpen(true)
    }

    function renderDiarioCategoria(categoria) {
        const isEscolhido = categorias.some(_categoria => _categoria === categoria.data)
        return (
            <li className={isEscolhido ? "escolhido" : ""} style={{ backgroundColor: `var(--${categoria.cor})` }} onClick={() => handleClicarCategoria(categoria)}>
                {categoria.nome}
            </li>
        )
    }

    function renderDiario(registroDiario) {
        const _imagem = registroDiario.imagem ? registroDiario.imagem : ICONS.PERGAMINHO
        const categoria = DIARIO_CATEGORIAS[registroDiario.categoria]

        return <li className="diario-card" key={registroDiario.id} onClick={() => handleClicarRegistroDiario(registroDiario)}>
            <section className="diario-esquerda">
                <div className="imagem-container">
                    <Imagem data={_imagem} style={!registroDiario.imagem ? { opacity: "10%", filter: "saturate(0%)" } : null} />
                </div>
            </section>
            <section className="diario-direita">
                <header>
                    <h1>{registroDiario.nome}</h1>
                </header>
                <section>
                    <h2 style={{ backgroundColor: `var(--${categoria.cor})` }}>{categoria.nome}</h2>
                </section>
            </section>
        </li>
    }

    return (
        <div className="ficha-grupo-container">
            <ReceitaModal campanha={campanha} setCampanha={setCampanha} isOpen={receitaOpen} setIsOpen={setReceitaOpen} />
            <DiarioModal
                campanha={campanha}
                setCampanha={setCampanha}
                diario={diarioSelecionado}
                setDiario={setDiarioSelecionado}
                isOpen={diarioOpen}
                setIsOpen={setDiarioOpen}
                modoOffline={modoOffline}
            />
            <div className="ficha-menu">
                <header className="ficha-header">
                    <ul>
                        <li className={handleEstiloMenu(1)} onClick={(() => setMenuEscolhido(1))}>
                            <h1>RECEITAS</h1>
                        </li>
                        <li className={handleEstiloMenu(2)} onClick={(() => setMenuEscolhido(2))}>
                            <h1>DIÁRIO</h1>
                        </li>
                    </ul>
                </header>
                {menuEscolhido === 1 ?
                    <section className="receitas-menu">
                        <header>
                            <div></div>
                            <h1>Receitas do Grupo</h1>
                            {user.role === USER_ROLE.ADM ? <BotaoPrimario onClick={handleAdicionarReceita}>Adicionar</BotaoPrimario> : <div></div>}
                        </header>
                        {receitas.length ?
                            <ul>
                                {receitas.map(receita => {
                                    return <ReceitaCard receita={receita} removerFunction={handleRemoverReceita} />
                                })}
                            </ul>
                            : <h2>O grupo não possui receitas.</h2>}
                    </section>
                    : null}

                {menuEscolhido === 2 ?
                    <section className="diario-menu">
                        <header>
                            <div></div>
                            <h1>Registros de Diário</h1>
                            {user.role === USER_ROLE.ADM ? <BotaoPrimario onClick={handleAdicionarRegistroDiario}>Adicionar</BotaoPrimario> : <div></div>}
                        </header>
                        <div className="pesquisar-container">
                            <Imagem data={ICONS.LUPA} />
                            <input type="text" name={"filtroDiario"} value={formData.filtroDiario} onChange={handleChange} placeholder="Pesquisar registros de diário." />
                        </div>
                        <ul className="categorias-list">
                            {
                                Object.values(DIARIO_CATEGORIAS).map(categoria => {
                                    return renderDiarioCategoria(categoria)
                                })
                            }
                        </ul>
                        <ul className="registros-list">
                            {
                                diarioFiltrado.map(registroDiario => {
                                    return renderDiario(registroDiario)
                                })
                            }
                        </ul>
                    </section>
                    : null}
            </div>
        </div >
    )
}