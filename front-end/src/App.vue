<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div>
      <ul v-for="(item ,index) in sort" v-bind:key="index">
        <li>{{item.sort}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios';
import { HOST } from 'js/config';

export default {
  name: 'app',
  components: {
  },
  data() {
    return{
      sort:[],
      videoList:[],
    }
  },
  created(){
    console.log(HOST);
    axios.get(`${HOST}/sort/list`).then((res)=>{
      this.sort =  res.data.data;
    })
    axios.get(`${HOST}/video/list?sort=首页`).then((res)=>{
      this.videoList =  res.data.data;
    })
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
