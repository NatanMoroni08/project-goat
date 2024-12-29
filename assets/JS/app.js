/* Aplicação das funcionalidades do sistema */
const util = new processaDados();
const front = new retornosFront();
const usuario = new rotinasUsuario();
const currentPage = window.location.pathname;

// Chama a função principal de navegação
iniciarSistema();

// Função principal de navegação baseada na URL
async function iniciarSistema() {
    switch (currentPage) {
        case '/pages/login.html':
            usuario.login();
            break;

        case '/pages/home_pos_login.html':
            front.abrirSpinnerCarregamento();
            let partidas = await api.get("partidas");
            // Chama a função assíncrona para verificar as partidas exibidas na home
            const partidasExibidas = await partidasExibidasHome(partidas);
            if (partidasExibidas) {
                console.log("partidas exibidas na home");
            } else {
                console.log("partidas não exibidas");
            }
            front.fecharSpinnerCarregamento();
            let idPartidaSelecionada = await esperarcliqueCard();
            cliqueNoCard(partidas, idPartidaSelecionada);
            cliqueParticipar(partidas, idPartidaSelecionada);
            break;

        // Você pode adicionar outros casos conforme necessário, como outras páginas da sua aplicação
        default:
            console.log("Página não configurada para tratamento.");
            break;
    }
}

// Função assíncrona para verificar se as partidas foram cadastradas e exibidas
async function partidasExibidasHome(partidas) {
    try {
        // Verificando se há partidas recebidas
        if (!partidas || partidas.length === 0) {
            console.log("Nenhuma partida encontrada.");
            return false;  // Retorna falso caso não haja partidas
        }
        // Se houver partidas, renderiza os cards
        front.renderizarCards(partidas);
        return true;  // Retorna verdadeiro indicando que as partidas foram renderizadas

    } catch (error) {
        // Captura e exibe erros na chamada da API
        console.error("Erro ao buscar partidas:", error);
        return false;  // Retorna falso se ocorrer algum erro
    }
}
async function esperarcliqueCard() {
    let btnPopUps = document.getElementsByClassName("openPopupButton");
    // Aguarda até que um botão seja clicado
    let idPartidaSelecionada = await util.idPartidaSelecionada(btnPopUps);
    return idPartidaSelecionada;
}
async function cliqueNoCard(partidas, idPartidaSelecionada) {
    // Busca a partida correspondente pelo ID
    let objPrtidaSelecionada = util.retornarPartidaSelecionada(partidas, idPartidaSelecionada);

    // Atualiza o front com os dados da partida
    if (objPrtidaSelecionada) {
        front.inserirDadosPopUp(objPrtidaSelecionada);
    } else {
        //adicionar logs às mensagens personalizadas da plataforma
        console.error("Partida não encontrada para o ID:", idPartidaSelecionada);
    }
}
async function cliqueParticipar(partidas, idPartida) {
    let btnParticipar = document.getElementById('participar');
    btnParticipar.addEventListener("click", ()=> {
        let partidaSelecionada = util.retornarPartidaSelecionada(partidas, idPartida)
    if(util.temEspacoNaPartida(partidaSelecionada)){
        usuario.addPartida(idPartida);
        util.atualizarLotação(partidas, idPartida)
    }
    else{
        //adicionar logs às mensagens personalizadas da plataforma
        console.log("Partida cheia");
    }
    })
}
//SÓ PRECISO SABER O ID DA PARTIDA, NÃO PRECISO DO OBJ PARTIDA, SABENDO O ID EU JÁ ACESSO O OBJETO ESPECÍFICO
//ESTÁ CAPTURANDO APENAS O PRIMEIRO CLIQUE E NÃO ATUALIZANDO A VARIÁVEL
//ESTÁ ACONTECENDO SOMA DE STRNGS NA LOTAÇÃO