/**
 * Created by test on 11/24/16.
 */
var table;
var thead = document.getElementsByTagName('thead')[0];
var th = thead.getElementsByTagName('th');
var flag = 1;
var valArr = ['firstName', 'lastName'];

function showCircle(str) {
  if (str == '' || str == null){
    return;
  }
  var xhttp = new XMLHttpRequest();
  var tableData;
  var tbody = document.getElementsByTagName('tbody')[0];
  var pagination = document.getElementById('pagination');
  if (tbody){
    tbody.parentNode.removeChild(tbody);
    pagination.parentNode.removeChild(pagination)
  }

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200){
      tableData = JSON.parse(this.responseText);
      if (tableData.length <= 100){
        localStorage.setItem('dataObject', this.responseText);
        table = tabled.create(document.getElementsByTagName('table')[0], {
          data: JSON.parse(localStorage.getItem('dataObject'))});
      }else{
        table = tabled.create(document.getElementsByTagName('table')[0], {
          data: tableData})
      }
    }
  };
  xhttp.open("GET", str, true);
  xhttp.send();

}


function filter(event) {
  table.filter(event.target.value)
}
function sort(name, index) {
  for (var i = 0; i < th.length; i++){
    if (i != index){
      th[i].className = 'tableHeader';
    }
  }
  flag *= -1;
  table.sort(name, flag);
  th[index].className = flag == 1 ? 'tableHeader asc' : 'tableHeader desc'
}
