<template>
    <div id="drawing-compare">
        <div class="draw">
            <Home />
        </div>
        <div class="draw">
            <HomeSub canvasId="mycanvas2" />
        </div>
    </div>
</template>
<script>
</script>

<script lang="ts">
import '/public/css/iconfont.css'
import Home from './Home.vue'
import HomeSub from './HomeSub.vue'
import { Component, Vue } from 'vue-property-decorator'
@Component({
    components: {
        Home,
        HomeSub
    }
})
export default class App extends Vue {}
</script>

<style>
#drawing-compare {
    width: 100%;
    height: 100%;
}
#drawing-compare .draw {
    float: left;
    position: relative;
    width: 50%;
    height: 100%;
}
</style>
