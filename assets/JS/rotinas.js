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
  this.criarPartida = async () => {
    let partidas = await api.get('partidas');
    let ultimoId = partidas.length > 0 ? partidas[partidas.length - 1].id : 0; // Garante que existe um ID válido
    let idCriador = util.lerLocalStorage('session');

    // Inicializa o objeto com ID e lotação padrão
    let novaPartida = {
      "id": +ultimoId + 1,
      "idCriador": idCriador,
      "lotacao": 1
    };

    // Estrutura dos elementos do formulário
    let elementosForm = {
      "Criador": "nome-criador",
      "Esporte": "esporte",
      "Data": "data",
      "Horario": "horario",
      "Jogadores": "quantidade-jogadores",
      "Categoria": "modalidade",
      "Obrigatorio": "equipamento",
      "CEP": "cep-local",
      "Numero": "numero-local",
    };

    // Preenche o objeto novaPartida com os valores do formulário
    Object.entries(elementosForm).forEach(([chave, valor]) => {
      let inputValue = document.getElementById(valor)?.value;

      // Validação: impede campos vazios
      if (!inputValue) {
        console.error(`O campo ${chave} não foi preenchido.`);
        throw new Error(`O campo ${chave} é obrigatório.`);
      }

      // Adiciona os valores ao objeto novaPartida
      novaPartida[chave] = inputValue;
    });
    console.log("Nova partida criada:", novaPartida);

    // Envia os dados para a API
    await api.post('partidas', novaPartida);
  };
  this.visualizarMinhasPartidas = async () => {
    let idUsuarioLogado = util.lerLocalStorage('session');  // Lê o ID do usuário logado
    let usuario = await util.procurarUsuarioId(idUsuarioLogado);  // Busca o usuário

    // Verifica se o usuário foi encontrado e se o array de partidas existe
    if (!usuario || !usuario.partidas) {
      console.error("Usuário ou partidas não encontrado.");
      return;
    }

    let idPartidas = usuario.partidas;
    console.log("Partidas do usuário:", idPartidas);

    let partidas = await api.get('partidas');
    let partidasUsuario = [];

    // Preenche o array partidasUsuario com as partidas que o usuário participa
    idPartidas.forEach((idpartida) => {
      // Adiciona a partida ao array de partidas do usuário
      partidasUsuario.push(util.retornarPartidaSelecionada(partidas, idpartida));
    });

    // Renderiza os cards das partidas
    front.renderizarCards(partidasUsuario);
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
        let UsuarioSessao = await util.procurarUsuarioLogin(email);
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
  this.gerarMapa = async (CEP, numRua) => {
    let geoLocalizacao = await util.buscarLatEhLong(CEP, numRua)
    mapboxgl.accessToken = 'pk.eyJ1IjoibmF0YW5tb3JvbmkiLCJhIjoiY201bG9iZmszMHl1dTJucHRlZmQzZTVqaiJ9.NySBMXuz60T3jPCP-4_KkA';
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [geoLocalizacao], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });
  }

}
function processaDados() {
  //retorna a partida seleciona pelo usuário ou null caso não encontrada
  this.retornarPartidaSelecionada = (partidas, idPartida) => {

    // Tentar forçar os tipos de dados para garantir que sejam comparáveis
    const partidaSelecionada = partidas.find(partida => String(partida.id) === String(idPartida));

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
  this.lerLocalStorage = (property) => {
    let strdados = localStorage.getItem(property);
    //se não houver dados no localStorage, retona erro
    return strdados ? JSON.parse(strdados) : null
  }
  this.procurarUsuarioLogin = async (login) => {
    let usuarios = await api.get('usuarios')
    let usuarioEncontrado;

    usuarioEncontrado = usuarios.find((usuario) => usuario.email == login);

    // Verifica se o usuário foi encontrado
    if (!usuarioEncontrado) {
      console.info("Usuário não encontrado");
    } else {
      console.info("Usuário Encontrado");
    }
    return usuarioEncontrado;
  }
  this.procurarUsuarioId = async (id) => {
    let usuarios = await api.get('usuarios');
    let usuarioEncontrado = usuarios.find((usuario) => usuario.id === id);  // Corrigido o nome da variável

    // Verifica se o usuário foi encontrado
    if (!usuarioEncontrado) {
      console.info("Usuário não encontrado");
    } else {
      console.info("Usuário Encontrado");
    }
    return usuarioEncontrado;
  };

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
    let usuarioSessao = await this.procurarUsuarioLogin(login);
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
  this.buscarCEP = async (CEP) => {
    const urlRequisicao = `https://viacep.com.br/ws/${CEP}/json/`
    try {
      if (CEP.length !== 9) {
        throw new Error("CEP inválido")
      }
      const res = await fetch(urlRequisicao)
      const dados = await res.json()
      return dados;
    } catch (e) {
      console.log("Erro ao ler CEP: " + e.message)
    }
  }
  this.buscarLatEhLong = async (CEP, numRua) => {
    try {
      let objEndc = await util.buscarCEP(CEP);
      let strEndereco = `${objEndc.logradouro}, ${numRua}, ${objEndc.localidade}, ${objEndc.uf}, ${CEP}`
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(strEndereco)}&format=json`;

      const response = await fetch(url);
      const data = await response.json();
      let latEhLong = `${data[0].lat}, ${data[0].lon}`;

      if (data.length == null) {
        throw new Error("latitude e longitude não encontradas")
      }
      console.log("lat e long"+latEhLong);
      return latEhLong;
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }
}
const util = new processaDados();
const front = new retornosFront();
const usuario = new rotinasUsuario();