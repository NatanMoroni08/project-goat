// em rotinas 
function ValidaInfoID() {
  
  // Obtendo referências para os parágrafos
  var pCriador = document.getElementById("p-criador");
  var pEsporte = document.getElementById("p-esporte");
  var pData = document.getElementById("p-data");
  var pHorario = document.getElementById("p-horario");
  var pJogadores = document.getElementById("p-jogadores");
  var pCategoria = document.getElementById("p-categoria");
  var pObrigatorio = document.getElementById("p-obrigatorio");

  partidas.forEach((partida) => {
    if (partida.id == elementId) {
      pCriador.textContent = "Criador: " + partidas.Criador; 
      pEsporte.textContent = "Esporte: " + partidas.Esporte;
      pData.textContent = "Data: " + partidas.Data;
      pHorario.textContent = "Horário: " + partidas.Horario;
      pJogadores.textContent = "Jogadores: " + partidas.Jogadores;
      pCategoria.textContent = "Categoria: " + partidas.Categoria;
      pObrigatorio.textContent = "Obrigatório: " + partidas.Obrigatorio;
    }
  })
}

//em rotinas
function LeLocalStorage() {
  var objdado = "";
  let strdado = localStorage.getItem('db');

  if (strdado) {
    objdado = JSON.parse(strdado);
  }
  else {
    //teste, retirar esse valor para objdado depois 
    console.log("Usuário não encontrado")
  };

  return objdado;
}

async function ProcuraIdUsuario() {
  var NovoParticipante;

  let objdado = await LeLocalStorage();

  console.log(objdado)
 
  LeDadosUsuarios();

  let procura = usuarios.length;
  let usuarioEncontrado = false;
  for (let i = 0; i < procura; i++) {

    if (usuarios[i].email == objdado.email) {
      console.log("usuário encontrado, id: " + usuarios[i].id);
      usuarioEncontrado = true;
      NovoParticipante = usuarios[i].id;
    }
  }

  if (!usuarioEncontrado) {
    console.log("Usuário não encontrado");
  }

  return NovoParticipante;
}

function ClicarParticipar() {

  alertTrigger.addEventListener("click", async () => {

    let NovoParticipante = await ProcuraIdUsuario();

    abrirCarregamento();
    await AtualizaPartidasUsuario(NovoParticipante, elementId);
    fecharCarregamento();
    var mensagemExito = "<strong>Legal, agora você está participando da partida!</strong>";
    var mensagemFalha = "<strong>Ops, parece que a partida já está cheia!</strong>";

    if (ComEspaco) {
      AtualizaLotacao(elementId);
      appendAlert(mensagemExito, "success", "fa-sharp fa-solid fa-circle-check");
    }
    else {
      appendAlert(mensagemFalha, "primary", "fa-solid fa-circle-info");
    }
  });
}

async function carregarPagina() {
  abrirCarregamento();

  const partidas = await api.get("partidas");
  // const usuarios = await api.get("usuarios");

  renderizarCards(partidas);
  AbrirPopup();

  fecharCarregamento();

  //clique em participar 

  ClicarParticipar();
}

carregarPagina();
