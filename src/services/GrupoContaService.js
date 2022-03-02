import auth from "../auth";
import util from "../utils/Util";
import api from "./api";

class GrupoContaService {
  async salvar(grupoConta) {
    var retorno = ""; 
    try {
      retorno = await api.post("/api/grupo-contas", 
        JSON.stringify(grupoConta), util.getConfigHeaderAuthorization());
      console.log("retorno", retorno);
      return retorno;
    } catch (error) {
      util.verificarAutorizacao(error.response.data);
      return error.response.data;
    }
  }

  async editar(grupoConta) {
    var retorno = ""; 
    try {
      retorno = await api.put("/api/grupo-contas/" + grupoConta.id, 
        JSON.stringify(grupoConta), util.getConfigHeaderAuthorization());
      console.log("retorno", retorno);
      return retorno;
    } catch (error) {
      util.verificarAutorizacao(error.response.data);
    }
  }

  async find(descricao, id, status) {
    var retorno = ""; 
    try {
      var uri = "/api/grupo-contas?status=" + status;
      if (!util.isEmpty(descricao))
        uri += "&descricao=" + descricao;
      if (!util.isEmptyNumber(id) && id > 0)
        uri += "&id=" + id;
      
      retorno = await api.get(uri,  util.getConfigHeaderAuthorization());
      return retorno.data;
    } catch (error) {
      util.verificarAutorizacao(error.response.data);
    }
  }

  async cancelar(id) {
    var retorno = ""; 
    try {
      retorno = await api.post("/api/grupo-contas/" + id + '/cancelar', 
        null, util.getConfigHeaderAuthorization());
      console.log("retorno", retorno);
      return retorno;
    } catch (error) {
      util.verificarAutorizacao(error.response.data);
    }
  }
}

export default new GrupoContaService();