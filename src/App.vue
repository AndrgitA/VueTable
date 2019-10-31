<template>
  <div id="app">
    <button @click="addTable">{{ buttonName }}</button>
    <vue-table
      v-for="(options, index) in tables"
      :key="options.indexTable"
      v-bind="options"
      @remove="handleRemove(index)"
      @change="updateTable(index, $event)"
    ></vue-table>
  </div>
</template>

<script>
import VueTable from "./components/VueTable/src/VueTable.vue";

export default {
  name: 'app',
  components: {
    VueTable
  },
  data() {
    return {
      buttonName: "Добавить таблицу",
      tables: [],
      tableCounter: 0
    }
  },
  methods: {
    addTable(event) {
      this.tables.push({ 
        indexTable: this.tableCounter,  
        // meta: {
        //   titleStyle: 'title-field-test',
        //   oddStyle: 'line-table-odd',
        //   evenStyle: 'line-table-even'
        // },
        // fields: ['i', 'you', 'we'],
        // rows: 3
      })
      this.tableCounter++;
    },
    updateTable(index, obj) {
      this.tables[index].fields = obj.fields;
      this.tables[index].rows = obj.rows;
      this.tables[index].value = obj.value;
      this.tables[index].meta = obj.meta;
    },
    handleRemove(index) {
      this.tables.splice(index, 1);
    }
  }
}
</script>

<style>
html{
  width: 100vw;
  height: 100vh;
  position: relative;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
body {
  width: 100vw;
  height: 100vh;
  position: relative;
  margin: 0;
  padding: 10px;
  box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

#app button {
  background-color: white;
  color: black;
  outline: none;
  border: 1px solid black;
  border-radius: 10px;
  height: 25px;
  padding-left: 15px;
  padding-right: 15px;
  cursor: pointer;
}

.title-field-test {
  background-color: green;
}

.line-table-odd {
  background-color: red;
}

.line-table-even {
  background-color: blue;
}
</style>
