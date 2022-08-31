<template>
  <div class="color-picker" v-show="isShowColorPicker">
      <Sketch :value="value" @input="onInput" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { Sketch } from 'vue-color'
@Component({
  name: "ColorPciker",
   components: {
    Sketch
  },
})
export default class ColorPciker extends Vue {
    @Prop({
      default: "#ffffff"
    }) value:any
    isShowColorPicker = false
    show() {
        this.isShowColorPicker = true
    }
    hide() {
        this.isShowColorPicker = false
    }
    onInput(color:any) {
      this.$emit('input', color)
    }
    
}
</script>

<style>
.color-picker {
  top: 36%;
  left: 50%;
  position: absolute;
}

</style>