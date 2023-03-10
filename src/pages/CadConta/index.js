import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Link, useParams } from "react-router-dom";
import React from "react";
import { useRef, useState, useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import grupoContaService from "../../services/GrupoContaService";
import contaService from "../../services/ContaService";
import util from "../../utils/Util";


function CadConta(props) {

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] =useState(0);
  const [grupoConta, setGrupoConta] = useState(null);
  const [grupoContas, setGrupoContas] = useState([]);
  const [tipo, setTipo] = useState('');
  const [data, setData] = useState(new Date());
  const toast = useRef(null);
  const tipos = ['CREDITO', 'DEBITO'];
  const {id} = useParams();
  const [contaEdiar, setContaEditar] = useState(null);
  

  async function findGrupoConta(event) {
    const response = await grupoContaService.find(event.query.toLowerCase(), null, 'ATIVO')
    setGrupoContas(response);
  }

  async function salvar(e) {
    e.preventDefault();
    if (!validarSalvar())
        return;
    try {
      var response = null;
      const body = {
        id : id? id : null,
        descricao : descricao,
        valor: valor,
        grupoContaId: grupoConta.id,
        tipoConta: tipo,
        data: data

      }
      if (id !== null && id !== undefined)
        response = await contaService.editar(body);
      else 
        response = await contaService.salvar(body);
      

      if (response.data !== undefined) {
        showMessage("Operação realizada com sucesso.","success", "Operação");
        if (id === null || id === undefined)
          limparCampos();
      }
      else {
        showMessage(response.error,"error", "Operação");
      }
    } catch (error) {
      showMessage("Erro ao tentar salvar grupo de contas.","error", "Operação");
    }
  }

  const showMessage = (mensagem, tipo, titulo) => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  function validarSalvar() {
    let retorno = true;
    console.log("descricao", util.isEmpty(descricao.trim()))
    if (util.isEmpty(descricao.trim())) {
      showMessage("Descrição inválida.", "error", "Operação");
      retorno = false;
    } 
    console.log(valor <= 0)
    if (valor <= 0) {
      showMessage("Valor inválido.", "error", "Operação");
      retorno = false;
    } 
    if (util.isEmpty(tipo)) {
      showMessage("Tipo não informado.", "error", "Operação");
      retorno = false;
    }

    if (grupoConta === null || grupoConta === undefined) {
      showMessage("Grupo de contas não informado.", "error", "Operação");
      retorno = false;
    } 

    return retorno;
  }

  function limparCampos() {
    setDescricao("");
    setValor(0);
    setGrupoConta(null);
    setData(new Date());
  }

  useEffect(() => {
    async function carregarDados() {
      
      if (!util.isEmptyNumber(id) && contaEdiar === null ) {
        const response = await contaService.findById(id);
        console.log("response", response.data)
        setContaEditar(response.data);
        setDadosConta(response.data)
      }
    }

    carregarDados();
  });

  function setDadosConta(conta) {
    console.log(contaEdiar)
    setDescricao(conta.descricao);
    setValor(conta.valor);
    setGrupoConta({id: conta.grupoContaId, descricao: conta.grupoContaDescricao});
    setTipo(conta.tipoConta);
    setData(new Date(conta.data));
  }

  return (
    <div className="p-margin-formularios">
    <form id="formGrupoContas" className="p-fluid" >
      <Panel header="Cadastro de Contas">
        <Toast ref={toast} position="top-right" />
        <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-2">
                <label htmlFor="inputData">Data</label>
                <Calendar value={data} onChange={(e) => setData(e.value)} showIcon />
            </div>

            <div className="p-field p-col-12 p-md-8">
                <label htmlFor="firstnameLogin">Descrição</label>
                <InputText id="inputDescricao" type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>

            <div className="p-field p-col-12 p-md-2">
                <label htmlFor="labelValor">Valor</label>
                <InputNumber id="inputValor" value={valor} onChange={(e) => setValor(e.value)}
                  mode="decimal" minFractionDigits={2}  />
            </div>

            <div className="p-field p-col-12 p-md-3">
              <label htmlFor="labelTipo">Tipo:</label>
              <Dropdown value={tipo} options={tipos} onChange={(e) => setTipo(e.value)} placeholder="Tipos"/>
            </div>

            <div className="p-field p-col-12 p-md-3">
                  <label htmlFor="labelConta">Contas:</label>
                  <AutoComplete id="autocompleteMesa" value={grupoConta} suggestions={grupoContas} completeMethod={findGrupoConta} 
                        field="descricao" dropdown forceSelection onChange={(e) => setGrupoConta(e.value)} />
              </div>
            
            <div className="p-field p-col-12 p-md-8 "/>
            <div className="p-field p-col-12 p-md-2">
              <Button id="BtnSalvarContas" label="Salvar" onClick={salvar} />
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

export default CadConta;