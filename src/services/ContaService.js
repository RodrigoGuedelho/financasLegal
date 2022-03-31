
import util from "../utils/Util";
import api from "./api";
class ContaService {
  async salvar(conta) {
    var retorno = ""; 
    try {
      retorno = await api.post("/api/contas", 
        JSON.stringify(conta), util.getConfigHeaderAuthorization());
      return retorno;
    } catch (error) {
      util.verificarAutorizacao(error.response.data);
      return error.response.data;
    }
  }

  async editar(conta) {
    var retorno = ""; 
    try {
      retorno = await api.put("/api/contas/" + conta.id, 
        JSON.stringify(conta), util.getConfigHeaderAuthorization());
      return retorno;
    } catch (error) {
      util.verificarAutorizacao(error.response.data);
      return error.response.data;
    }
  }

  async cancelar(id) {
    var retorno = ""; 
    try {
      retorno = await api.put("/api/contas/" + id + "/cancelar", 
        util.getConfigHeaderAuthorization());
      return retorno;
    } catch (error) {
      util.verificarAutorizacao(error.response.data);
      return error.response.data;
    }
  }

  async find(descricao, id, status, tipo) {
    var retorno = ""; 
    try {
      let uri = "/api/contas/?status=" + status 
      if (!util.isEmpty(descricao))
        uri += "&& descricao=" + descricao;
      if (!util.isEmptyNumber(id))
        uri += "&& id=" + id;
      if (!util.isEmpty(tipo))
        uri += "&& tipo=" + tipo;

      retorno = await api.get(uri, util.getConfigHeaderAuthorization());
      return retorno.data;
    } catch (error) {
      util.verificarAutorizacao(error.response.data);
      return error.response.data;
    }
  }
}

export default new ContaService();