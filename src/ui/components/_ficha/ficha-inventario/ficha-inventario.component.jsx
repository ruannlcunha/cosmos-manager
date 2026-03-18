import { useEffect, useState } from "react"
import "./ficha-inventario.style.css"
import { EQUIPAMENTO_TIPO, ICONS } from "../../../../constants"
import { BotaoPrimario } from "../../botao-primario/botao-primario.component"
import { useForm } from "../../../../hook"
import { useAlterarPersonagem } from "../../../../hook/api/personagem/alterar-personagem.api"
import { useAlterarAtributos } from "../../../../hook/api/personagem/alterar-atributos.api"
import { Imagem } from "../../imagem/imagem.component"
import { ItemModal } from "../../item-modal/item-modal.component"
import { EquipamentoModal } from "../../equipamento-modal/equipamento-modal.component"

export function FichaInventario({ personagem, setPersonagem, modoOffline }) {
    const EQUIPAMENTO_VAZIO_ICON = { "Armadura": ICONS.ARMADURA, "Mão Primária": ICONS.ARMA_PRIMARIA, "Mão Secundária": ICONS.ARMA_SECUNDARIA, "Acessório": ICONS.ACESSORIO }
    const [itens, setItens] = useState(personagem.itens)
    const { formData, setFormData, handleChange } = useForm({ defesa: "", defesaMagica: "", iniciativa: "", dinheiro: "" });
    const [dinheiroIsForm, setDinheiroIsForm] = useState(false)
    const [atributosIsForm, setAtributosIsForm] = useState(false)
    const [equipamentos, setEquipamentos] = useState([])
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [itemOpen, setItemOpen] = useState(false);
    const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
    const [equipamentoOpen, setEquipamentoOpen] = useState(false);
    const [equipamentoTitulo, setEquipamentoTitulo] = useState("Equipamento");
    const [equipamentoIcon, setEquipamentoIcon] = useState(null);
    const { alterarPersonagem } = useAlterarPersonagem();
    const { alterarAtributos } = useAlterarAtributos();

    useEffect(() => {
        if (personagem) {
            setItens(personagem.itens.sort(function (a, b) {
                return a.id - b.id;
            }))
            setEquipamentos(personagem.equipamentos)
            setFormData({
                defesa: personagem.atributos.defesa,
                defesaMagica: personagem.atributos.defesa_magica,
                iniciativa: personagem.atributos.iniciativa,
                dinheiro: personagem.dinheiro,
            })
        }
    }, [personagem])

    function handleSalvarDinheiro() {
        let valor = formData.dinheiro
        if (valor > 999999) {
            setFormData({
                ...formData,
                dinheiro: 999999
            })
            valor = 999999
        }
        else {
            setFormData({
                ...formData,
                dinheiro: valor
            })
        }
        if(!modoOffline) alterarPersonagem(personagem.id, { dinheiro: valor })
        setPersonagem({ ...personagem, dinheiro: valor })
        setDinheiroIsForm(false)
    }

    function handleSalvarAtributos() {
        if(!modoOffline) alterarAtributos(personagem.id, { defesa: formData.defesa, defesa_magica: formData.defesaMagica, iniciativa: formData.iniciativa })
        setPersonagem({ ...personagem, atributos: { ...personagem.atributos, defesa: formData.defesa, defesa_magica: formData.defesaMagica, iniciativa: formData.iniciativa } })
        setAtributosIsForm(false)
    }

    function handleClicarEquipamento(equipamento, titulo, icon) {
        setEquipamentoTitulo(titulo)
        setEquipamentoIcon(icon)
        setEquipamentoSelecionado(equipamento)
        setEquipamentoOpen(true)
    }

    function handleClicarItem(item) {
        setItemSelecionado(item)
        setItemOpen(true)
    }

    function handleAdicionarItem() {
        setItemSelecionado(null)
        setItemOpen(true)
    }


    function renderItem(item) {
        const _imagem = item.imagem ? item.imagem : ICONS.ITEM_GENERICO

        return <li className="item-card" key={item.id} onClick={() => handleClicarItem(item)}>
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

    function renderEquipamento(tipo, equipamento) {
        const _equipamento = equipamento ? equipamento : {}
        const _imagem = _equipamento.imagem ? _equipamento.imagem : EQUIPAMENTO_VAZIO_ICON[tipo] ? EQUIPAMENTO_VAZIO_ICON[tipo] : ICONS.ACESSORIO
        return (
            <li className="card-equipamento"
                key={_equipamento.tipo}
                onClick={() => handleClicarEquipamento(_equipamento, `Equipamento (${tipo})`, EQUIPAMENTO_VAZIO_ICON[tipo])}
            >
                <section className="equipamento-esquerda">
                    <div className="equipamento-imagem">
                        {_equipamento.imagem ?
                            <Imagem data={_imagem} />
                            : <Imagem data={_imagem} style={{ opacity: "25%" }} />
                        }
                    </div>
                </section>

                <table className="equipamento-info">
                    <tbody>
                        <tr><th style={{ backgroundColor: "var(--dark-blue)" }}><h1>{tipo}</h1></th></tr>
                        <tr><th>{_equipamento.nome ? <h2>{_equipamento.nome}</h2> : <h2 style={{ opacity: "50%" }}>Vazio</h2>}</th></tr>
                        <tr>{_equipamento.descricao ? <td>{_equipamento.descricao}</td> : <td style={{ opacity: "50%" }}>Vazio</td>}</tr>
                    </tbody>
                </table>
            </li>
        )
    }

    function renderEquipamentoValor(titulo, imagem, index) {
        const _imagem = imagem ? imagem : ICONS.ACESSORIO
        return (
            <tr>
                <th>
                    {<img src={_imagem.src} alt={_imagem.alt} />}
                    {titulo}
                </th>
                {
                    atributosIsForm ?
                        <td className="valor-equipamento">
                            <input type="text" name={index} value={formData[index]} onChange={handleChange} />
                        </td>
                        : <td className="valor-equipamento">{formData[index]}</td>
                }
            </tr>
        )
    }

    return (
        <section className="ficha-inventario-container">
            <ItemModal
            personagem={personagem}
            setPersonagem={setPersonagem}
            item={itemSelecionado}
            setItem={setItemSelecionado}
            isOpen={itemOpen}
            setIsOpen={setItemOpen}
            modoOffline={modoOffline}
            isEditavel={true}
            />
            <EquipamentoModal
                personagem={personagem}
                setPersonagem={setPersonagem}
                equipamento={equipamentoSelecionado}
                setEquipamento={setEquipamentoSelecionado}
                titulo={equipamentoTitulo}
                icon={equipamentoIcon}
                isOpen={equipamentoOpen}
                setIsOpen={setEquipamentoOpen}
                modoOffline={modoOffline}
            />

            <section className="equipamentos-section">
                <h1>Equipamentos</h1>
                <ul className="lista-equipamento">
                    {renderEquipamento("Armadura", equipamentos.find(equipamento => equipamento.tipo === EQUIPAMENTO_TIPO.ARMADURA))}
                    {renderEquipamento("Mão Primária", equipamentos.find(equipamento => equipamento.tipo === EQUIPAMENTO_TIPO.MAO_PRIMARIA))}
                    {renderEquipamento("Mão Secundária", equipamentos.find(equipamento => equipamento.tipo === EQUIPAMENTO_TIPO.MAO_SECUNDARIA))}
                    {renderEquipamento("Acessório", equipamentos.find(equipamento => equipamento.tipo === EQUIPAMENTO_TIPO.ACESSORIO))}
                </ul>

                <h1>Valores</h1>

                <div className="botao-alterar-container">
                    {
                        atributosIsForm ? <BotaoPrimario onClick={handleSalvarAtributos}>Salvar</BotaoPrimario>
                            : <BotaoPrimario onClick={() => setAtributosIsForm(true)}>Alterar</BotaoPrimario>
                    }
                </div>
                <table>
                    <tbody>
                        {renderEquipamentoValor("Defesa", ICONS.DEFESA, "defesa")}
                        {renderEquipamentoValor("Def.Mágica", ICONS.DEFESA_MAGICA, "defesaMagica")}
                        {renderEquipamentoValor("Iniciativa", ICONS.INICIATIVA, "iniciativa")}
                    </tbody>
                </table>

            </section>
            <section className="itens-section">
                <h1>Itens</h1>

                <div className="botao-alterar-container">
                    <table>
                        <tbody>
                            <tr>
                                <th>
                                    <img src={ICONS.DINHEIRO.src} alt={ICONS.DINHEIRO.alt} />
                                    Dinheiro
                                </th>
                                {
                                    dinheiroIsForm ?
                                        <td className="valor-dinheiro">
                                            <input type="number" min={0} max={999999} name="dinheiro" value={formData.dinheiro} onChange={handleChange} />
                                        </td>
                                        : <td className="valor-dinheiro" onClick={() => setDinheiroIsForm(true)}>{formData.dinheiro}</td>
                                }
                                {
                                    dinheiroIsForm ?
                                        <td>
                                            <BotaoPrimario onClick={handleSalvarDinheiro}>
                                                <img src={ICONS.SUCESSO.src} alt={ICONS.SUCESSO.alt} />
                                            </BotaoPrimario>
                                        </td>
                                        : null
                                }


                            </tr>
                        </tbody>
                    </table>
                    <BotaoPrimario onClick={handleAdicionarItem}>Adicionar</BotaoPrimario>
                </div>
                <ul>
                    {itens.length ?
                        itens.map(item => {
                            return renderItem(item)
                        })
                        : <h2>O personagem não possui itens.</h2>}
                </ul>

            </section>

        </section>
    )

}