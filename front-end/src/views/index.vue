<template>
  <div>
    <div :class="['header', moreActive? 'more-active' :'']">
      <nav class="top-bar">
        <div
          class="nav-item"
          v-for="(item ,index) in sort"
          v-bind:key="index"
          @click="getTabContent(item.sort)"
        >{{item.sort}}</div>
      </nav>
      <div class="more" @click="more">...</div>
    </div>
    <div class="content">
      <ul>
        <li class="video-item" v-for="(item ,index) in videoList" v-bind:key="index">
          <a :href="item.url">
            <img :src="item.img.replace('.webp','')" alt="img" v-if="item.img">
            <p>{{item.title}}</p>
          </a>
        </li>
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
    return {
      sort: [],
      videoList: [],
      moreActive: false,
      active:'',
    }
  },
  created() {
    console.log(HOST);
    axios.get(`${HOST}/sort/list`).then((res) => {
      this.active = res.data.data[0].sort
      this.sort = res.data.data;
      this.getTabContent(res.data.data[0].sort)
    })

  },
  methods: {
    getTabContent(sort) {
      axios.get(`${HOST}/video/list?sort=${sort}`).then((res) => {
        this.videoList = res.data.data;
      })
    },
    more() {
      this.moreActive = !this.moreActive
    },
  }
}
</script>

<style lang="less">
.header {
  width: 100%;
  height: 44px;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  .more{
    text-align: center;
    width:15%;
    height: 44px;
    line-height: 36px;
    font-size: 18px;
    color: #666;
    font-weight: bold;
    background: #f7f7f7;
  }
}
.more-active{
  height: auto;
  // overflow: none;
  background: #f7f7f7;
}
nav {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 85%;
  // height: 44px;
  background: #f7f7f7;
  position: relative;
  .nav-item {
    display: inline-block;
    font-size: 18px;
    line-height: 44px;
    height: 46px;
    width: 20%;
    text-align: center;
    color: #666;
    margin: 0 5px 0 7px;
  }
  .nav-item.active {
    position: relative;
    color: #222;
    font-weight: 700;
    z-index: 2;
  }
  .nav-item.active::after {
    content: "";
    position: absolute;
    width: 30px;
    height: 5px;
    background: #fed441;
    bottom: 13px;
    left: 11px;
    z-index: -1;
  }
}
.content{
  padding: 44px 10px 0;
  ul{
    clear: both;
    overflow: hidden;
    li.video-item{
      width: 50%;
      float: left;
      height: 154px;
      a{
        img{
          display: block;
          width: 95%;
          height: 100px;
          object-fit: cover;
          margin: 0 auto;
          box-shadow: 0 0 1px #dbdbdb;
        }
        p{
          color: #363636;
          font-size: 14px;
          margin-top: 10px;
          line-height: 18px;
          height: 36px;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
