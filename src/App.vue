<template>
  <div id="app">
    <Home />
  </div>
</template>
<script>

</script>

<script lang="ts">
import "/public/css/iconfont.css"
import { Component, Vue } from "vue-property-decorator";
import Home from "./components/Home.vue";
@Component({
  components: {
    Home,
  },
})
export default class App extends Vue {

}
</script>

<style>
</style>
