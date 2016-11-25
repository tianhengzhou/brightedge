/**
 * Created by test on 11/24/16.
 */
var table;
var flag = 1;

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

function toggleCol(index) {
  var td;
  var tr = document.getElementsByTagName('tr');
  var thead = document.getElementsByTagName('thead')[0];
  var th = thead.getElementsByTagName('th');
  for (var i = 0; i < tr.length; i++){
    if (i == 0){
      if (th[index].style.display != 'none'){
        th[index].style.display = 'none';
      }else {
        th[index].style.display = 'table-cell';
      }
    }else{
      td = tr[i].getElementsByTagName('td');
      if (td[index].style.display != 'none'){
        td[index].style.display = 'none';
      }else{
        td[index].style.display = 'table-cell';
      }
    }
  }
}
function filter(event) {
  table.filter(event.target.value)
}
function sort(name, index) {
  var thead = document.getElementsByTagName('thead')[0];
  var th = thead.getElementsByTagName('th');
  for (var i = 0; i < th.length; i++){
    if (i != index){
      th[i].className = 'tableHeader';
    }
  }
  flag *= -1;
  table.sort(name, flag);
  th[index].className = flag == 1 ? 'tableHeader asc' : 'tableHeader desc'
}
