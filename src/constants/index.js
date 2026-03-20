export const BASE_API_URL = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`;

export const CAMPANHA_URL = `${BASE_API_URL}campanhas`
export const RECEITA_URL = `${BASE_API_URL}receitas`
export const PERSONAGEM_URL = `${BASE_API_URL}personagens`
export const USUARIO_URL = `${BASE_API_URL}usuarios`
export const IMAGEM_URL = `${BASE_API_URL}imagens`
export const ITEM_URL = `${BASE_API_URL}itens`

export const EQUIPAMENTO_TIPO = {
    ARMADURA: "ARMADURA",
    MAO_PRIMARIA: "MAO_PRIMARIA",
    MAO_SECUNDARIA: "MAO_SECUNDARIA",
    ACESSORIO: "ACESSORIO",
}

export const MODAL_TIPO = {
    CRIAR: "CRIAR",
    ALTERAR: "ALTERAR",
}

export const USER_ROLE = {
    ADM: "ADM",
    JOGADOR: "JOGADOR"
}

export const DIARIO_CATEGORIAS = {
    PERSONAGEM: {nome: "Personagem", cor: "orange", data: "PERSONAGEM"},
    MUNDO: {nome: "Mundo", cor: "mid-green", data: "MUNDO"},
    DOCUMENTO: {nome: "Documento", cor: "blue", data: "DOCUMENTO"},
    AMEACA: {nome: "Ameaça", cor: "mid-red", data: "AMEACA"},
    OUTROS: {nome: "Outros", cor: "grey", data: "OUTROS"},
}

export const ELEMENTOS = {
    NULO: "Nenhum", ACIDO: "Ácido", AGUA: "Agua", AR: "Ar", ELETRICO: "Elétrico",
    FOGO: "Fogo", GELO: "Gelo", LUZ: "Luz", TERRA: "Terra", TREVAS: "Trevas"
}

export const CONTEXT_CONFIG_NAMES = {
    SOM_EFEITOS: "somEfeitos",
    SOM_MUSICA: "somMusica"
}

export const COR_TEMAS = {
    AMARELO: "amarelo",
    AZUL: "azul",
    CIANO: "ciano",
    ROXO: "roxo",
    ROXO_ESCURO: "roxo-escuro",
    ROSA: "rosa",
    PRETO: "preto",
    CINZA: "cinza",
    BRANCO: "branco",
    TURQUESA: "turquesa",
    VERDE: "verde",
    VERDE_ESCURO: "verde-escuro",
    LARANJA: "laranja",
    VERMELHO: "vermelho",
}

export const CENAS_TIPO = {
    BATALHA: "BATALHA",
    DIALOGO: "DIALOGO",
    LOJA: "LOJA",
    CENARIO: "CENARIO",
}

export const CENA_OBJETOS_TIPO = {
    PERSONAGEM_ESQUERDA: "PERSONAGEM_ESQUERDA",
    PERSONAGEM_DIREITA: "PERSONAGEM_DIREITA",
    ITEM: "ITEM",
    IMAGEM: "IMAGEM",
    TITULO: "TITULO",
    TEXTO: "TEXTO",
    TEMPLATE: "TEMPLATE",
}

export { ICONS } from "./images/icons.constant"