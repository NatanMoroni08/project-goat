/* Aplicação das funcionalidades do sistema */
let repoName = "/project-goat"; 
let currentPage = window.location.pathname.replace(repoName, "").toLowerCase();

// Adiciona .html se estiver faltando 
if (!currentPage.endsWith(".html") && currentPage !== "/") { 
    currentPage += ".html"; 
} 
console.log(currentPage);  //imprime resultado

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
            let btnAbrirPopUp = document.getElementsByClassName("openPopupButton");
            let idPartidaSelecionada;

            //aguardar cliques em cards de partidas
            Array.from(btnAbrirPopUp).forEach((button) => {
                // Adiciona um único evento de clique
                button.addEventListener("click", function () {
                    idPartidaSelecionada = button.id;
                    let objPartida = util.retornarPartidaSelecionada(partidas, idPartidaSelecionada)
                    front.gerarMapa(objPartida.CEP, objPartida.Numero);
                    console.log("Botão do card clicado, ID capturado:", idPartidaSelecionada);
                    cliqueNoCard(partidas, idPartidaSelecionada);
                    cliqueParticipar(idPartidaSelecionada);
                });
            });
            break;

        case '/pages/montarPartida.html':
            console.log("Carregou a montar")
            document.getElementById('subimitForm').addEventListener("click", () => {
                usuario.criarPartida();
                console.log("partida criada")
            })
            break;

        case '/pages/minhas_partidas.html':
            front.abrirSpinnerCarregamento();
            //renderizar as partidas do usuário
            let idUsuarioLogado = util.qualUsuarioLogado();
            let partidasDoUsuario = await util.partidasDoUsuario(idUsuarioLogado);
            front.renderizarCards(partidasDoUsuario);
            front.fecharSpinnerCarregamento();

            //pegar clique no card das partidas
            let btnPopUp = document.getElementsByClassName("openPopupButton");
            let idPartidaClicada;
            Array.from(btnPopUp).forEach((button) => {
                // Adiciona um único evento de clique
                button.addEventListener("click", function () {
                    idPartidaClicada = button.id;
                    let objPartida = util.retornarPartidaSelecionada(partidasDoUsuario, idPartidaClicada)
                    front.gerarMapa(objPartida.CEP, objPartida.Numero);
                    console.log("Botão do card clicado, ID capturado:", idPartidaClicada);
                    console.log(partidasDoUsuario)
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
    console.log("Pegou o clique no card")

    return idPartidaSelecionada;
}
async function cliqueNoCard(partidas, idPartidaSelecionada) {
    console.log("Inseriu informações no card")
    //buscar partida
    let partida = partidas.find(partida => String(partida.id) === String(idPartidaSelecionada))
    // Atualiza o front com os dados da partida
    if (partida) {
        front.inserirDadosPopUp(partida);
    } else {
        //adicionar logs às mensagens personalizadas da plataforma
        console.error("Partida não encontrada para o ID:", idPartidaSelecionada);
    }
}
async function cliqueParticipar(idPartida) {
    idPartida = parseInt(idPartida);
    let partidas = await api.get("partidas")
    let btnParticipar = document.getElementById('participar');
    let partidaSelecionada = partidas.find(p => p.id === idPartida);

    // Remove event listeners anteriores (opcional)
    let newBtn = btnParticipar.cloneNode(true);
    btnParticipar.parentNode.replaceChild(newBtn, btnParticipar);

    // Adiciona o novo listener
    newBtn.addEventListener("click", async () => {
        let foiAdicionada = usuario.addPartida(partidaSelecionada, util.qualUsuarioLogado());
        if (foiAdicionada) {
            util.atualizarLotação(partidas, idPartida);
        }
    });
}
async function cliqueAbandonar(idUsuario, idPartida) {
    let dadosAtualizados;
    
    // Obtém as partidas do usuário
    let usuario = await util.procurarUsuarioId(idUsuario);
    let partidasUsuario = usuario.partidas;  

    idPartida = parseInt(idPartida);

    // Cria um novo array sem a partida que foi abandonada
    let partidasAtualizadas = partidasUsuario.filter(p => p !== idPartida);

    dadosAtualizados = {
        "partidas": partidasAtualizadas
    };

    // Realiza a requisição ao servidor para atualizar as partidas do usuário
    await api.patch(`usuarios/${idUsuario}`, dadosAtualizados);
}
