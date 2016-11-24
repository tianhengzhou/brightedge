/**
 * Created by tianheng on 11/23/16.
 */
// Set Refrence To Utilized DOM Elements
var circles = document.getElementById('selCircles');
var loadButton = document.getElementById('btnLoadGrid');
var dataTable = document.getElementById('divDataTable');
function jsDataTable() {
  this.domTable = document.createElement('table');
  this.domTableBody = document.createElement('tbody');
  this.domTableHead = document.createElement('thead');
  this.TableHeadArray = [];
  this.TableRows = [];
  this.addHeadItem = function (strItem) {
    this.TableHeadArray.push(strItem)
  };
  this.addRow = function (arrayRow) {
    this.TableRows.push(arrayRow)
  };
  this.setTableId = function (strId) {
    this.domTable.id = strId;
  };
  this.setTableName = function (strClassName) {
    this.domTable.className = strClassName;
  };
  this.createDataTable = function (strApplyTo) {
    
  }
}