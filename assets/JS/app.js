/* Aplicação das funcionalidades do sistema */
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
            await usuario.visualizarMinhasPartidas();
            front.fecharSpinnerCarregamento();
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
    // Atualiza o front com os dados da partida
    if (partidas[idPartidaSelecionada]) {
        front.inserirDadosPopUp(partidas[idPartidaSelecionada]);
    } else {
        //adicionar logs às mensagens personalizadas da plataforma
        console.error("Partida não encontrada para o ID:", idPartidaSelecionada);
    }
}
async function cliqueParticipar(idPartida) {
    idPartida = parseInt(idPartida);
    let partidas = await api.get("partidas")
    let btnParticipar = document.getElementById('participar');

    // Remove event listeners anteriores (opcional)
    let newBtn = btnParticipar.cloneNode(true);
    btnParticipar.parentNode.replaceChild(newBtn, btnParticipar);

    // Adiciona o novo listener
    newBtn.addEventListener("click", async () => {
        let foiAdicionada = usuario.addPartida(partidas[idPartida]);
        if (foiAdicionada) {
            util.atualizarLotação(partidas, idPartida);
        }
    });
}