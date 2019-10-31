<template>
  <div class="vue-table" :class="{'is-blur': !loadedShow}">
    <div class="input-sarch" :class="{ 'events-none': !loaded }">
      <input type="text" placeholder="Поиск" :value="filterLine" @input="handleSearch">
    </div>
    <div class="loading" v-if="!loaded">Is loading</div>
    <div class="table-view" v-if="loadedShow">
      <div class="fields">
        <div 
          :class="[ 'table-col', 'table-col-cursor', titleStyle !== null ? titleStyle : '' ]"
          v-for="(name, index) in curFields"
          :key="index"
          @click="sortClick(index)"
        >{{ name }}</div>
        <div :class="[ 'table-col', 'table-col-cursor', titleStyle !== null ? titleStyle : '', { 'events-none': !loaded } ]">Actions</div>
      </div>
      <template v-if="curData.length > 0">
        <div
          v-for="(row, indexRow) in pageData"
          :key="indexRow"
          :class="['table-row', (indexRow & 1) ? (evenStyle !== null ? evenStyle : '') : (oddStyle !== null ? oddStyle : '')]"

        >
            <div 
              class="full-rect"
              :class="{ 'events-none': !loaded }"
              v-for="(field, keyField) in row.value"
              :key="keyField"
              @dblclick="fieldInput($event, indexRow, keyField)"
            >
              <template v-if="isInput && indexRow === curIndexRow && keyField === curIndexField">
                <input 
                  type="text"
                  :value="field"
                  @input="inputField($event, indexRow, keyField)"
                  @blur="isInput = false"
                  @keydown="keyDown"
                  class="input-style-edit"
                  :id="`${ indexTable }-${ indexRow }-${ keyField }`"
                >
              </template>
              <template v-else>
                <div class="table-field">{{ field }}
                </div>
              </template>
          </div>
          <div class="full-rect" :class="{ 'events-none': !loaded }">
            <div class="table-field">
              <action-buttons
                @remove="removeLine(indexRow)"
                @add="addLine(indexRow, $event)"
              ></action-buttons>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <button class="add-first-string" @click="addFirstString">Добавить первую строку</button>
      </template>
    </div>
    <div class="bottom-table" :class="{ 'events-none': !loaded }">
      <div class="button-block">
        <button @click="$emit('remove')">Удалить таблицу</button>
        <button @click="handleRemoveData">Очистить таблицу</button>
        <button @click="handleGetData">Получить данные</button>
      </div>
      <div class="page-numbers">
        <button 
          v-for="(n, i) in getButtonsNames"
          :class="[
            'number-page',
            { 'active-page': n === nPage }
          ]"
          :key="i"
          @click="nextPage(n)"
        >{{ n + 1 }}</button>
      </div>
    </div>
    <div 
      :class="[
        'modal',
        { 'modal-active': modalActive }
      ]">
      <div class="block-modal" :class="{ 'events-none': !loaded }">
        <button class="bb btn-copy-buf" @click="copyBuffer">Скопировать в буффер</button>
        <button class="bb btn-paste-buf" @click="pasteBuffer">Заполнить из буффера</button>
        <button class="bb btn-export" @click="exportTable">Экспортировать</button>
        <button class="bb btn-cancel" @click="modalActive = false">Закрыть</button>
      </div>
    </div>
    <!-- <div class="modal-load" v-if="loaded"></div> -->
  </div>
</template>

<script>

import ActionButtons from "../../elements/ActionButtons.vue";

export default {
  name: "VueTable",
  componentName: "VueTable",
  components: {
    ActionButtons
  },
  props: {
    value: {
      type: Array,
      default: null
    },
    fields: {
      type: Array,
      default: null
    },
    rows: {
      type: Number,
      default: null
    },
    meta: {
      type: Object,
      default: null
    },
    indexTable: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      titleStyle: null,
      oddStyle: null,
      evenStyle: null,
      curFields: [],
      // link: 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}',
      link: 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}',
      search: '',
      curData: [],
      allData: [],
      loaded: false,
      loadedShow: false,
      nPage: 0,
      haveNames: false,
      haveValue: false,
      elementsPage: this.rows > 0 ? this.rows : 10,
      modalActive: false,
      isInput: false,
      curIndexRow: null,
      curIndexField: null,
      lastEditValue: null,
      curSortElement: null,
      sortDirection: false,
      counter: 0,
      filterLine: '',
      sortFlag: true,
      filterFlag: true
    };
  },
  computed: {
    pageData() {
      let N = this.curData.length;
      if (N > 0) {
        if (this.elementsPage * (this.nPage + 1) <= N) {
          return this.curData.slice(this.nPage * this.elementsPage, this.elementsPage * (this.nPage + 1));
        }
        return this.curData.slice(this.nPage * this.elementsPage)
      }
      return [];
    },
    getButtonsNames() {
      let cPages = Math.floor(this.curData.length / this.elementsPage);
      if (this.curData.length / this.elementsPage > 1) {
        if (cPages < this.curData.length / this.elementsPage) {
          cPages += 1;
        }
      } else {
        cPages = 0;
      }
      let array = new Array(cPages);

      let N = array.length;
      for (let i = 0; i < N; i++) {
        array[i] = i;
      }
      if (N > 0) {
        let min = Math.max(this.nPage - 5, 0),
            max = this.nPage + 5 <= N ? this.nPage + 5 : N;
        return array.slice(min, max);
      }
      return [];
    }
  },
  created() {
    if (this.meta !== null) {
      this.titleStyle = this.meta.hasOwnProperty('titleStyle') ? this.meta.titleStyle : null;
      this.oddStyle = this.meta.hasOwnProperty('oddStyle') ? this.meta.oddStyle : null;
      this.evenStyle = this.meta.hasOwnProperty('evenStyle') ? this.meta.evenStyle : null;
    }

    if (this.fields !== null) {
      this.curFields = this.fields;
      if (this.curFields.length > 0) {
        this.haveNames = true;
        this.haveValue = true;
        this.curSortElement = this.curFields[0];
      }
      this.allData = [];
      this.curData = [];
      this.$emit('change', {
        value: this.allData,
        fields: this.curFields,
        rows: this.rows,
        meta: this.meta
      });
      this.loadedShow = true;
      this.loaded = true; 
    } else {
      this.getData();
    }

  },
  methods: {
    filterData(data) {
      let v = JSON.parse(JSON.stringify((this.filterFlag ? data : this.curData)));
      // let v = data;
      
      let noSearch = !this.filterFlag || this.filterLine === '';
      if (!noSearch) {
        let str = this.filterLine.split(' ').join('').toLowerCase();
        v = v.filter((o) => (Object.values(o.value).some((el) => (el.toString().toLowerCase().indexOf(str) > -1))));
      }
      if (this.sortFlag) {
        const f = (a, b) => {
          if (a['value'][this.curSortElement] < b['value'][this.curSortElement]) return -1;
          if (a['value'][this.curSortElement] > b['value'][this.curSortElement]) return 1;
          return 0;
        }

        if (this.sortDirection) v.sort(f).reverse();
        else v.sort(f);
        this.allData = v;
      }
      return JSON.parse(JSON.stringify(v));
    },
    sortClick(index) {
      if (this.loaded) {
        console.log("CLICK");
        this.sortFlag = true;

        this.filterFlag = true;
        let field = this.curFields[index];

        if (field === this.curSortElement) {
          this.sortDirection = !this.sortDirection;
        } else {
          this.sortDirection = false;
        }

        this.curSortElement = field;
        this.curData = this.filterData(this.allData);
      }
    },
    keyDown(event) {
      if (event.keyCode === 13) {   // enter
        this.$emit('change', {
          value: this.allData,
          fields: this.curFields,
          rows: this.rows,
          meta: this.meta
        });
        event.preventDefault();
        this.isInput = false;
        this.sortFlag = true;
        this.filterFlag = true;
      } else if (event.keyCode === 27) {  //esp
        this.sortFlag = true;
        this.filterFlag = true;
        if (this.curIndexRow !== null && this.curIndexFields !== null && this.lastEditValue !== null) {
          
          let findIndex = this.allData.findIndex((a) => {
            return a.lineID === this.curData[this.curIndexRow + this.elementsPage * this.nPage].lineID
          });
          this.allData[findIndex]['value'][this.curIndexField] = this.lastEditValue;
          this.curData[this.curIndexRow + this.elementsPage * this.nPage]['value'][this.curIndexField] = this.lastEditValue;
          // this.curData[this.curIndexRow + this.elementsPage * this.nPage][this.curIndexField] = this.lastEditValue;
          this.lastEditValue = null;
          this.curIndexRow = null;
          this.curIndexField = null;
        }
        this.$emit('change', {
          value: this.curData,
          fields: this.curFields,
          rows: this.rows,
          meta: this.meta
        });
        this.isInput = false;
        event.preventDefault();
      }
    },
    inputField(event, index, key) {
      this.sortFlag = false;
      this.filterFlag = false;
      let findIndex = this.allData.findIndex((a) => {
        return a.lineID === this.curData[index + this.elementsPage * this.nPage].lineID
      });
      this.allData[findIndex]['value'][key] = event.target.value;
      this.curData[index + this.elementsPage * this.nPage]['value'][key] = event.target.value;
      this.$emit('change', {
        value: this.allData,
        fields: this.curFields,
        rows: this.rows,
        meta: this.meta
      });
    },
    fieldInput(event, index, key) {
      if (this.loaded) {
        this.sortFlag = false;
        this.filterFlag = false;
        this.isInput = true;
        console.log(event, index, key);
        this.curIndexRow = index;
        this.curIndexField = key;

        let findIndex = this.allData.findIndex((a) => {
          return a.lineID === this.curData[index + this.elementsPage * this.nPage].lineID
        });

        this.lastEditValue = this.allData[findIndex]['value'][key];
        // this.curData = this.filterData(this.allData);
        setTimeout(() => {
          let id = `${ this.indexTable }-${ index }-${ key }`;
          document.getElementById(id).focus();
        }, 100)
      }
    },
    pasteBuffer(event) {
      if (this.loaded) {
        navigator.clipboard.readText().then(text => {
          let j = JSON.parse(text);
          this.loaded = false;
          this.false = true;
          this.haveNames = false;
          this.haveValue = false;
          this.allData = [];
          let value = [];
          if (Object.prototype.toString.call(j) === '[object Array]' && j.length > 0) {
            this.curFields = this.getNames(j[0]);
            if (this.curFields.length > 0) {
              this.haveNames = true;
              this.haveValue = true;
              this.curSortElement = this.curFields[0];
            }
            for (let i = 0; i < j.length; i++) {
              let obj = this.marshData(j[i]);
              this.counter++;
              value.push({ lineID: this.counter, value: obj });
            }
          }
          this.allData = value;
          this.curData = this.filterData(this.allData);
          this.$emit('change', {
            value: this.allData,
            fields: this.curFields,
            rows: this.rows,
            meta: this.meta
          });
          this.true = true;
          this.loaded = true; 
          alert("success paste");
        }).catch(err => {
          console.log('Something went wrong', err);
        });
      }
    },
    copyBuffer(event) {
      if (this.loaded) {
        let array = [];
        for (let i = 0; i < this.allData.length; i++) {
          array.push(this.unmarshData(this.allData[i].value));
        }
        navigator.clipboard.writeText(JSON.stringify(array)).then(() => {
          alert("success copy");
        }).catch(err => {
          alert("can't copy");
        });
      }
    },
    exportTable(event) {
      if (this.loaded) {
        let array = [];
        for (let i = 0; i < this.allData.length; i++) {
          array.push(this.unmarshData(this.allData[i].value));
        }

        let text = JSON.stringify(array, null, "\t");
        let data = new Blob([text], { type : 'application/json' });
        let target = document.createElement("a");
        let url = window.URL.createObjectURL(data);
        target.setAttribute("href", url)
        target.setAttribute("download", "table-data.json");
        target.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);
      }
    },
    removeLine(index) {
      this.sortFlag = false;
      this.filterFlag = false;
      let findIndex = this.allData.findIndex((a) => {
        return a.lineID === this.curData[index + this.elementsPage * this.nPage].lineID
      });
      if (this.pageData.length === 1 && this.nPage !== 0) {
        this.nPage--;
      };
      this.allData.splice(findIndex, 1);
      this.curData.splice(index + this.elementsPage * this.nPage, 1);
      // this.curData = this.filterData(this.allData);
      this.$emit('change', {
        value: this.allData,
        fields: this.curFields,
        rows: this.rows,
        meta: this.meta
      });
    },
    addLine(index, flag) {
      this.sortFlag = false;
      this.filterFlag = false;
      let newElement = this.curFields.reduce((prev, cur) => {
        prev[cur] = '';
        return prev;
      }, {});

      let findIndex = this.allData.findIndex((a) => {
        return a.lineID === this.curData[index + this.elementsPage * this.nPage].lineID;
      });
      let i = flag > 0 ? findIndex + 1 : findIndex;
      console.log(i);
      this.counter++;
      this.allData.splice(i, 0, { "lineID": this.counter, value: newElement });
      this.curData.splice((flag > 0 ? index + 1 : index) + this.elementsPage * this.nPage, 0, { "lineID": this.counter, value: newElement });
      // this.curData = this.filterData(this.allData);
      this.$emit('change', {
        value: this.allData,
        fields: this.curFields,
        rows: this.rows,
        meta: this.meta
      });
    },
    addFirstString(event) {
      this.sortFlag = false;
      this.filterFlag = false;
      let newElement = this.curFields.reduce((prev, cur) => {
        prev[cur] = '';
        return prev;
      }, {})
      this.counter++;
      this.allData.push({ lineID: this.counter, value: newElement });
      this.curData.push({ lineID: this.counter, value: newElement });
      // this.curData = this.filterData(this.allData);
      this.$emit('change', {
        value: this.allData,
        fields: this.curFields,
        rows: this.rows,
        meta: this.meta
      });
    },
    handleSearch(event) {
      this.sortFlag = false;
      this.filterFlag = true;
      console.log(event.target.value);
      this.filterLine = event.target.value;
      this.nPage = 0;
      this.curData = this.filterData(this.allData);
    },
    handleRemoveData(event) {
      this.allData = [];
      this.curData = [];
      this.nPage = 0;
      this.$emit('change', {
        value: this.allData,
        fields: this.curFields,
        rows: this.rows,
        meta: this.meta
      });
    },
    handleGetData(event) {
      this.modalActive = true;
    },
    nextPage(index) {
      this.nPage = index;
    },
    getNames(obj) {
      let names = [];
      for (let key in obj) {
        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
          let namesObject = this.getNames(obj[key]);
          for (let i = 0; i < namesObject.length; i++) {
            names.push(`${ key }.${ namesObject[i] }`);
          }
        } else {
          names.push(key);
        }
      }
      return names;
    },
    marshData(data) {
      let obj = {};
      for (let key in data) {
        if (Object.prototype.toString.call(data[key]) === '[object Object]') {
          let recObj = this.marshData(data[key])
          for (let keyZ in recObj) {
            obj[`${ key }.${ keyZ }`] = recObj[keyZ];
          }
        } else {
          obj[key] = data[key];
        }
      }
      return obj;
    },
    unmarshData(data) {
      let obj = {};
      for (let key in data) {
        let keys = key.split('.');
        if (keys.length === 1) {
          obj[key] = data[key];
        } else {
          let curObj = obj;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!curObj.hasOwnProperty(keys[i])) {
              curObj[keys[i]] = {};
            }
            curObj = curObj[keys[i]];
          }
          curObj[keys[keys.length - 1]] = data[key];
        }
      }
      return obj;
    },
    getData() {
      this.loaded = false;
      this.loadedShow = false;
      let url = `https://cors-anywhere.herokuapp.com/${ this.link}`;
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.overrideMimeType("application/json");
      let self = this;
      let c = 0;
      let l = 1;
      xhr.onload = (event) => {
        let r = event.target.responseText;
        let z = [];
        let array = JSON.parse(r);
        for (let i = 0; i < array.length; i++) {
          let obj = this.marshData(array[i]);
          this.counter += i;
          z.push({ lineID: this.counter, value: obj});
        }
        this.allData = z;
        this.curData = this.filterData(z);
        this.loaded = true;
        this.$emit('change', {
          value: this.allData,
          fields: this.curFields,
          rows: this.rows,
          meta: this.meta
        });
      }
      xhr.onprogress = (event) => {
        let r = event.target.responseText;
        let g = 0;
        let z = 0;
        for (let i = l; i < r.length; i++) {
          if (r[i] === '{') g++;
          else if (r[i] === '}') {
            g--;
            if (g === 0) {
              c++;
              z = i;
            }
          }
        }
        let str = r.slice(l, z + 1);
        let array = JSON.parse(`[${ str }]`);
        if (array.length > 0) {
          if(this.curFields.length === 0) {
            this.curFields = this.getNames(array[0]);
            this.haveNames = true;
            this.curSortElement = this.curFields[0];
          }

          for (let i = 0; i < array.length; i++) {
            let obj = this.marshData(array[i]);
            this.counter += i;
            this.allData.push({ lineID: this.counter, value: obj});
          }
          this.curData = this.allData;
          this.loadedShow = true;
        }
        l = z + 2;
      }
      xhr.send();
    }
  }
}
</script>

<style>
.vue-table {
  width: calc(100% - 40px);
  margin: 40px 20px 20px 20px;
  min-height: 200px;
  overflow: hidden;
  position: relative;
}

.input-sarch {
  width: 120px;
  height: 20px;
  display: flex;

}

.input-sarch input {
  width: 100%;
  height: 20px;
  outline: none;
  color: black;
  padding-left: 5px;
  padding-right: 5px;
  border: 1px solid grey;
  position: relative;
  box-sizing: border-box;
  flex: 1;
  display: inline-block;
}

.vue-table .table-view {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  margin-top: 10px;
  min-height: 100px;
}

.table-view .fields, .table-view .table-row {
  display: flex;
  width: 100%;
}
.vue-table .table-col {
  min-width: 120px;
  text-align: center;
  border-top: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  overflow: hidden;
  flex: 1;
  padding: 20px 5px;
  box-sizing: border-box;
}
.table-col-cursor {
  cursor: pointer;
}
.vue-table .table-col:first-child,
.vue-table .full-rect:first-child {
  border-left: 1px solid black;
}


.vue-table .table-row {
  min-height: 200px;
}

.vue-table .full-rect {
  flex: 1;
  display: flex;
  border-top: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  min-width: 120px;
  box-sizing: border-box;
  overflow: hidden;
}

.vue-table .table-field {
  flex: 1;
  padding: 10px;
  align-self: center;
  justify-self: center;
  text-align: center;
  word-break: break-word;
}

.table-field .action-button {
  display: inline-block;
  font-size: 30px;
  font-weight: 900;
}

.button-block {
  flex: 1;
}
.button-block button {
  display: inline-block;
  margin-right: 5px;
  margin-top: 10px;
}

.vue-table .bottom-table {
  display: flex;
}

.vue-table .page-numbers {
  /* flex: 1; */
  /* max-width: 200px; */
  overflow: hidden;
  white-space: nowrap;
  padding-top: 12px;
}

.page-numbers .number-page {
  border-radius: 0 !important;
  height: 20px !important;
  padding-left: 5px !important;
  padding-right: 5px !important;
}

.page-numbers .active-page {
  background-color: rgb(220, 220, 238) !important;
}
.add-first-string {
  width: 100% !important;
  height: 60px !important;
  background-color: white !important;
  border-radius: 0 !important;
  font-size: 15px;
}
.add-first-string:hover {
  background-color: rgb(236, 232, 232) !important;;
}

.vue-table .modal {
  display: none;
}

.vue-table .modal.modal-active {
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, .7);
  z-index: 1;
  justify-content: center;
  align-items: center;
}

.modal.modal-active .block-modal {
  width: 400px;
  height: 200px;
  background-color: white;
  position: relative;
}
.btn-copy-buf {
  margin-left: 10px;
  margin-top: 20px;
}
.btn-paste-buf {
  margin-right: 10px;
  margin-top: 20px;
  float: right;
}
.btn-export {
  margin-top: 40px;
  margin-left: 133px;
}

.bb  {
  height: 40px !important;
  border-radius: 0 !important;
}

.bb:hover {
  background-color:rgb(237, 237, 250) !important;
}

.btn-cancel {
  position: absolute;
  bottom: 20px;
  right: 20px;

  border-radius: 20px !important;
}

.input-style-edit {
  text-align: center;
  margin-left: 20px;
  margin-right: 20px;
  width: calc(100% - 40px);
  outline: none;
  border: none;
  font-size: 16px;
}

.loading {
  margin-left: 20px;
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  filter: blur(0px) !important;
  animation: loading 1s ease-in-out infinite;
}

@keyframes loading {
  from {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
  end {
    opacity: 1;
  }
}

.loading-modal {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  
}
.is-blur .input-sarch, .is-blur .table-view,
.is-blur .bottom-table {
  filter: blur(2px);
  pointer-events: none;
}
.events-none {
  pointer-events: none !important;
}
</style>
