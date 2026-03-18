import { useNavigate } from "react-router-dom";
import { BotaoPrimario } from "../../";
import { useToast } from "../../../../hook";
import { useAdicionarImagem } from "../../../../hook/api/imagem/adicionar-imagem.api";
import { useRemoverImagem } from "../../../../hook/api/imagem/remover-imagem.api";
import { useAlterarPersonagem } from "../../../../hook/api/personagem/alterar-personagem.api";
import { useCriarPersonagem } from "../../../../hook/api/personagem/criar-personagem.api";
import { useCriarVisual } from "../../../../hook/api/personagem/criar-visual.api";
import { useRemoverPersonagem } from "../../../../hook/api/personagem/remover-personagem.api";
import { useAdicionarUsuarioPersonagem } from "../../../../hook/api/usuario/adicionar-usuario-personagem.api";
import "./adm-menu-personagens.style.css"
import { COR_TEMAS } from "../../../../constants";
import { converterParaBase64 } from "../../../../utils/converter-base-64.util";
import { useMontarBaralho } from "../../../../hook/api/personagem/montar-baralho.api";
import { BARALHO_INICIAL } from "../../../../constants/cartas-magicas.constant";

export function AdmMenuPersonagens({ menuEscolhido, personagens, usuarios }) {
    const { toastSuccess } = useToast()
    const { removerImagem } = useRemoverImagem()
    const { adicionarImagem } = useAdicionarImagem()
    const { criarPersonagem } = useCriarPersonagem()
    const { alterarPersonagem } = useAlterarPersonagem()
    const { removerPersonagem } = useRemoverPersonagem()
    const { adicionarUsuarioPersonagem } = useAdicionarUsuarioPersonagem()
    const { criarVisual } = useCriarVisual()
    const { montarBaralho } = useMontarBaralho()
    const navigate = useNavigate()

    function renderMenuCriarPersonagem() {
        async function _submitCriarPersonagem(e) {
            e.preventDefault();
            const nome = e.target["criar-nome"].value;
            const cor_tema = e.target["criar-cor"].value;
            const file = e.target["criar-simbolo"].files[0];
            let simbolo_id = null

            if (file) {
                const dataUri = await converterParaBase64(file)
                const imagemNova = {
                    src: file.name,
                    alt: file.name,
                    dataUri
                };
                const response = await adicionarImagem(imagemNova);
                simbolo_id = response.data
            }
            await criarPersonagem({ nome, cor_tema, simbolo_id });
            navigate(0)
        }

        return (
            <form onSubmit={_submitCriarPersonagem}>
                <label htmlFor="criar-nome">Nome</label>
                <input type="text" id="criar-nome" />

                <label htmlFor="criar-cor">Cor tema</label>
                <select id="criar-cor">
                    {Object.entries(COR_TEMAS).map(([key, valor]) => (
                        <option key={key} value={valor}>
                            {key}
                        </option>
                    ))}
                </select>

                <label htmlFor="criar-simbolo">Símbolo</label>
                <input
                    type="file"
                    id="criar-simbolo"
                    accept="image/*"
                    className="input-img"
                />

                <BotaoPrimario type="submit">
                    Criar
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuAlterarPersonagem() {

        async function _submitAlterarPersonagem(e) {
            e.preventDefault();
            const personagemId = e.target["alterar-id"].value;
            const cor_tema = e.target["alterar-cor"].value;
            const file = e.target["alterar-simbolo"].files[0];
            let simbolo_id = null

            if (file) {
                const dataUri = await converterParaBase64(file)
                const imagemNova = {
                    src: file.name,
                    alt: file.name,
                    dataUri
                };

                const simboloId = personagens.find(personagem => personagem.id === personagemId).simbolo_id
                if (simboloId) await removerImagem(simboloId);

                const response = await adicionarImagem(imagemNova);
                simbolo_id = response.data
            }
            const novoPersonagem = simbolo_id ? { cor_tema, simbolo_id } : { cor_tema }
            await alterarPersonagem(personagemId, novoPersonagem);
            toastSuccess("Personagem alterado.")
            navigate(0)
        }

        return (
            <form onSubmit={_submitAlterarPersonagem}>
                <label htmlFor="alterar-id">Personagem</label>
                <select id="alterar-id">
                    {personagens.map((personagem) => (
                        <option key={personagem.id} value={personagem.id}>
                            {`${personagem.nome} (${personagem.id})`}
                        </option>
                    ))}
                </select>

                <label htmlFor="alterar-cor">Cor tema</label>
                <select id="alterar-cor">
                    {Object.entries(COR_TEMAS).map(([key, valor]) => (
                        <option key={key} value={valor}>
                            {key}
                        </option>
                    ))}
                </select>

                <label htmlFor="alterar-simbolo">Símbolo</label>
                <input
                    type="file"
                    id="alterar-simbolo"
                    accept="image/*"
                    className="input-img"
                />

                <BotaoPrimario type="submit">
                    Alterar
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuRemoverPersonagem() {
        async function _submitRemoverPersonagem(e) {
            e.preventDefault();
            const personagemId = e.target["remover-id"].value;
            await removerPersonagem(personagemId);
            navigate(0)
        }

        return (
            <form onSubmit={_submitRemoverPersonagem}>
                <label htmlFor="remover-id">Personagem</label>
                <select id="remover-id">
                    {personagens.map((personagem) => (
                        <option key={personagem.id} value={personagem.id}>
                            {`${personagem.nome} (${personagem.id})`}
                        </option>
                    ))}
                </select>

                <BotaoPrimario type="submit">
                    Remover
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuVincularPersonagemUsuario() {
        async function _submitVincularPersonagemUsuario(e) {
            e.preventDefault();
            const personagemId = e.target["vincular-personagem-usuario-id"].value;
            const usuarioId = e.target["vincular-usuario-personagem-id"].value;
            await adicionarUsuarioPersonagem(usuarioId, personagemId)
            navigate(0)
        }

        return (
            <form onSubmit={_submitVincularPersonagemUsuario}>
                <label htmlFor="vincular-personagem-usuario-id">Personagem</label>
                <select id="vincular-personagem-usuario-id">
                    {personagens.map((personagem) => (
                        <option key={personagem.id} value={personagem.id}>
                            {`${personagem.nome} (${personagem.id})`}
                        </option>
                    ))}
                </select>

                <label htmlFor="vincular-usuario-personagem-id">Usuário</label>
                <select id="vincular-usuario-personagem-id">
                    {usuarios.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>
                            {`${usuario.apelido} (${usuario.id})`}
                        </option>
                    ))}
                </select>

                <BotaoPrimario type="submit">
                    Vincular
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuCriarVisual() {
        async function _submitCriarVisual(e) {
            e.preventDefault();
            const nome = e.target["criar-visual-nome"].value;
            const descricao = e.target["criar-visual-descricao"].value;
            const personagemId = e.target["criar-visual-id"].value;
            const sprite = e.target["criar-visual-sprite"].files[0];
            const perfil = e.target["criar-visual-perfil"].files[0];
            const codigo = e.target["criar-visual-codigo"].value;
            const files = [sprite, perfil]
            let sprite_id = null
            let perfil_id = null

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                if (file) {
                    const dataUri = await converterParaBase64(file)
                    const imagemNova = {
                        src: file.name,
                        alt: file.name,
                        dataUri
                    };
                    const response = await adicionarImagem(imagemNova);
                    if (i === 0) sprite_id = response.data
                    if (i === 1) perfil_id = response.data
                }
            }
            await criarVisual(personagemId, { nome, descricao, codigo, sprite_id, perfil_id });
            navigate(0)
        }

        return (
            <form onSubmit={_submitCriarVisual}>
                <label htmlFor="criar-visual-nome">Nome</label>
                <input type="text" id="criar-visual-nome" />

                <label htmlFor="criar-visual-descricao">Descrição</label>
                <input type="text" id="criar-visual-descricao" />

                <label htmlFor="criar-visual-id">Personagem</label>
                <select id="criar-visual-id">
                    {personagens.map((personagem) => (
                        <option key={personagem.id} value={personagem.id}>
                            {`${personagem.nome} (${personagem.id})`}
                        </option>
                    ))}
                </select>

                <label htmlFor="criar-visual-sprite">Sprite</label>
                <input
                    type="file"
                    id="criar-visual-sprite"
                    accept="image/*"
                    className="input-img"
                />

                <label htmlFor="criar-visual-perfil">Perfil</label>
                <input
                    type="file"
                    id="criar-visual-perfil"
                    accept="image/*"
                    className="input-img"
                />

                <label htmlFor="criar-visual-codigo">Código Secreto</label>
                <input type="text" id="criar-visual-codigo" />

                <BotaoPrimario type="submit">
                    Criar
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuMontarBaralhoInicial() {
        const personagensDisponiveis = personagens.filter(personagem=> !personagem.baralho)

        async function _submitMontarBaralhoInicial(e) {
            e.preventDefault();
            const personagemId = e.target["montar-baralho-id"].value;
            await montarBaralho(personagemId, BARALHO_INICIAL);
            navigate(0)
        }

        return (
            <form onSubmit={_submitMontarBaralhoInicial}>
                <label htmlFor="montar-baralho-id">Personagem</label>
                <select id="montar-baralho-id">
                    {personagensDisponiveis.map((personagem) => (
                        <option key={personagem.id} value={personagem.id}>
                            {`${personagem.nome} (${personagem.id})`}
                        </option>
                    ))}
                </select>

                <BotaoPrimario type="submit">
                    Montar
                </BotaoPrimario>
            </form>
        );
    }

    return (
        <>

            {
                menuEscolhido === 1 ? renderMenuCriarPersonagem()
                    : menuEscolhido === 2 ? renderMenuAlterarPersonagem()
                        : menuEscolhido === 3 ? renderMenuRemoverPersonagem()
                            : menuEscolhido === 4 ? renderMenuVincularPersonagemUsuario()
                                : menuEscolhido === 5 ? renderMenuCriarVisual()
                                : menuEscolhido === 'MONTAR_BARALHO' ? renderMenuMontarBaralhoInicial()
                                    : null
            }
        </>
    )

}