function rotinasUsuario() {
  //this.addPartida = 
  //this.rmPartida = 
  //this.logoff = 
  //this.login = 
  //this.updatePerfil =
}

function retornosFront() {
  //abre um spinner de carregamento de informação
  /*this.abrirSpinnerCarregamento(){
  document.querySelector(".carregamento").style.display = "none";
  }*/
  //fecha um spinner de carregamento de informação
  /*this.fecharSpinnerCarregamento(){
      document.querySelector(".carregamento").style.display = "flex";
  }
  */
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
              <img src="/codigo/assets/images/Quadracard.jpg" class="card-img-top" alt="...">
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
    var elemetosPopUp = {
      "Criador": "p-criador",
      "Esporte": "p-esporte",
      "Data": "p-data",
      "Horario": "p-horario",
      "Jogadores": "p-jogadores",
      "Categoria": "p-categoria",
      "Obrigatorio": "p-obrigatorio"
    };

    // Itera sobre as entradas de 'elemetosPopUp' e insere os dados no pop-up
    Object.entries(elemetosPopUp).forEach(([chave, valor]) => {
      // Corrige a sintaxe de textContent
      document.getElementById(valor).textContent = chave + ": " + partida[chave];
    });
  }

  function processaDados() {
    //retorna a partida seleciona pelo usuário ou null caso não encontrada
    this.retornarPartidaSelecionada = (partidas, idCardClicado) => {
      partidas.forEach((partida) => {
        if (partida.id == idCardClicado) {
          return partida;
        }
      })
      return null
    }
    //retorna id da Partida selecionada
    this.idPartidaSelecionada = () => {
      Array.from(openPopupButtons).forEach(function (button) {
        button.addEventListener("click", function () {
          // Obtém o id do card clicado
          idCardSelecionada = button.id;
          console.log(idCardSelecionada);
          return idCardSelecionada;
        });
      });
    }
  }
  this.lerLocalStorage = () => {
    let strdados = localStorage.getItem('db');
    //se não houver dados no localStorage, retona erro
    strdados ? JSON.parse(strdados):console.log("Usuário não encontrado")
    
  }
}
