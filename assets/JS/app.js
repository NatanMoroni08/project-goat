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
            // Fazendo a chamada à API e esperando a resposta
            let partidas = await api.get("partidas");
            // Chama a função assíncrona para verificar as partidas exibidas na home
            const partidasExibidas = await partidasCadastradasExibidas(partidas);
            if (partidasExibidas) {
                console.log("partidas exibidas na home");
            } else {
                console.log("partidas não exibidas");
            }
            front.fecharSpinnerCarregamento();
            cliqueNoCard(partidas);
            break;

        // Você pode adicionar outros casos conforme necessário, como outras páginas da sua aplicação
        default:
            console.log("Página não configurada para tratamento.");
            break;
    }
}

// Função assíncrona para verificar se as partidas foram cadastradas e exibidas
async function partidasCadastradasExibidas(partidas) {
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
async function cliqueNoCard(partidas) {
    let btnPopUps = document.getElementsByClassName("openPopupButton");
    // Aguarda até que um botão seja clicado
    let idPartidaSelecionada = await util.idPartidaSelecionada(btnPopUps);
    // Busca a partida correspondente pelo ID
    let partidaSelecionada = util.retornarPartidaSelecionada(partidas, idPartidaSelecionada);

    // Atualiza o front com os dados da partida
    if (partidaSelecionada) {
        front.inserirDadosPopUp(partidaSelecionada);
    } else {
        //adicionar logs às mensagens personalizadas da plataforma
        console.error("Partida não encontrada para o ID:", idPartidaSelecionada);
    }
}
