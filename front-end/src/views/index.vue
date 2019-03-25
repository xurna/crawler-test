<template>
  <div>
    <div>
      <ul class="nav" v-for="(item ,index) in sort" v-bind:key="index">
        <li class="nav-item">{{item.sort}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
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

<style lang="less">
.nav{
  width: 100%;
  display: flex;
  .nav-item{
    width: 25%;
    font-size: 14px;
    color: #333;
    text-align: center;
  }
}
</style>
