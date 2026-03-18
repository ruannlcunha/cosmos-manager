import "./receita-modal.style.css"
import { BotaoPrimario, Modal, ReceitaCard } from "../"
import { useEffect, useState } from "react"
import { useListarReceitas } from "../../../hook/api/receita/listar-receitas.api"
import { useForm, useToast } from "../../../hook"
import { useAdicionarReceita } from "../../../hook/api/campanha/adicionar-receita.api"

export function ReceitaModal({ campanha, setCampanha, isOpen, setIsOpen }) {
    const [receitasData, setReceitasData] = useState([])
    const [receitas, setReceitas] = useState([])
    const { toastSuccess, toastWarning } = useToast()
    const [receitasSelecionadas, setReceitasSelecionadas] = useState([])
    const { listarReceitas } = useListarReceitas();
    const { adicionarReceita } = useAdicionarReceita()
    const { formData, setFormData, handleChange } = useForm({ filtro: "" });

    useEffect(() => {
        if (campanha && isOpen) {
            fetchReceitas()
        }
        setReceitasSelecionadas([])
    }, [campanha, isOpen])

    useEffect(() => {
        if (receitasData) {
            setReceitas(receitasData.filter(_receita => _receita.nome.toLowerCase().includes(formData.filtro.toLowerCase())))
        }
    }, [formData.filtro])

    async function fetchReceitas() {
        const _receitas = await listarReceitas();
        const receitasDisponiveis = _receitas.filter(receita=> !campanha.receitas.some(_receita=> _receita.id === receita.id))
        setReceitasData(receitasDisponiveis)
        setReceitas(receitasDisponiveis)
    }

    function handleCancelar() {
        setIsOpen(false)
    }

    async function handleAdicionar() {
        try {
            for (const receita of receitasSelecionadas) {
                await adicionarReceita(campanha.id, receita.id)
            }
            setCampanha({...campanha, receitas: [...campanha.receitas, ...receitasSelecionadas]})
            receitasSelecionadas.length ? toastSuccess("Receitas foram adicionadas com sucesso!") : null
            setIsOpen(false)
        } catch (error) {
            console.log(error)
            toastWarning("Houve algum erro ao adicionar receitas.")
        }
    }

    function handleSelecionarReceita(receita) {
        if (receitasSelecionadas.some(receitaSelecionada => receitaSelecionada.id === receita.id)) {
            const novasReceitasSelecionadas = receitasSelecionadas.filter(receitaSelecionada => receitaSelecionada.id !== receita.id)
            setReceitasSelecionadas(novasReceitasSelecionadas)
        }
        else {
            const novasReceitasSelecionadas = [...receitasSelecionadas, receita]
            setReceitasSelecionadas(novasReceitasSelecionadas)
        }
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="receita-modal">
                <header>
                    <h1>Adicionar Receita</h1>
                </header>
                <section>
                    <input type="text" name={"filtro"} value={formData.filtro} onChange={handleChange} placeholder="Pesquisar receitas disponíveis." />
                    <ul>
                        {receitas.map(receita => {
                            let _className = ""
                            if (receitasSelecionadas.some(receitaSelecionada => receitaSelecionada.id === receita.id)) {
                                _className = "selecionada"
                            }
                            return <ReceitaCard receita={receita} onClick={() => handleSelecionarReceita(receita)} className={_className} />
                        })}
                    </ul>
                    <h1>Foram selecionadas {receitasSelecionadas.length} receitas.</h1>
                </section>
                <footer>
                    <BotaoPrimario onClick={handleCancelar}>Cancelar</BotaoPrimario>
                    <BotaoPrimario onClick={handleAdicionar}>Adicionar</BotaoPrimario>
                </footer>
            </div>
        </Modal>
    )

}