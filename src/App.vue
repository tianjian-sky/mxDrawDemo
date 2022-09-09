<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
</script>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
    components: {}
})
export default class App extends Vue {}
</script>

<style>
body {
    margin: 0;
    padding: 0;
}
</style>
