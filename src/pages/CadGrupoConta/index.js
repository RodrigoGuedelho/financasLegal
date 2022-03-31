import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import grupoContaService from "../../services/GrupoContaService";

function CadGrupoConta(props) {
  const [descricao, setDescricao] = useState('');
  const toast = useRef(null);
  var {id} = useParams();
  async function salvar(e) {
    var response = null;
    try {
      e.preventDefault();
      if (!validarSalvar())
        return;
      const body = {
        id : id? id : null,
        descricao : descricao
      }
      if (id !== null && id != undefined)
        response = await grupoContaService.editar(body);
      else
        response = await grupoContaService.salvar(body);

      if (response.data != undefined)
        showMessage("Operação realizada com sucesso.","success", "Operação");
      else {
        showMessage(response.error,"error", "Operação");
      }
    } catch (error) {
      showMessage("Erro ao tentar salvar grupo de contas.","error", "Operação");
    }
  }

  function validarSalvar() {
    if (descricao.trim() === '' ) {
      showMessage("Descrição não informada.","error", "Operação");
      return false;
    }

    return true;
  }

  const showMessage = (mensagem, tipo, titulo) => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  useEffect(() => {
    async function carregaDados() {
      if(id !== undefined && id !== null){
        const grupoConta = await grupoContaService.find('', id, 'ATIVO');
        console.log("grupoCOnta ", grupoConta)
        if(grupoConta) 
          setDescricao(grupoConta[0].descricao);
      }
    }
    carregaDados();    
  }, []);

  return (
  <div className="p-margin-formularios">
    <form id="formGrupoContas" className="p-fluid" >
      <Panel header="Cadastro de Grupo de Contas">
        <Toast ref={toast} position="top-right" />
        <div className="p-fluid p-formgrid p-grid">
            
            <div className="p-field p-col-12 p-md-6">
                <label htmlFor="firstnameLogin">Descrição</label>
                <InputText id="inputLogin" type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>
            
            <div className="p-field p-col-12 p-md-8 "/>
            <div className="p-field p-col-12 p-md-2">
              <Button id="BtnSalvarGrupoContas" label="Salvar" onClick={salvar} />
            </div>
            <div className="p-field p-col-12 p-md-2 ">
              <Link to="/" className="p-button p-button-secondary btn-link p-d-flex p-jc-center">Cancelar</Link>
            </div>
        </div>
      </Panel>  
    </form>
</div> );

}

export default CadGrupoConta;