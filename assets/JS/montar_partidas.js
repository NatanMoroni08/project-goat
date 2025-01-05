var ultimoId = parseInt(localStorage.getItem('ultimoId')) || 0;

var ultimoID = 0;

function salvarDados() {
  // Captura os valores do formulário

  ultimoID++
  
}

function Lewan() {
  var tipoQuadra = document.getElementById('inputGroupSelect02').value;
  var numeroJogadores = document.querySelector('input[placeholder="Quantos jogadores?"]').value;
  var genero = document.getElementById('inputGroupSelect02').value;
  var equipamento = document.querySelector('input[placeholder="Digite um item"]').value;
  var dataHora = document.getElementById('dataNasc').value;
  var hora = document.getElementById('hora-cons').value;
  var cep = document.querySelector('input[placeholder="Digite seu CEP..."]').value;
  var rua = document.querySelector('input[placeholder="Digite sua Rua..."]').value;
  var numero = document.querySelector('input[placeholder="Digite seu numero..."]').value;
  var bairro = document.querySelector('input[placeholder="Digite seu Bairro..."]').value;
  var cidade = document.querySelector('input[placeholder="Digite sua Cidade..."]').value;
  var pais = document.querySelector('input[placeholder="Digite seu País..."]').value;
  var criador = document.querySelector('input[placeholder="Criador..."]').value;
 

  // Verificar se algum campo obrigatório está vazio
  if (
    tipoQuadra === '' ||
    numeroJogadores === '' ||
    hora === ''||
    genero === '' ||
    equipamento === '' ||
    dataHora === '' ||
    cep === '' ||
    rua === '' ||
    numero === '' ||
    bairro === '' ||
    cidade === '' ||
    pais === '' ||
    criador === '' 
    
  ) { 
    alert('Por favor, preencha todos os campos obrigatórios!');
    return 0
    
  } else {
    var dadosPartida = {
      id: ultimoID,
      criador: criador,
      tipoQuadra: tipoQuadra,
      numeroJogadores: numeroJogadores,
      genero: genero,
      equipamento: equipamento,
      dataHora: dataHora,
      hora: hora,
      localizacao: {
        cep: cep,
        rua: rua,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        pais: pais,
        
        
      }
    };

    var dadosJSON = JSON.stringify({
      id: dadosPartida.id,
      Criador: dadosPartida.criador,
      Esporte: dadosPartida.tipoQuadra,
      Data: dadosPartida.dataHora,
      Horario: dadosPartida.hora,
      Jogadores: dadosPartida.numeroJogadores,
      Categoria: dadosPartida.genero,
      Obrigatorio: dadosPartida.equipamento,
      lotacao: " 1 "
    });

    localStorage.setItem('dadosPartida', dadosJSON);
    localStorage.setItem('ultimoID', ultimoID);


    alert('Dados da partida foram salvos no banco de dados com SUCESSO!');
  }



  fetch('https://jsonserver-partidas-1.nayarissonnatan.repl.co/partidas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      
    },
    body: dadosJSON
  })
    .then(response => response.json())
    .then(data => {
      console.log('Resposta do servidor:', data);
      window.location.href = 'http://127.0.0.1:5500/codigo/pages/home_pos_login.html';
    })
    .catch(error => {
      console.error('Erro ao fazer POST:', error);
    });
  }
