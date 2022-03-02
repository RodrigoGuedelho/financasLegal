import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber"
import React, { useRef, useState } from "react";
import grupoContaService from "../../services/GrupoContaService";
import util from "../../utils/Util";


function ListGrupoConta(props) {
  const [descricao, setDescricao] = useState("");
  const [id, setId] = useState(null);
  const [statusFiltro, setStatusFiltro] = useState("ATIVO");
  const [grupoContas, setGrupoContas] = useState([]);

  const toast = useRef(null);
  const status = ["ATIVO", "CANCELADO"];
  const menu =useState(null);
  const [items, setItems] = useState([
    {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: ''},
    {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogDesativacao()}
  ]);

  const [grupoContaExclusao, setGrupoContaExclusao] = useState(null);

  async function pesquisar(e) {
    e.preventDefault();
    console.log("pesquisar")
    setGrupoContas(await grupoContaService.find(descricao, id, statusFiltro))
  }

  const confirmDialogDesativacao = () => {
    confirmDialog({
        message: 'Você tem certeza que deseja o grupo de contas?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => cancelar(),
        reject: () => console.log("fechou")
    });
  }

  function showMenu(e,rowData) {
    e.preventDefault();
    
    setItems([
      {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: getUrlEdiar(rowData)},
      {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogDesativacao()}
    ])
    setGrupoContaExclusao(rowData);
    try {
      menu.current.toggle(e);
    } catch (error) {
      
    }
    
  }

  function getUrlEdiar(grupoConta) {
    return "/grupo-contas/" + grupoConta.id
  }
  
  function cancelar(){

  }
  function actionBodyTemplate(rowData) {   
    return (
        <React.Fragment>
            <Menu id="menuAcoes" model={items} popup ref={menu} id="popup_menu" />
            <Button icon="pi pi-ellipsis-v" onClick={(e)=> showMenu(e, rowData)} aria-controls="popup_menu" aria-haspopup  className="p-button-rounded" />
        </React.Fragment>
    );
  }
  function dataFormatadaBodyTemplate(rowData){
    return util.formatarData(rowData.data);
  }
  function dataUltimaAlteracaoFormatadaBodyTemplate(rowData){
    return util.formatarData(rowData.ultimaAlteracao);
  }
  
  return (
    <div className="p-margin-formularios">
      <form id="formUsuarios" className="p-fluid" >
        <Panel header="Grupo de Contas">
          <Toast ref={toast} position="top-right" />

          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-3">
              <InputNumber inputId="minmax" value={id} onValueChange={(e) => setId(e.value)} mode="decimal" min={1} max={100000000} placeholder="Id"/>
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
         
            <DataTable value={grupoContas} className="p-datatable-responsive-demo" paginator rows={8} responsiveLayout="stack" >
                <Column field="id"  header="Id"></Column>
                <Column field="descricao" header="Decrição"></Column>
                <Column body={dataFormatadaBodyTemplate}  header="Criação"></Column>
                <Column body={dataUltimaAlteracaoFormatadaBodyTemplate}  header="Ultima alteração"></Column>
                <Column body={actionBodyTemplate} header="Ações"  bodyStyle={{ textAlign: 'center' }}>
                
                </Column>
            </DataTable>
          </div>
        </Panel>  
      </form>
    </div> 
  )
}

export default ListGrupoConta;