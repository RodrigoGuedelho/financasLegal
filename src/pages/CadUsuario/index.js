import React, {useState, useRef, useEffect } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import {Password} from 'primereact/password';
import { Button } from 'primereact/button';
import {Link} from 'react-router-dom';
import { Toast } from "primereact/toast";
import { Image } from 'primereact/image';
import Util from "../../utils/Util";
import usuarioService from "../../services/UsuarioService";
import {useParams} from "react-router-dom";
import auth from "../../auth";
function CadUsuario(props) {
  const [login, setLogin] = useState('');
  const [nome, setNome] = useState('');
  const [senha,setSenha] = useState('');
  const toast = useRef(null);
  //const {match} = props;
  console.log("Match", props)
  //const {id} = match.params;
  const [id, setId] = useState(null);
  const [imagem, setImagem] = useState(null);

  async function salvar(e) {
    try {
      e.preventDefault();
      var retorno = null;
      if (!await validarSalvar())
        return;
      const body = {
        id : !Util.isEmptyNumber(id) ? id : null, 
        login : login,
        nome : nome,
        senha : senha
      }
      if (!Util.isEmptyNumber(id))
        retorno = await usuarioService.editar(body);
      else
        retorno = await usuarioService.salvar(body);
      if (retorno.status >= 200 && retorno.status < 300) {
        showMessage("Operação realizada com sucesso.", "success", "Operação")
        limparCampos();
      }
      else 
        showMessage("Erro ao tenta salvar.", "error", "Operação");
    } catch (error) {
      showMessage("Erro ao tenta salvar.", "error", "Operação")
    }
  }

  function limparCampos() {
    setLogin('');
    setNome('');
    setSenha('');
  }

  function validarSalvar() {
    if (Util.isEmpty(login)) {
      showMessage("Informe o nome de usuário.", "error", "Operação");
      return false;
    } else if (Util.isEmpty(nome)) {
      showMessage("Informe o nome.", "error", "Operação");
      return false;
    } else if (Util.isEmpty(senha)) {
      showMessage("Informe a senha.", "error", "Operação");
      return false;
    }
    return true;
  }

  const showMessage = (mensagem, tipo, titulo) => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }


  useEffect(() => { 
    async function configuracaoUsuario() {
      if (auth.isAuthenticated()) {
        const usuario = await usuarioService.findUsuarioLogado();
        if(usuario) {
          setId(usuario.id);
          setLogin(usuario.login);
          setNome(usuario.nome);

          const imagemUsuario = await usuarioService.getImagem(id);

          if (!Util.isEmpty(imagemUsuario)) {
            setImagem(imagemUsuario);
          }
        }
      }
    }
    configuracaoUsuario();
  }, []);

  return (
    <div className="p-margin-formularios">
      <form id="formUsuarios" className="p-fluid" >
        <Panel header="Cadastro de Usuários">
          <Toast ref={toast} position="top-right" />
          <div className="p-fluid p-formgrid p-grid">
              <div className={imagem != null ? 'p-field p-col-12 p-md-12' : 'display-none'}>
                <Image src={imagem} alt="Image" preview  />
              </div>
              <div className="p-field p-col-12 p-md-3">
                  <label htmlFor="firstnameLogin">Login</label>
                  <InputText id="inputLogin" type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
              </div>

              <div className="p-field p-col-12 p-md-3">
                  <label htmlFor="firstnameNome">Nome</label>
                  <InputText id="inputNome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>

              <div className="p-field p-col-12 p-md-3">
                  <label htmlFor="firstnameSenha">Senha</label>
                  <Password id="senha" aria-describedby="username2-help" value={senha} 
                  onChange={e => setSenha(e.target.value)} toggleMask feedback={false}/>
              </div>
              <div className="p-field p-col-12 p-md-8 "/>
              <div className="p-field p-col-12 p-md-2">
                <Button id="salvarProduto" label="Salvar" onClick={salvar} />
              </div>
              <div className="p-field p-col-12 p-md-2 ">
                <Link to="/" className="p-button p-button-secondary btn-link p-d-flex p-jc-center">Cancelar</Link>
              </div>
          </div>
        </Panel>  
      </form>
    </div> 
    );

}

export default CadUsuario;