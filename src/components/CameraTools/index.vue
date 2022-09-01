<template>
    <div class="camera-tools">
        <div class="bg" :style="{backgroundImage: `url(${bg})`, width: width + 'px', height: height + 'px'}">
            <div ref="mask" class="mask" @mousedown.stop="handleMouseDown" :style="{left: `${vp.left}px`, top: `${vp.top}px`, width: `${vp.width}px`, height: `${vp.height}px`}"></div>
        </div>
        <div class="buttons">
            <a @click="zoomIn">+</a>
            <a @click="zoomOut">-</a>
            <a @click="rotateLeft">向左旋转</a>
            <a @click="rotateRight">向右旋转</a>
            <a @click="reset">重置</a>
        </div>
    </div>
</template>

<script>
import ColorPciker from '@/components/ColorPciker/ColorPciker.vue'

export default {
    name: 'AnnotationTools',
    emit: ['postMessage'],
    components: { ColorPciker },
    props: ['bg', 'viewport'],
    data() {
        return {
            width: 200,
            height: 100,
            vp: {
                left: 0,
                top: 0,
                width: 200,
                height: 100
            }
        }
    },
    methods: {
        init() {},
        handleMouseDown(e) {
            let startX = e.clientX
            let startY = e.clientY
            const _mm = e => {
                const curX = e.clientX
                const curY = e.clientY
                this.vp.left += curX - startX
                this.vp.top += curY - startY
                startX = curX
                startY = curY
            }
            const _mup = e => {
                this.$refs.mask.removeEventListener('mousemove', _mm)
                this.$refs.mask.removeEventListener('mouseup', _mup)
            }
            this.$refs.mask.addEventListener('mousemove', _mm)
            this.$refs.mask.addEventListener('mouseup', _mup)
        },
        zoomIn() {
            this.$emit('postMessage', 'Cbim_DrawingCameraZoom', 1.1)
        },
        zoomOut() {
            this.$emit('postMessage', 'Cbim_DrawingCameraZoom', 0.9)
        },
        rotateLeft() {
            this.$emit('postMessage', 'Cbim_DrawingCameraRotateLeft')
        },
        rotateRight() {
            this.$emit('postMessage', 'Cbim_DrawingCameraRotateRight')
        },
        reset() {
            this.$emit('postMessage', 'Cbim_DrawingCameraReset')
        }
    },
    mounted() {
        this.height = this.vp.height = (window.innerHeight * this.width) / window.innerWidth
    }
}
</script>

<style>
.camera-tools {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #fff;
}
.camera-tools .bg {
    position: relative;
    background-size: 100% 100%;
    overflow: hidden;
}
.camera-tools .buttons {
    display: flex;
    margin: 0 auto;
    width: 50%;
    justify-content: space-between;
}
.camera-tools .buttons a {
    cursor: pointer;
}
.camera-tools .mask {
    position: absolute;
    background: #ddd;
    opacity: 0.2;
    cursor: move;
}
</style>
