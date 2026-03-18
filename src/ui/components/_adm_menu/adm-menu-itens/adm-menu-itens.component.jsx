import "./adm-menu-itens.style.css"
import { useNavigate } from "react-router-dom"
import { useAdicionarImagem } from "../../../../hook/api/imagem/adicionar-imagem.api"
import { BotaoPrimario } from "../.."
import { useCriarItem } from "../../../../hook/api/item/criar-item.api"
import { converterParaBase64 } from "../../../../utils/converter-base-64.util"
import { useListarItens } from "../../../../hook/api/item/listar-itens.api"
import { useEffect } from "react"
import { useAlterarItem } from "../../../../hook/api/item/alterar-item.api"
import { useForm, useToast } from "../../../../hook"
import { useRemoverItem } from "../../../../hook/api/item/remover-item.api"

export function AdmMenuItens({ menuEscolhido }) {
    const { adicionarImagem } = useAdicionarImagem()
    const { criarItem } = useCriarItem()
    const { alterarItem } = useAlterarItem()
    const { removerItem } = useRemoverItem()
    const { listarItens, itens } = useListarItens()
    const { toastWarning } = useToast()
    const { formData, handleChange } = useForm({ filtro: "" })
    const navigate = useNavigate()

    useEffect(() => {
        if (menuEscolhido > 13) {
            listarItens(formData.filtro)
        }
    }, [menuEscolhido, formData.filtro])

    function _getCusto(valor) {
        const novoValor = valor > 999999 ? 999999 : !valor ? 0 : valor
        return novoValor
    }

    function renderMenuCriarItemPersonagem() {

        async function _submitCriarItemPersonagem(e) {
            e.preventDefault();
            const nome = e.target["criar-item-nome"].value;
            const descricao = e.target["criar-item-descricao"].value;
            const custo = _getCusto(e.target["criar-item-custo"].value);
            const file = e.target["criar-item-icon"].files[0];
            let imagem_id = null

            if (file) {
                const dataUri = await converterParaBase64(file);
                const imagemNova = {
                    src: file.name,
                    alt: file.name,
                    dataUri
                };

                const response = await adicionarImagem(imagemNova);
                imagem_id = response.data
            }
            const novoItem = { nome, custo, descricao, imagem_id }
            await criarItem(novoItem);
            navigate(0)
        }

        return (
            <form onSubmit={_submitCriarItemPersonagem}>
                <label htmlFor="criar-item-nome">Nome</label>
                <input type="text" id="criar-item-nome" />

                <label htmlFor="criar-item-descricao">Descrição</label>
                <input type="text" id="criar-item-descricao" />

                <label htmlFor="criar-item-custo">Custo</label>
                <input type="number" id="criar-item-custo" placeholder="0" min={0} max={999999} />

                <label htmlFor="criar-item-icon">Ícone</label>
                <input
                    type="file"
                    id="criar-item-icon"
                    accept="image/*"
                    className="input-img"
                />

                <BotaoPrimario type="submit">
                    Criar
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuAlterarItemPersonagem() {

        async function _submitAlterarItemPersonagem(e) {
            e.preventDefault();
            const id = e.target["alterar-item-id"].value;
            const nome = e.target["alterar-item-nome"].value;
            const descricao = e.target["alterar-item-descricao"].value;
            const custo = _getCusto(e.target["alterar-item-custo"].value);
            const file = e.target["alterar-item-icon"].files[0];
            let imagem_id = null

            if (!Number(id)) {
                toastWarning("É preciso escolher um item válido.")
                return
            }

            if (file) {
                const dataUri = await converterParaBase64(file);
                const imagemNova = {
                    src: file.name,
                    alt: file.name,
                    dataUri
                };

                const response = await adicionarImagem(imagemNova);
                imagem_id = response.data
            }
            let novoItem = {}
            if(nome) novoItem = {...novoItem, nome}
            if(custo) novoItem = {...novoItem, custo}
            if(descricao) novoItem = {...novoItem, descricao}
            if(imagem_id) novoItem = {...novoItem, imagem_id}
            
            await alterarItem(id, novoItem);
            navigate(0)
        }

        return (
            <form onSubmit={_submitAlterarItemPersonagem}>
                <label htmlFor="filtro">Pesquisar item</label>
                <input type="text" id="filtro" name="filtro" value={formData.filtro} onChange={handleChange} />

                <label htmlFor="alterar-item-id">Item</label>
                <select id="alterar-item-id">
                    <option key={0} value={0}>NENHUM</option>
                    {itens.map((item) => (
                        <option key={item.id} value={item.id}>{`${item.nome} (${item.id})`}</option>
                    ))}
                </select>

                <label htmlFor="alterar-item-nome">Nome</label>
                <input type="text" id="alterar-item-nome" />

                <label htmlFor="alterar-item-descricao">Descrição</label>
                <input type="text" id="alterar-item-descricao" />

                <label htmlFor="alterar-item-custo">Custo</label>
                <input type="number" id="alterar-item-custo" placeholder="0" min={0} max={999999} />

                <label htmlFor="alterar-item-icon">Ícone</label>
                <input
                    type="file"
                    id="alterar-item-icon"
                    accept="image/*"
                    className="input-img"
                />

                <BotaoPrimario type="submit">
                    Alterar
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuRemoverItemPersonagem() {

        async function _submitRemoverItemPersonagem(e) {
            e.preventDefault();
            const id = e.target["remover-item-id"].value;

            if (!Number(id)) {
                toastWarning("É preciso escolher um item válido.")
                return
            }
            await removerItem(id);
            navigate(0)
        }

        return (
            <form onSubmit={_submitRemoverItemPersonagem}>
                <label htmlFor="filtro">Pesquisar item</label>
                <input type="text" id="filtro" name="filtro" value={formData.filtro} onChange={handleChange} />

                <label htmlFor="remover-item-id">Item</label>
                <select id="remover-item-id">
                    <option key={0} value={0}>NENHUM</option>
                    {itens.map((item) => (
                        <option key={item.id} value={item.id}>{`${item.nome} (${item.id})`}</option>
                    ))}
                </select>

                <BotaoPrimario type="submit">
                    Remover
                </BotaoPrimario>
            </form>
        );
    }

    return (
        <>
            {
                menuEscolhido === 13 ? renderMenuCriarItemPersonagem()
                    : menuEscolhido === 14 ? renderMenuAlterarItemPersonagem()
                    : menuEscolhido === 15 ? renderMenuRemoverItemPersonagem()
                        : null
            }
        </>
    )
}