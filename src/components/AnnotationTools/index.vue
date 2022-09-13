<template>
    <div class="annotation-tools">
        <ul>
            <li v-for="item in list" :class="{active: mode == item.id && annotationOn}" :key="item.id" @click.stop="changeType(item)">{{item.name}}</li>
        </ul>
        <div class="color-trigger" :style="{background: color}" @click="toggleColor"></div>
        <ColorPciker :isShowColorPicker="isShowColorPicker" v-model="color" ref="colorPciker" @input="updateColor" />
        <el-slider :step="1" v-model="lineWidth" height="100px" :max="5" :min="1" :vertical="true" @change="updateLineWidth"></el-slider>
        <el-checkbox style="margin-top:16px;" v-model="batch" @change="handleBachDrawChange">批量绘制</el-checkbox>
        <div v-if="batch">
            <el-button @click.stop="confirmBatch">确认</el-button>
        </div>
    </div>
</template>

<script>
import ColorPciker from '@/components/ColorPciker/ColorPciker.vue'

export default {
    name: 'AnnotationTools',
    emit: ['postMessage'],
    components: { ColorPciker },
    data() {
        return {
            annotationOn: false,
            mode: '',
            annotations: [],
            color: '#ff0000',
            list: [
                { id: 1, name: '箭头', cmd: 'Cbim_AnnotationArrow' },
                { id: 2, name: '云线', cmd: 'Cbim_AnnotationCloudV1' },
                { id: 3, name: '云线2', cmd: 'Cbim_AnnotationCloudV2' },
                { id: 4, name: '矩形', cmd: 'Cbim_AnnotationRectangle' },
                { id: 5, name: '椭圆', cmd: 'Cbim_AnnotationEclipse' },
                { id: 6, name: '批注保存为JSON', cmd: 'Cbim_AnnotationSaveJSON', noStatus: true },
                { id: 7, name: '批注JSON还原', cmd: 'Cbim_AnnotationJsonDraw', noStatus: true }
            ],
            lineWidth: 1,
            isShowColorPicker: false,
            batch: false
        }
    },
    watch: {
        mode(val) {
            if (val) {
                this.$emit('postMessage', this.list.find(item => item.id === val).cmd, {
                    color: this.color,
                    lineWidth: this.lineWidth,
                    batch: this.batch
                })
            } else {
                this.$emit('postMessage', 'Cbim_AnnotationClose')
            }
        }
    },
    methods: {
        changeType(item) {
            const type = item.id
            if (item.noStatus) {
                this.mode = ''
                this.$emit('postMessage', this.list.find(item => item.id === type).cmd, {
                    color: this.color,
                    lineWidth: this.lineWidth,
                    batch: this.batch
                })
                return
            }
            if (this.mode === type) {
                this.annotationOn = false
                this.mode = ''
            } else {
                this.mode = type
                this.annotationOn = true
            }
        },
        confirmBatch() {
            this.batch = false
            this.annotationOn = false
            this.$emit('postMessage', 'Cbim_AnnotationBatchDrawComplete', this.batch)
        },
        handleBachDrawChange() {
            this.$emit('postMessage', 'Cbim_AnnotationBatchDrawChange', this.batch)
        },
        toggleColor() {
            this.$refs['colorPciker'].isShowColorPicker = !this.$refs['colorPciker'].isShowColorPicker
            if (this.$refs['colorPciker'].isShowColorPicker) {
                this.$refs['colorPciker'].show()
            } else {
                this.$refs['colorPciker'].hide()
            }
        },
        updateColor(val) {
            this.color = val.hex
            this.$emit('postMessage', 'Cbim_AnnotationColorChange', this.color)
        },
        updateLineWidth() {
            this.$emit('postMessage', 'Cbim_AnnotationLineWidthChange', this.lineWidth)
        }
    }
}
</script>

<style>
.annotation-tools {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 100px;
    top: 40px;
    color: #fff;
    align-items: center;
}
.annotation-tools li {
    cursor: pointer;
    list-style-type: none;
}
.annotation-tools .color-trigger {
    margin: 8px 0;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    cursor: pointer;
}
.annotation-tools li.active {
    color: yellow;
}
.annotation-tools .el-slider {
    margin: 0 0 8px 0;
}
.annotation-tools .color-picker {
    right: 200px;
    left: auto;
}
</style>
