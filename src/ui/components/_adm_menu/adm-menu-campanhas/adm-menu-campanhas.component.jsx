import { useNavigate } from "react-router-dom"
import { useCriarReceita } from "../../../../hook/api/receita/criar-receita.api"
import "./adm-menu-campanhas.style.css"
import { useAdicionarUsuarioCampanha } from "../../../../hook/api/usuario/adicionar-usuario-campanha.api"
import { useAdicionarCampanhaPersonagem } from "../../../../hook/api/campanha/adicionar-campanha-personagem.api"
import { useAdicionarImagem } from "../../../../hook/api/imagem/adicionar-imagem.api"
import { CENAS_TIPO } from "../../../../constants"
import { BotaoPrimario } from "../../"
import { useCriarCena } from "../../../../hook/api/campanha/criar-cena.api"
import { converterParaBase64 } from "../../../../utils/converter-base-64.util"
import { useCriarCampanha } from "../../../../hook/api/campanha/criar-campanha.api"
import { useAlterarCampanha } from "../../../../hook/api/campanha/alterar-campanha.api"

export function AdmMenuCampanhas({ menuEscolhido, personagens, usuarios, campanhas }) {
    const { adicionarImagem } = useAdicionarImagem()
    const { adicionarCampanhaPersonagem } = useAdicionarCampanhaPersonagem()
    const { adicionarUsuarioCampanha } = useAdicionarUsuarioCampanha()
    const { criarReceita } = useCriarReceita()
    const { criarCampanha } = useCriarCampanha()
    const { alterarCampanha } = useAlterarCampanha()
    const { criarCena } = useCriarCena()
    const navigate = useNavigate()


    function renderMenuCriarCampanha() {
        async function _submitCriarCampanha(e) {
            e.preventDefault();
            const nome = e.target["criar-campanha-nome"].value;
            const descricao = e.target["criar-campanha-descricao"].value;
            const file = e.target["criar-campanha-capa"].files[0];
            let capa_id = null

            if (file) {
                const dataUri = await converterParaBase64(file)
                const imagemNova = {
                    src: file.name,
                    alt: file.name,
                    dataUri
                };
                const response = await adicionarImagem(imagemNova);
                capa_id = response.data
            }
            await criarCampanha({ nome, descricao, capa_id });
            navigate(0)
        }

        return (
            <form onSubmit={_submitCriarCampanha}>
                <label htmlFor="criar-campanha-nome">Nome</label>
                <input type="text" id="criar-campanha-nome" />

                <label htmlFor="criar-campanha-descricao">Descrição</label>
                <textarea type="text" id="criar-campanha-descricao" />

                <label htmlFor="criar-campanha-capa">Capa</label>
                <input
                    type="file"
                    id="criar-campanha-capa"
                    accept="image/*"
                    className="input-img"
                />

                <BotaoPrimario type="submit">
                    Criar
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuAlterarCampanha() {

        async function _submitAlterarCampanha(e) {
            e.preventDefault();
            const campanhaId = e.target["alterar-campanha-id"].value;
            const nome = e.target["alterar-campanha-nome"].value;
            const descricao = e.target["alterar-campanha-descricao"].value;
            const file = e.target["alterar-campanha-capa"].files[0];
            let capa_id = null

            if (file) {
                const dataUri = await converterParaBase64(file)
                const imagemNova = {
                    src: file.name,
                    alt: file.name,
                    dataUri
                };

                const capaId = campanhas.find(campanha => campanha.id === campanhaId).capa_id
                if (capaId) await removerImagem(capaId);

                const response = await adicionarImagem(imagemNova);
                capa_id = response.data
            }
            let novaCampanha = {}
            if(nome) novaCampanha = {...novaCampanha, nome}
            if(descricao) novaCampanha = {...novaCampanha, descricao}
            if(capa_id) novaCampanha = {...novaCampanha, capa_id}
            await alterarCampanha(campanhaId, novaCampanha);
            navigate(0)
        }

        return (
            <form onSubmit={_submitAlterarCampanha}>
                <label htmlFor="alterar-campanha-id">Campanha</label>
                <select id="alterar-campanha-id">
                    {campanhas.map((campanha) => (
                        <option key={campanha.id} value={campanha.id}>
                            {`${campanha.nome} (${campanha.id})`}
                        </option>
                    ))}
                </select>
                <label htmlFor="alterar-campanha-nome">Nome</label>
                <input type="text" id="alterar-campanha-nome" />

                <label htmlFor="alterar-campanha-descricao">Descrição</label>
                <textarea type="text" id="alterar-campanha-descricao" />

                <label htmlFor="alterar-campanha-capa">Capa</label>
                <input
                    type="file"
                    id="alterar-campanha-capa"
                    accept="image/*"
                    className="input-img"
                />

                <BotaoPrimario type="submit">
                    Alterar
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuRemoverCampanha() {

        async function _submitRemoverCampanha(e) {
            e.preventDefault();
            const campanhaId = e.target["remover-campanha-id"].value;
            await alterarCampanha(campanhaId, {ativo: false});
            navigate(0)
        }

        return (
            <form onSubmit={_submitRemoverCampanha}>
                <label htmlFor="remover-campanha-id">Campanha</label>
                <select id="remover-campanha-id">
                    {campanhas.map((campanha) => (
                        <option key={campanha.id} value={campanha.id}>
                            {`${campanha.nome} (${campanha.id})`}
                        </option>
                    ))}
                </select>

                <BotaoPrimario type="submit">
                    Remover
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuVincularPersonagemCampanha() {
        async function _submitVincularPersonagemCampanha(e) {
            e.preventDefault();
            const personagemId = e.target["vincular-personagem-campanha-id"].value;
            const campanhaId = e.target["vincular-campanha-personagem-id"].value;
            await adicionarCampanhaPersonagem(campanhaId, personagemId)
            navigate(0)
        }

        return (
            <form onSubmit={_submitVincularPersonagemCampanha}>
                <label htmlFor="vincular-personagem-campanha-id">Personagem</label>
                <select id="vincular-personagem-campanha-id">
                    {personagens.map((personagem) => (
                        <option key={personagem.id} value={personagem.id}>
                            {`${personagem.nome} (${personagem.id})`}
                        </option>
                    ))}
                </select>

                <label htmlFor="vincular-campanha-personagem-id">Campanha</label>
                <select id="vincular-campanha-personagem-id">
                    {campanhas.map((campanha) => (
                        <option key={campanha.id} value={campanha.id}>
                            {`${campanha.nome} (${campanha.id})`}
                        </option>
                    ))}
                </select>

                <BotaoPrimario type="submit">
                    Vincular
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuVincularUsuarioCampanha() {
        async function _submitVincularUsuarioCampanha(e) {
            e.preventDefault();
            const usuarioId = e.target["vincular-usuario-campanha-id"].value;
            const campanhaId = e.target["vincular-campanha-usuario-id"].value;
            await adicionarUsuarioCampanha(usuarioId, campanhaId)
            navigate(0)
        }

        return (
            <form onSubmit={_submitVincularUsuarioCampanha}>
                <label htmlFor="vincular-usuario-campanha-id">Usuário</label>
                <select id="vincular-usuario-campanha-id">
                    {usuarios.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>
                            {`${usuario.apelido} (${usuario.id})`}
                        </option>
                    ))}
                </select>

                <label htmlFor="vincular-campanha-usuario-id">Campanha</label>
                <select id="vincular-campanha-usuario-id">
                    {campanhas.map((campanha) => (
                        <option key={campanha.id} value={campanha.id}>
                            {`${campanha.nome} (${campanha.id})`}
                        </option>
                    ))}
                </select>

                <BotaoPrimario type="submit">
                    Vincular
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuCriarReceita() {

        async function _submitCriarReceita(e) {
            e.preventDefault();
            const nome = e.target["criar-receita-nome"].value;
            const custo = e.target["criar-receita-custo"].value;
            const efeito = e.target["criar-receita-efeito"].value;
            const file = e.target["criar-receita-icon"].files[0];
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
            const novaReceita = { nome, custo, efeito, imagem_id }
            await criarReceita(novaReceita);
            navigate(0)
        }

        return (
            <form onSubmit={_submitCriarReceita}>
                <label htmlFor="criar-receita-nome">Nome</label>
                <input type="text" id="criar-receita-nome" />

                <label htmlFor="criar-receita-custo">Custo</label>
                <input type="text" id="criar-receita-custo" />

                <label htmlFor="criar-receita-efeito">Efeito</label>
                <input type="text" id="criar-receita-efeito" />

                <label htmlFor="criar-receita-icon">Ícone</label>
                <input
                    type="file"
                    id="criar-receita-icon"
                    accept="image/*"
                    className="input-img"
                />

                <BotaoPrimario type="submit">
                    Criar
                </BotaoPrimario>
            </form>
        );
    }

    return (
        <>
            {
                menuEscolhido === 6 ? renderMenuCriarCampanha()
                    : menuEscolhido === 7 ? renderMenuAlterarCampanha()
                        : menuEscolhido === 8 ? renderMenuRemoverCampanha()
                            : menuEscolhido === 9 ? renderMenuVincularPersonagemCampanha()
                                : menuEscolhido === 10 ? renderMenuVincularUsuarioCampanha()
                                    : menuEscolhido === 11 ? renderMenuCriarReceita()
                                            : null
            }
        </>
    )
}