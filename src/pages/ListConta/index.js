import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import React from "react";
import { Menu } from "primereact/menu";
import util from "../../utils/Util";

import contaService from "../../services/ContaService";


function ListConta(props) {
  const [contas, setContas] = useState([]);
  const toast = useRef(null);
  const menu =useState(null);
  const [contaExclusao, setContaExclusao] = useState(null);

  const [descricao, setDescricao] = useState(""); 
  const [statusFiltro, setStatusFiltro] = useState("ATIVO");
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const status = ["ATIVO", "CANCELADO"];
  
  const [items, setItems] = useState([
    {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: ''},
    {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> alert("")}
  ]);
  function actionBodyTemplate(rowData) {   
    return (
        <React.Fragment>
            <Menu id="menuAcoes" model={items} popup ref={menu}/>
            <Button icon="pi pi-ellipsis-v" onClick={(e)=> showMenu(e, rowData)} aria-controls="popup_menu" aria-haspopup  className="p-button-rounded" />
        </React.Fragment>
    );
  }
  const showMessage = (mensagem, tipo, titulo) => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  function showMenu(e,rowData) {
    e.preventDefault();
    
    setItems([
      {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: getUrlEdiar(rowData)},
      {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> alert("ainda em desenvolvimento.")}
    ])
    setContaExclusao(rowData);
    try {
      menu.current.toggle(e);
    } catch (error) {
      
    }
    
  }

  function getUrlEdiar(conta) {
    return "/contas/" + conta.id
  }

  function dataFormatadaBodyTemplate(rowData){
    return util.formatarData(rowData.data);
  }
  function dataUltimaAlteracaoFormatadaBodyTemplate(rowData){
    return util.formatarData(rowData.ultimaAlteracao);
  }

  async function pesquisar(e) {
    e.preventDefault();
    setContas(await contaService.find(util.dateTostring(dataInicio), 
      util.dateTostring(dataFim), descricao, 0, statusFiltro, ""))
  }

  return (
    <div className="p-margin-formularios">
      <form id="formUsuarios" className="p-fluid" >
        <Panel header="Grupo de Contas">
          <Toast ref={toast} position="top-right" /> 

          <div className="p-fluid p-formgrid p-grid">
            <div class="field col-12 mb-2 md:col-2">
          
              <Calendar id="icon" value={dataInicio} onChange={(e) =>setDataInicio(e.value)} 
                  showIcon dateFormat="dd/mm/yy"/>
            </div>
            <div class="field col-12 mb-2 md:col-2">
                <Calendar id="icon" value={dataFim} onChange={(e) =>setDataFim(e.value)} 
                    showIcon dateFormat="dd/mm/yy"/>
            </div>
            <div className="p-field p-col-12 p-md-3">
              <InputText id="inputDescricao" type="text"  value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição"/>
            </div>
            <div className="p-field p-col-12 p-md-2">
              <Dropdown value={statusFiltro} options={status} onChange={(e) => setStatusFiltro(e.value)} placeholder="Status"/>
            </div>
            <div className="p-field p-col-12 p-md-2">
              <Button icon="pi pi-search" onClick={pesquisar}/> 
            </div>
          </div>

          <div className="card">
         
            <DataTable value={contas} className="p-datatable-responsive-demo" paginator rows={8} responsiveLayout="stack" >
                <Column field="descricao" header="Decrição"></Column>
                <Column field="valor" header="Valor"></Column>
                <Column field="status" header="Status"></Column>
                <Column field="tipoConta" header="Tipo"></Column>
                <Column body={dataFormatadaBodyTemplate}  header="Criação"></Column>
                <Column body={dataUltimaAlteracaoFormatadaBodyTemplate}  header="Alteração"></Column>
                <Column body={actionBodyTemplate} header="Ações"  bodyStyle={{ textAlign: 'center' }}>
                </Column>
            </DataTable>
          </div>
        </Panel>  
      </form>
    </div> 
  )
}

export default ListConta;
