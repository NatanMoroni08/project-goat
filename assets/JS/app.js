/* Aplicação das funcionalidades do sistema */
let repoName = "/project-goat"; 
let currentPage = window.location.pathname;

// Ajusta o caminho para funcionar corretamente no GitHub Pages
if (currentPage.startsWith(repoName)) {
    currentPage = currentPage.replace(repoName, "");
}
currentPage = currentPage.toLowerCase();

// Adiciona .html se estiver faltando 
if (!currentPage.endsWith(".html") && currentPage !== "/") { 
    currentPage += ".html"; 
} 
console.log(currentPage);  //imprime resultado
document.addEventListener("DOMContentLoaded", function () {
    front.renderizarNavbar();
});

// Chama a função principal de navegação
iniciarSistema();

// Função principal de navegação baseada na URL
async function iniciarSistema() {
    let pages = ["login", "tela_cadastro", "home_pos_login", "montarPartida", "minhasPartidas"];

    switch (currentPage) {
        case '/pages/login.html':
            usuario.login();
            break;

        case '/pages/home_pos_login.html':
            front.abrirSpinnerCarregamento();
            let partidas = await api.get("partidas");
            const partidasExibidas = await partidasExibidasHome(partidas);
            console.log(partidasExibidas ? "partidas exibidas na home" : "partidas não exibidas");
            front.fecharSpinnerCarregamento();

            let btnAbrirPopUp = document.getElementsByClassName("openPopupButton");
            let idPartidaSelecionada;

            Array.from(btnAbrirPopUp).forEach((button) => {
                button.addEventListener("click", function () {
                    idPartidaSelecionada = button.id;
                    let objPartida = util.retornarPartidaSelecionada(partidas, idPartidaSelecionada);
                    front.gerarMapa(objPartida.CEP, objPartida.Numero);
                    console.log("Botão do card clicado, ID capturado:", idPartidaSelecionada);
                    cliqueNoCard(partidas, idPartidaSelecionada);
                    cliqueParticipar(idPartidaSelecionada);
                });
            });
            break;

        case '/pages/montarPartida.html':
            console.log("Carregou a montar");
            document.getElementById('subimitForm').addEventListener("click", () => {
                usuario.criarPartida();
                console.log("partida criada");
            });
            break;

        case '/pages/minhas_partidas.html':
            front.abrirSpinnerCarregamento();
            let idUsuarioLogado = util.qualUsuarioLogado();
            let partidasDoUsuario = await util.partidasDoUsuario(idUsuarioLogado);
            front.renderizarCards(partidasDoUsuario);
            front.fecharSpinnerCarregamento();

            let btnPopUp = document.getElementsByClassName("openPopupButton");
            let idPartidaClicada;
            Array.from(btnPopUp).forEach((button) => {
                button.addEventListener("click", function () {
                    idPartidaClicada = button.id;
                    let objPartida = util.retornarPartidaSelecionada(partidasDoUsuario, idPartidaClicada);
                    front.gerarMapa(objPartida.CEP, objPartida.Numero);
                    console.log("Botão do card clicado, ID capturado:", idPartidaClicada);
                    cliqueNoCard(partidasDoUsuario, idPartidaClicada);
                    cliqueAbandonar(idUsuarioLogado, idPartidaClicada);
                });
            });
            break;

        default:
            console.log("Página não configurada para tratamento.");
            break;
    }
}

async function partidasExibidasHome(partidas) {
    try {
        if (!partidas || partidas.length === 0) {
            console.log("Nenhuma partida encontrada.");
            return false;
        }
        front.renderizarCards(partidas);
        return true;
    } catch (error) {
        console.error("Erro ao buscar partidas:", error);
        return false;
    }
}

async function cliqueNoCard(partidas, idPartidaSelecionada) {
    console.log("Inseriu informações no card");
    let partida = partidas.find(partida => String(partida.id) === String(idPartidaSelecionada));
    if (partida) {
        front.inserirDadosPopUp(partida);
    } else {
        console.error("Partida não encontrada para o ID:", idPartidaSelecionada);
    }
}

async function cliqueParticipar(idPartida) {
    idPartida = parseInt(idPartida);
    let partidas = await api.get("partidas");
    let btnParticipar = document.getElementById('participar');
    let partidaSelecionada = partidas.find(p => p.id === idPartida);

    let newBtn = btnParticipar.cloneNode(true);
    btnParticipar.parentNode.replaceChild(newBtn, btnParticipar);

    newBtn.addEventListener("click", async () => {
        let foiAdicionada = usuario.addPartida(partidaSelecionada, util.qualUsuarioLogado());
        if (foiAdicionada) {
            util.atualizarLotação(partidas, idPartida);
        }
    });
}

async function cliqueAbandonar(idUsuario, idPartida) {
    let usuario = await util.procurarUsuarioId(idUsuario);
    let partidasUsuario = usuario.partidas;

    idPartida = parseInt(idPartida);
    let partidasAtualizadas = partidasUsuario.filter(p => p !== idPartida);

    let dadosAtualizados = {
        "partidas": partidasAtualizadas
    };

    await api.patch(`usuarios/${idUsuario}`, dadosAtualizados);
}
