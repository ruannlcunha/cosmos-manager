import { CARTAS_IMAGEM } from "./images/cartas-imagem.constant";

const NAIPES = {
    CORINGA: "CORINGA",
    AR: "AR",
    FOGO: "FOGO",
    GELO: "GELO",
    TERRA: "TERRA",
}

export const CORINGA = "CORINGA"

export const CARTAS_MAGICAS = {
    CORINGA: [
        {nome: 'CORINGA_1', img: CARTAS_IMAGEM.CARTA_CORINGA_BRANCA, naipe: NAIPES.CORINGA, valor: CORINGA},
        {nome: 'CORINGA_2', img: CARTAS_IMAGEM.CARTA_CORINGA_PRETA, naipe: NAIPES.CORINGA, valor: CORINGA},
    ],
    AR: [
        {nome: 'AR_1', img: CARTAS_IMAGEM.CARTA_AR_1, naipe: NAIPES.AR, valor: 1},
        {nome: 'AR_2', img: CARTAS_IMAGEM.CARTA_AR_2, naipe: NAIPES.AR, valor: 2},
        {nome: 'AR_3', img: CARTAS_IMAGEM.CARTA_AR_3, naipe: NAIPES.AR, valor: 3},
        {nome: 'AR_4', img: CARTAS_IMAGEM.CARTA_AR_4, naipe: NAIPES.AR, valor: 4},
        {nome: 'AR_5', img: CARTAS_IMAGEM.CARTA_AR_5, naipe: NAIPES.AR, valor: 5},
        {nome: 'AR_6', img: CARTAS_IMAGEM.CARTA_AR_6, naipe: NAIPES.AR, valor: 6},
        {nome: 'AR_7', img: CARTAS_IMAGEM.CARTA_AR_7, naipe: NAIPES.AR, valor: 7},
    ],
    FOGO: [
        {nome: 'FOGO_1', img: CARTAS_IMAGEM.CARTA_FOGO_1, naipe: NAIPES.FOGO, valor: 1},
        {nome: 'FOGO_2', img: CARTAS_IMAGEM.CARTA_FOGO_2, naipe: NAIPES.FOGO, valor: 2},
        {nome: 'FOGO_3', img: CARTAS_IMAGEM.CARTA_FOGO_3, naipe: NAIPES.FOGO, valor: 3},
        {nome: 'FOGO_4', img: CARTAS_IMAGEM.CARTA_FOGO_4, naipe: NAIPES.FOGO, valor: 4},
        {nome: 'FOGO_5', img: CARTAS_IMAGEM.CARTA_FOGO_5, naipe: NAIPES.FOGO, valor: 5},
        {nome: 'FOGO_6', img: CARTAS_IMAGEM.CARTA_FOGO_6, naipe: NAIPES.FOGO, valor: 6},
        {nome: 'FOGO_7', img: CARTAS_IMAGEM.CARTA_FOGO_7, naipe: NAIPES.FOGO, valor: 7},
    ],
    GELO: [
        {nome: 'GELO_1', img: CARTAS_IMAGEM.CARTA_GELO_1, naipe: NAIPES.GELO, valor: 1},
        {nome: 'GELO_2', img: CARTAS_IMAGEM.CARTA_GELO_2, naipe: NAIPES.GELO, valor: 2},
        {nome: 'GELO_3', img: CARTAS_IMAGEM.CARTA_GELO_3, naipe: NAIPES.GELO, valor: 3},
        {nome: 'GELO_4', img: CARTAS_IMAGEM.CARTA_GELO_4, naipe: NAIPES.GELO, valor: 4},
        {nome: 'GELO_5', img: CARTAS_IMAGEM.CARTA_GELO_5, naipe: NAIPES.GELO, valor: 5},
        {nome: 'GELO_6', img: CARTAS_IMAGEM.CARTA_GELO_6, naipe: NAIPES.GELO, valor: 6},
        {nome: 'GELO_7', img: CARTAS_IMAGEM.CARTA_GELO_7, naipe: NAIPES.GELO, valor: 7},
    ],
    TERRA: [
        {nome: 'TERRA_1', img: CARTAS_IMAGEM.CARTA_TERRA_1, naipe: NAIPES.TERRA, valor: 1},
        {nome: 'TERRA_2', img: CARTAS_IMAGEM.CARTA_TERRA_2, naipe: NAIPES.TERRA, valor: 2},
        {nome: 'TERRA_3', img: CARTAS_IMAGEM.CARTA_TERRA_3, naipe: NAIPES.TERRA, valor: 3},
        {nome: 'TERRA_4', img: CARTAS_IMAGEM.CARTA_TERRA_4, naipe: NAIPES.TERRA, valor: 4},
        {nome: 'TERRA_5', img: CARTAS_IMAGEM.CARTA_TERRA_5, naipe: NAIPES.TERRA, valor: 5},
        {nome: 'TERRA_6', img: CARTAS_IMAGEM.CARTA_TERRA_6, naipe: NAIPES.TERRA, valor: 6},
        {nome: 'TERRA_7', img: CARTAS_IMAGEM.CARTA_TERRA_7, naipe: NAIPES.TERRA, valor: 7},
    ],
}


export const CONJUNTOS_CARTAS = [
    {
        nome: "AR",
        img: CARTAS_IMAGEM.CARTA_AR_CAPA,
    },
    {
        nome: "FOGO",
        img: CARTAS_IMAGEM.CARTA_FOGO_CAPA,
    },
    {
        nome: "GELO",
        img: CARTAS_IMAGEM.CARTA_GELO_CAPA,
    },
    {
        nome: "TERRA",
        img: CARTAS_IMAGEM.CARTA_TERRA_CAPA,
    },
]

export const CARTEADOR_HABILIDADES = [
    {
        nome: "Encrenca em Dobro",
        requisitos: "2 cartas do mesmo valor + 2 cartas do mesmo valor",
        efeito: `Você causa dano igual a (10 + o valor mais alto entre as cartas usadas) em cada alvo entre um e dois inimigos que você possa ver e estejam presentes na cena. 
        Escolha o tipo de dano entre os correspondentes aos naipes usados.`
    },
    {
        nome: "Flush Mágico",
        requisitos: "4 cartas do mesmo naipe com valores em sequência",
        efeito: `Você causa dano igual a (25 + o valor total das cartas usadas) em cada 
        inimigo presente na cena. O tipo de dano é correspondente ao naipe usado.`
    },
    {
        nome: "Flush Ofuscante",
        requisitos: "4 cartas com valores em sequência",
        efeito: `Você causa dano igual a (15 + o valor total das cartas usadas) em cada 
        inimigo presente na cena. O tipo de dano é luz se o valor mais alto entre as 
        cartas usadas for par; ou trevas se esse valor for ímpar.`
    },
    {
        nome: "Full Status",
        requisitos: "3 cartas do mesmo valor + 2 cartas do mesmo valor",
        efeito: `Escolha duas condições entre abalado, atordoado, fraco e lento: se (o valor mais alto entre as cartas usadas) for par, 
        você e todos os aliados presentes na cena se recuperam das condições escolhidas; ou cada inimigo presente na cena sofre as condições escolhidas se esse valor for ímpar.`
    },
    {
        nome: "Grande Prêmio",
        requisitos: "4 cartas do mesmo valor e nenhum coringa",
        efeito: `Você e todos os aliados presentes na cena recuperam 777 PV e 777 PM; PJs 
        que tenham se rendido e ainda estiverem presentes na cena recuperam a 
        consciência de imediato (mas isso não termina efeitos da rendição).`
    },
    {
        nome: "Par Mágico",
        requisitos: "2 cartas do mesmo valor",
        efeito: `Faça um ataque livre com uma arma equipada. Se causar dano, escolha um 
        naipe entre os que foram usados; todo dano causado pelo ataque se torna 
        do tipo correspondente ao dano do naipe.`
    },
    {
        nome: "Trinca de Suporte",
        requisitos: "3 cartas do mesmo valor",
        efeito: `Você e todos os aliados presentes na cena recuperam uma quantidade de 
        PV e PM igual a (3 × o valor total das cartas usadas).`
    },
]

export const BARALHO_INICIAL = {
    "conjunto1": "AR",
    "conjunto2": "FOGO",
    "conjunto3": "GELO",
    "conjunto4": "TERRA",
    "cartas": [
        {"nome": "AR_1", "naipe": "AR", "valor": 1, "mesa": "BARALHO", "posicao_arr": 1},
        {"nome": "AR_2", "naipe": "AR", "valor": 2, "mesa": "BARALHO", "posicao_arr": 2},
        {"nome": "AR_3", "naipe": "AR", "valor": 3, "mesa": "BARALHO", "posicao_arr": 3},
        {"nome": "AR_4", "naipe": "AR", "valor": 4, "mesa": "BARALHO", "posicao_arr": 4},
        {"nome": "AR_5", "naipe": "AR", "valor": 5, "mesa": "BARALHO", "posicao_arr": 5},
        {"nome": "AR_6", "naipe": "AR", "valor": 6, "mesa": "BARALHO", "posicao_arr": 6},
        {"nome": "AR_7", "naipe": "AR", "valor": 7, "mesa": "BARALHO", "posicao_arr": 7},
        {"nome": "FOGO_1", "naipe": "FOGO", "valor": 1, "mesa": "BARALHO", "posicao_arr": 8},
        {"nome": "FOGO_2", "naipe": "FOGO", "valor": 2, "mesa": "BARALHO", "posicao_arr": 9},
        {"nome": "FOGO_3", "naipe": "FOGO", "valor": 3, "mesa": "BARALHO", "posicao_arr": 10},
        {"nome": "FOGO_4", "naipe": "FOGO", "valor": 4, "mesa": "BARALHO", "posicao_arr": 11},
        {"nome": "FOGO_5", "naipe": "FOGO", "valor": 5, "mesa": "BARALHO", "posicao_arr": 12},
        {"nome": "FOGO_6", "naipe": "FOGO", "valor": 6, "mesa": "BARALHO", "posicao_arr": 13},
        {"nome": "FOGO_7", "naipe": "FOGO", "valor": 7, "mesa": "BARALHO", "posicao_arr": 14},
        {"nome": "GELO_1", "naipe": "GELO", "valor": 1, "mesa": "BARALHO", "posicao_arr": 15},
        {"nome": "GELO_2", "naipe": "GELO", "valor": 2, "mesa": "BARALHO", "posicao_arr": 16},
        {"nome": "GELO_3", "naipe": "GELO", "valor": 3, "mesa": "BARALHO", "posicao_arr": 17},
        {"nome": "GELO_4", "naipe": "GELO", "valor": 4, "mesa": "BARALHO", "posicao_arr": 18},
        {"nome": "GELO_5", "naipe": "GELO", "valor": 5, "mesa": "BARALHO", "posicao_arr": 19},
        {"nome": "GELO_6", "naipe": "GELO", "valor": 6, "mesa": "BARALHO", "posicao_arr": 20},
        {"nome": "GELO_7", "naipe": "GELO", "valor": 7, "mesa": "BARALHO", "posicao_arr": 21},
        {"nome": "TERRA_1", "naipe": "TERRA", "valor": 1, "mesa": "BARALHO", "posicao_arr": 22},
        {"nome": "TERRA_2", "naipe": "TERRA", "valor": 2, "mesa": "BARALHO", "posicao_arr": 23},
        {"nome": "TERRA_3", "naipe": "TERRA", "valor": 3, "mesa": "BARALHO", "posicao_arr": 24},
        {"nome": "TERRA_4", "naipe": "TERRA", "valor": 4, "mesa": "BARALHO", "posicao_arr": 25},
        {"nome": "TERRA_5", "naipe": "TERRA", "valor": 5, "mesa": "BARALHO", "posicao_arr": 26},
        {"nome": "TERRA_6", "naipe": "TERRA", "valor": 6, "mesa": "BARALHO", "posicao_arr": 27},
        {"nome": "TERRA_7", "naipe": "TERRA", "valor": 7, "mesa": "BARALHO", "posicao_arr": 28},
        {"nome": "CORINGA_1", "naipe": "CORINGA", "valor": "CORINGA", "mesa": "BARALHO", "posicao_arr": 29},
        {"nome": "CORINGA_2", "naipe": "CORINGA", "valor": "CORINGA", "mesa": "BARALHO", "posicao_arr": 30}
    ]
}