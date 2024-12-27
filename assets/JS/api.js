function API() {
    const API_URL = "https://89dac0ee-fe12-4dc7-abde-e6f4f03b17cd-00-1asbl4zohyio9.spock.repl.co:3000/";
  
    this.get = async (endpoint) => {
      const urlRequisicao = API_URL + "/" + endpoint;
  
      const res = await fetch(urlRequisicao, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const dados = await res.json();
  
      if (Object.keys(dados).length === 0) return false;
  
      return dados;
    };
  
    this.post = async (endpoint, body) => {
      const urlRequisicao = API_URL + "/" + endpoint;
  
      const res = await fetch(urlRequisicao, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const dados = await res.json();
  
      return dados;
    };
  
    this.patch = async (endpoint, body) => {
      const urlRequisicao = API_URL + "/" + endpoint;
  
      const res = await fetch(urlRequisicao, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const dados = await res.json();
  
      return dados;
    };
  
    this.put = async (endpoint, body) => {
      const urlRequisicao = API_URL + "/" + endpoint;
  
      const res = await fetch(urlRequisicao, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const dados = await res.json();
  
      return dados;
    };
  
    this.delete = async (endpoint) => {
      const urlRequisicao = API_URL + "/" + endpoint;
  
      await fetch(urlRequisicao, { method: "DELETE" });
    };
  }
  const api = new API();