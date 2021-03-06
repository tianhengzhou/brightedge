(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.tabled = factory();
  }
}(this, function () {
  var noElementFoundError =
        new Error("No element found. Please specify an element to convert.");

  var unspecifiedHeaderError =
        new Error("Please specify headers by providing " +
          "a <thead></thead> tag.");

  var camelize = function(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
  };

  var Table = function(element, opts) {
    if (!element) throw noElementFoundError;

    this.element = element;

    var thead = element.getElementsByTagName("thead")[0];
    if (!thead) throw unspecifiedHeaderError;
    var theadRow = thead.getElementsByTagName("tr")[0];

    opts = opts || {};
    this.headers = opts.headers || [];
    this.pageSize = opts.pageSize || 10;
    this.currentPage = opts.defaultPage || 1;
    this.showPagination = opts.showPagination !== false;

    var __data = opts.data || [];
    var __filtered = null;
    var self = this;

    if (theadRow && !opts.headers) {
      var ths = theadRow.getElementsByTagName("th");
      for(var i = 0; i < ths.length; i++) {
        this.headers.push(camelize(ths[i].innerText));
      }
    }

    Object.defineProperty(this, 'data', {
      get: function() {
        return __filtered || __data;
      },
      set: function(val) {
        __data = val;
        self.draw();
      }
    });

    Object.defineProperty(this, 'availablePages', {
      get: function() {
        return Math.ceil(self.data.length / self.pageSize)
      }
    });

    Object.defineProperty(this, 'subset', {
      get: function() {
        return self.data
          .slice((self.currentPage - 1) * self.pageSize, self.data.length);
      }
    });

    this.filter = function(val) {
      var filtered = [];

      if (!!val) {
        for (var i = 0; i < __data.length; i++) {
          var match = false;
          for(var prop in __data[i]) {
            if (!__data[i].hasOwnProperty(prop)) continue;
            var value = __data[i][prop];
            var regex = new RegExp(val, "i");
            if (regex.test(value)) match = true;
          }
          if (match) filtered.push(__data[i]);
        }
      } else {
        filtered = __data;
      }

      __filtered = filtered;
      self.draw();
    };

    this.sort = function (key, order) {
      if (key){
        __data.sort(function (a, b) {
          a = a[key];
          b = b[key];
          if (typeof(a) === 'string' && typeof(b) === 'string'){
            var count = 0;
            while(a.charCodeAt(count) === b.charCodeAt(count) &&
            (count < a.length && count < b.length)){
              count += 1;
            }
            if (count == a.length - 1){
              return true;
            }else{
              return order === 1 ? a.charCodeAt(count) > b.charCodeAt(count) :
                a.charCodeAt(count) < b.charCodeAt(count);
            }
          }else{
            return order === 1? a > b : a < b;
          }
        })
      }
      self.draw();
    };
    var tbody = element.getElementsByTagName("tbody")[0];

    if (tbody) {
      var tr = tbody.getElementsByTagName("tr");
      var items = [];

      for (var i = 0; i < tr.length; i++) {
        var item = {};
        var td = tr[i].getElementsByTagName("td");
        for (var j = 0; j < td.length; j++){
          var headerProp = this.headers[j];
          if (!headerProp) continue;
          item[headerProp] = td[j].innerText;
        }
        items.push(item);
      }
      console.log(items);
      this.data = items;
    } else {
      tbody = document.createElement("tbody");
      element.appendChild(tbody);
    }

    this.draw();
  };

  Table.prototype.draw = function() {
    var tbody = this.element.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    var shownCount = this.pageSize < this.subset.length
      ? this.pageSize
      : this.subset.length;

    for(var i = 0; i < shownCount; i++){
      var tr = document.createElement("tr");
      if ((i+1) % 2 == 0){
        tr.className = 'even'
      }else{
        tr.className = 'odd'
      }
      var row = [];

      for(var j = 0; j < this.headers.length; j++) {
        if (this.subset[i][this.headers[j]])
          row.push(this.subset[i][this.headers[j]]);
        else row.push("");
      }

      for(var j = 0; j < row.length; j++) {
        var td = document.createElement("td");
        td.innerHTML = row[j];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    if (!this.paginationElement)
      this.paginationElement = document.createElement("div");
    this.paginationElement.id = "pagination";

    if (this.element.nextSibling.id !== "pagination")
      this.element.parentNode.insertBefore(
        this.paginationElement,
        this.element.nextSibling
      );

    this.paginationElement.innerHTML = '';

    var self = this;

    var firstLink = document.createElement("button");
    firstLink.className = 'paginate_button';
    firstLink.innerHTML = "First";
    firstLink.onclick = function() {
      self.page(1);
    };
    var previousLink = document.createElement("button");
    previousLink.innerHTML = "Previous";
    if (self.currentPage === 1){
      previousLink.disabled = true;
      previousLink.className = 'paginate_button disable'
    }else {
      previousLink.className = 'paginate_button';
    }
    previousLink.onclick = function() {
      self.page(self.currentPage - 1);
    };

    this.paginationElement.appendChild(firstLink);
    this.paginationElement.appendChild(previousLink);

    for(var i = 0; i < (this.availablePages || 1); i++) (function(x) {
      var link = document.createElement("button");
      if (x+1 === self.currentPage){
        link.className = 'paginate_button current';
      }else{
        link.className = 'paginate_button';
      }
      link.innerHTML = x + 1;
      link.onclick = function () {
        self.page(x + 1);
      };

      self.paginationElement.appendChild(link);
    })(i);

    var nextLink = document.createElement("button");
    nextLink.innerHTML = "Next";
    if (self.currentPage === self.availablePages){
      nextLink.disabled = true;
      nextLink.className = 'paginate_button disable'
    }
    else{
      nextLink.className = 'paginate_button'
    }
    nextLink.onclick = function() {
      self.page(self.currentPage + 1);
    };
    var lastLink = document.createElement("button");
    lastLink.className = 'paginate_button';
    lastLink.innerHTML = "Last";
    lastLink.onclick = function() {
      self.page(self.availablePages);
    };

    this.paginationElement.appendChild(nextLink);
    this.paginationElement.appendChild(lastLink);

    if (!this.showPagination) this.paginationElement.style.display = "none";
  };

  Table.prototype.page = function(pagenum) {
    this.currentPage = pagenum || 1;
    this.draw();
  };

  tabled = {
    create: function(element, opts) {
      return new Table(element, opts);
    },
    __unspecifiedHeaderError: unspecifiedHeaderError,
    __noElementFoundError: noElementFoundError
  };

  if (typeof window !== 'undefined') window.tabled = tabled;

  return tabled;
}));