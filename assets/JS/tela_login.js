var submeterLogin = document.getElementById("submit")

submeterLogin.addEventListener("click", () => 
{
    let email = document.getElementById("email").value;
    if(email !== "")
    {
    var usuarioAtual =
        email
    }
    salvaDados(usuarioAtual)
    login();


});

function salvaDados (dados) {
    localStorage.setItem ('db', JSON.stringify (dados));
}