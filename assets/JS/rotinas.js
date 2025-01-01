function rotinasUsuario() {
  this.addPartida = async (partida) => {

    let idUsuarioLogado = util.qualUsuarioLogado(); // Obtém o ID do usuário logado
    let objUsuario = await api.get(`usuarios/${idUsuarioLogado}`); // Obtém os dados do usuário logado

    try {
      if (objUsuario) {
        // Certifica-se de que partidas é um array
        if (!Array.isArray(objUsuario.partidas)) {
          throw new TypeError("partidas em Usuários não é um Array: ", objUsuario.partidas)
        }
        // Verifica se a partida já está no array
        else if (objUsuario.partidas.includes(parseInt(partida.id))) {
          console.log("A partida já existe no array de partidas do usuário:", partida.id);
          return false
        }
        else if (!util.temEspacoNaPartida(partida)) {
          console.info("partida cheia")
          return false;
        }
        // Adiciona a nova partida ao array de partidas
        let novasPartidas = [...objUsuario.partidas, parseInt(partida.id)];
        // Dados para enviar no PATCH
        let dados = {
          partidas: novasPartidas
        };
        // Atualiza o servidor com as novas partidas
        await api.patch(`usuarios/${idUsuarioLogado}`, dados);

        console.log("Partida adicionada com sucesso:", partida.id);
        return true
      }
      else {
        throw new ReferenceError("O Usuário logado não foi encontrado")
      }
    } catch (e) {
      console.error("Erro: ", e.message)
    }
  };

  //this.updatePerfil =
  //this.rmvPartida = 
  //this.logoff = 
  this.login = () => {
    //capturando o elemento html e adicionando ouvinte de evento
    const button = document.querySelector('#submitLogin');

    button.addEventListener('click', async () => {
      try {
        let email = document.getElementById("email").value;
        let senha = document.getElementById("senha").value;
        let UsuarioSessao = await util.procurarUsuario(email);
        let loginEhValido = await util.loginSenhaCorretos(email, senha);
        //verificando se os valores não são nulos
        if (!email || !senha) {
          throw new TypeError("Preencha todos os campos")
        }
        else if (loginEhValido) {
          //verificando se o login e senha fornecidos estão corretos
          window.location.href = 'home_pos_login.html'
          util.salvarDadosLocalStorage('session', UsuarioSessao.id)
        }
        else {
          //adicionar logs às mensagens personalizadas da plataforma
          console.info("login ou senha inválidos");
        }
      } catch (e) {
        //adicionar logs às mensagens personalizadas da plataforma
        e instanceof TypeError ? console.log("Erro de tipo ou preenchimento: ", e.message) : console.error("erro: ", e)
      }
    });
  }
}
function retornosFront() {
  //abre um spinner de carregamento de informação
  this.abrirSpinnerCarregamento = () => {
    document.querySelector(".carregamento").style.display = "flex";
  }
  //fecha um spinner de carregamento de informação
  this.fecharSpinnerCarregamento = () => {
    document.querySelector(".carregamento").style.display = "none";
  }
  /*this.iniciarCarregamentoEntrePaginas*/
  this.exibirNotificacao = (message, type, icon) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible mb-1" role="alert" id="notificacao">`,
      `   <div><i class="${icon} fa-lg me-2"></i>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    //insere no html a notificação
    document.getElementById("liveAlertPlaceholder").append(wrapper);
    // const tipoNotificacao = Object.freeze({
    //     Exito: 'success',
    //     Informacao: 'primary',
    //   });

    // const mensagem = Object.freeze({
    //     Exito: '<strong>Legal, agora você está participando da partida!</strong>'
    //     SemEspaco: '<strong>Ops, parece que a partida já está cheia!</strong>',
    //   });    
  }
  this.renderizarCards = (partidas) => {
    const html = partidas.reduce((acc, partidas) => {
      acc += `
            <div class="card-participar col-sm-6 col-md-4 col-lg-3">
            <div class="card">
              <img src="../assets/images/Quadracard.jpg" class="card-img-top" alt="...">
              <div class="card-body d-flex flex-column">
                <p class="card-title">Criado por: ${partidas.Criador}</p>
                <p class="card-text">Jogadores: ${partidas.lotacao}/${partidas.Jogadores}</p>
                <p class="card-text">Local: ${partidas.localizacao}</p>
                <div class="mt-auto d-flex justify-content-end">
                  <button type="button" class="openPopupButton btn btn-light ms-auto" id="${partidas.id}" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">Mais</button>
                </div>
              </div>
            </div>
          </div> 
          `;

      return acc;
    }, "");
    document.getElementById("linha-cards").innerHTML = html;
  }
  //retorna
  //this.AbrirPopupPartida =
  this.inserirDadosPopUp = (partida) => {
    try {
      if (!partida) {
        throw new TypeError("A partida selecionada está vazia");
      }

      // Definindo os elementos do pop-up e suas respectivas chaves da partida
      var elementosPopUp = {
        "Criador": "p-criador",
        "Esporte": "p-esporte",
        "Data": "p-data",
        "Horario": "p-horario",
        "Jogadores": "p-jogadores",
        "Categoria": "p-categoria",
        "Obrigatorio": "p-obrigatorio"
      };

      // Itera sobre as entradas de 'elementosPopUp' e insere os dados no pop-up
      Object.entries(elementosPopUp).forEach(([chave, valor]) => {
        // Verificar se a chave existe na partida antes de atribuir
        const valorDaChave = partida[chave];

        // Se a chave não existir ou for inválida, pode-se atribuir uma mensagem padrão ou deixar vazio
        if (valorDaChave) {
          document.getElementById(valor).textContent = chave + ": " + valorDaChave;
        } else {
          document.getElementById(valor).textContent = chave + ": Não disponível"; // Mensagem padrão
        }
      });

    } catch (e) {
      if (e instanceof TypeError) {
        console.error("Erro: " + e.message);
      } else {
        console.error("Erro inesperado: " + e.message);
      }
    }
  }

}
function processaDados() {
  //retorna a partida seleciona pelo usuário ou null caso não encontrada
  this.retornarPartidaSelecionada = (partidas, idCardClicado) => {

    // Tentar forçar os tipos de dados para garantir que sejam comparáveis
    const partidaSelecionada = partidas.find(partida => String(partida.id) === String(idCardClicado));

    // Se uma partida for encontrada, retorna ela, caso contrário, retorna null
    return partidaSelecionada || null;
  }

  //retorna id da Partida selecionada
  this.idPartidaSelecionada = (classButton) => {
    return new Promise((resolve) => {
      Array.from(classButton).forEach((button) => {
        // Adiciona um único evento de clique
        button.addEventListener("click", function () {
          resolve(button.id); // retorna o id da partida clicada
          console.log("Botão do card clicado, ID capturado:", button.id);
        });
      });
    });
  };

  this.lerLocalStorage = () => {
    let strdados = localStorage.getItem('db');
    //se não houver dados no localStorage, retona erro
    strdados ? JSON.parse(strdados) : console.log("Usuário não encontrado")

  }
  this.procurarUsuario = async (login) => {
    let usuarios = await api.get('usuarios')
    let usuarioEcontrado;

    usuarioEcontrado = usuarios.find((usuario) => usuario.email == login);

    // Verifica se o usuário foi encontrado
    if (!usuarioEcontrado) {
      console.info("Usuário não encontrado");
    } else {
      console.info("Usuário Encontrado");
    }
    return usuarioEcontrado;
  }
  this.partidaComEspaco = (partida) => {
    return partida.lotacao < partida.Jogadores
  }
  this.atualizarLotação = (partidas, id) => {
    let novaLotacao = partidas[id] + 1
    let dados = {
      "lotacao": +partidas[id].lotacao + 1
    }
    api.patch(`partidas/${id}`, dados);
  }
  this.temEspacoNaPartida = (partida) => {
    return partida.lotacao < partida.Jogadores;
  }

  this.loginSenhaCorretos = async (login, snh) => {
    let usuarioSessao = await this.procurarUsuario(login);
    if (!usuarioSessao) {
      console.info("Não existe usuário com esse login");
      return false;  // Retorna false caso o usuário não exista
    }
    return usuarioSessao.senha == snh;
  }
  this.salvarDadosLocalStorage = (chave, dados) => {
    localStorage.setItem(chave, JSON.stringify(dados));
  }
  this.qualUsuarioLogado = () => {
    return localStorage.getItem('session');

  }
}
