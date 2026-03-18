import { ICONS } from "../images"

export const ACOES_BATALHA = [
    {nome: "Ataque", descricao: "Você faz um ataque corpo a corpo ou à distância."},
    {nome: "Poder", descricao: "Alguns poderes exigem que você use uma ação."},
    {nome: "Feitiço", descricao: "Você lança um dos feitiços que aprendeu"},
    {nome: "Estudo", descricao: "Você tenta obter informações sobre alguém ou algo. Geralmente requer um teste aberto de [AST] + [AST]."},
    {nome: "Guarda", descricao: `Uma vez por turno. Até o início de seu próximo turno:
        \n * Você torna-se Resistente a todos os tipos de dano.
        \n * Você recebe +2 em testes opostos.
        \n * Você pode dar cobertura a outra criatura e impedir que inimigos façam ataques corpo a corpo contra ela.
    `},
    {nome: "Impedimento", descricao: "Você faz um teste (ND 10) contra um oponente. Em um sucesso, você o deixa Abalado, Atordoado, Fraco ou Lento."},
    {nome: "Objetivo", descricao: "Você trabalha para cumprir um objetivo do conflito. Isso exige um teste de Atributo ou um teste oposto."},
    {nome: "Inventário", descricao: "Você gasta Pontos de Inventário para criar e usar um item consumível imediatamente."},
    {nome: "Equipamento", descricao: "Você alterna qualquer número de itens equipados com qualquer número de itens na sua mochila."},
    {nome: "Outro", descricao: "Você faz uma ação que não está listada acima, negociando sua resolução e seus efeitos com o mestre."},
]

export const CONDICOES = [
    {nome: "Abalado", icon: ICONS.ABALADO, descricao: "Reduz Vontade"},
    {nome: "Atordoado", icon: ICONS.ATORDOADO, descricao: "Reduz Astúcia"},
    {nome: "Enfurecido", icon: ICONS.ENFURECIDO, descricao: "Reduz Destreza e Astúcia"},
    {nome: "Envenenado", icon: ICONS.ENVENENADO, descricao: "Reduz Vigor e Vontade"},
    {nome: "Fraco", icon: ICONS.FRACO, descricao: "Reduz Vigor"},
    {nome: "Lento", icon: ICONS.LENTO, descricao: "Reduz Destreza"},
]