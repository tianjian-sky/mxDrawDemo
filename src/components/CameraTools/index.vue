<template>
    <div class="camera-tools">
        <div class="bg" :style="{backgroundImage: `url(${bg})`, width: width + 'px', height: height + 'px'}">
            <div ref="mask" class="mask" @mousewheel="handleMouseWheel" @mousedown.stop="handleMouseDown" :style="{left: `${mask.left}px`, top: `${mask.top}px`, width: `${mask.width}px`, height: `${mask.height}px`}"></div>
        </div>
        <div class="buttons">
            <a class="el-icon-circle-plus-outline" @click="zoomIn"></a>
            <a class="el-icon-remove-outline" @click="zoomOut"></a>
            <a class="el-icon-refresh-left" @click="rotateLeft"></a>
            <a class="el-icon-refresh-right" @click="rotateRight"></a>
        </div>
    </div>
</template>

<script>
import { MxFun } from 'mxdraw'
import ColorPciker from '@/components/ColorPciker/ColorPciker.vue'

const _getDist = function (p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2), Math.pow(p1.y - p2.y, 2))
}
const _getMid = function (p1, p2) {
    return {
        x: 0.5 * (p1.x + p2.x),
        y: 0.5 * (p1.y + p2.y)
    }
}
export default {
    name: 'AnnotationTools',
    emit: ['postMessage'],
    components: { ColorPciker },
    props: ['bg', 'viewer', 'mxfun', 'viewport'],
    data() {
        return {
            width: 200,
            height: 100,
            listenViewerChange: true,
            mask: {
                left: 0,
                top: 0,
                width: 200,
                height: 100
            },
            currentViewport: null
        }
    },
    watch: {
        currentViewport() {},
        viewport(obj) {
            if (!this.currentViewport) {
                this.currentViewport = obj
            }
        },
        viewer(viewer) {
            if (viewer) {
                // 显示范围发送变化通知事件 。
                this.viewer.addEvent('viewchange', e => {
                    // 显示范围发送变化通知事件 。
                    console.log('viewchange', e)
                    this.handleViewChange()
                })
                this.viewer.addEvent('viewsizechange', e => {
                    console.log('viewsizechange2', e)
                })
            }
        }
    },
    methods: {
        handleMouseDown(e) {
            let startX = e.clientX
            let startY = e.clientY
            this.listenViewerChange = false
            const _mm = e => {
                const curX = e.clientX
                const curY = e.clientY
                const dx = curX - startX
                const dy = curY - startY
                this.mask.left += dx
                this.mask.top += dy
                startX = curX
                startY = curY
                const p1 = this.viewer.screenCoord2World((dx / this.mask.width) * this.viewer.getViewWidth(), (dy / this.mask.height) * this.viewer.getViewHeight(), 0)
                const p2 = this.viewer.screenCoord2World(((dx + this.mask.width) / this.mask.width) * this.viewer.getViewWidth(), ((dy + this.mask.height) / this.mask.height) * this.viewer.getViewHeight(), 0)
                MxFun.getCurrentDraw().zoomW(p1, p2, true)
            }
            const _mup = e => {
                this.$refs.mask.removeEventListener('mousemove', _mm)
                this.$refs.mask.removeEventListener('mouseup', _mup)
                this.listenViewerChange = true
            }
            this.$refs.mask.addEventListener('mousemove', _mm)
            this.$refs.mask.addEventListener('mouseup', _mup)
        },
        handleMouseWheel(e) {
            const delta = e.wheelDelta
            const bound = e.target.getBoundingClientRect()
            const center = { x: e.clientX - bound.left, y: e.clientY - bound.top, z: 0 }
            const rate = delta < 0 ? 1.1 : 0.9
            const zoomCenter = {
                x: (center.x * this.viewer.getViewWidth()) / this.mask.width,
                y: (center.y * this.viewer.getViewHeight()) / this.mask.height
            }
            const v1 = {
                x: 0,
                y: 0
            }
            const v2 = {
                x: this.viewer.getViewWidth(),
                y: this.viewer.getViewHeight()
            }
            const v12 = {
                x: rate * v1.x + zoomCenter.x * (1 - rate),
                y: rate * v1.y + zoomCenter.y * (1 - rate)
            }
            const v22 = {
                x: rate * v2.x + zoomCenter.x * (1 - rate),
                y: rate * v2.y + zoomCenter.y * (1 - rate)
            }
            const p1 = this.viewer.screenCoord2World(v12.x, v12.y, 0)
            const p2 = this.viewer.screenCoord2World(v22.x, v22.y, 0)
            MxFun.getCurrentDraw().zoomW(p1, p2, true)
        },
        zoomIn() {
            this.$emit('postMessage', 'Cbim_DrawingCameraZoom', 1.1)
            this.$nextTick(() => {
                this.handleViewChange()
            })
        },
        zoomOut() {
            this.$emit('postMessage', 'Cbim_DrawingCameraZoom', 0.9)
            this.$nextTick(() => {
                this.handleViewChange()
            })
        },
        rotateLeft() {
            this.$emit('postMessage', 'Cbim_DrawingCameraRotateLeft')
        },
        rotateRight() {
            this.$emit('postMessage', 'Cbim_DrawingCameraRotateRight')
        },
        reset() {
            this.$emit('postMessage', 'Cbim_DrawingCameraReset')
            this.$nextTick(() => {
                this.handleViewChange()
            })
        },
        handleViewChange() {
            if (!this.listenViewerChange) return
            const canvasWidth = this.viewer.getViewWidth()
            const canvasHeight = this.viewer.getViewHeight()
            const ul = [0, 0]
            const br = [canvasWidth, canvasHeight]
            const p1 = this.viewer.screenCoord2World(ul[0], ul[1], 0)
            const p2 = this.viewer.screenCoord2World(br[0], br[1], 0)
            const p3 = this.viewer.screenCoord2Doc(ul[0], ul[1])
            const p4 = this.viewer.screenCoord2Doc(br[0], br[1])
            console.log('世界坐标', p1, p2)
            console.log('图纸坐标', p3, p4)
            if (this.currentViewport) {
                const p01 = { x: this.currentViewport.left, y: this.currentViewport.top }
                const p02 = { x: this.currentViewport.right, y: this.currentViewport.bottom }
                const diff = {
                    zoom: _getDist(p1, p2) / _getDist(p01, p02),
                    offset: {
                        x: _getMid(p1, p2).x - _getMid(p01, p02).x,
                        y: _getMid(p1, p2).y - _getMid(p01, p02).y
                    }
                }
                const zoomCenter = {
                    x: this.mask.left + this.mask.width / 2,
                    y: this.mask.top + this.mask.height / 2
                }
                const offset = {
                    x: (diff.offset.x * canvasWidth) / (p2.x - p1.x),
                    y: (diff.offset.y * canvasHeight) / (p2.y - p1.y)
                }
                offset.x = (offset.x * this.mask.width) / canvasWidth
                offset.y = (offset.y * this.mask.height) / canvasHeight
                zoomCenter.x += offset.x
                zoomCenter.y += offset.y
                const v1 = {
                    x: this.mask.left,
                    y: this.mask.top
                }
                const v2 = {
                    x: this.mask.left + this.mask.width,
                    y: this.mask.top + this.mask.height
                }
                const v12 = {
                    x: diff.zoom * v1.x + diff.zoom * offset.x + zoomCenter.x * (1 - diff.zoom),
                    y: diff.zoom * v1.y + diff.zoom * offset.y + zoomCenter.y * (1 - diff.zoom)
                }
                const v22 = {
                    x: diff.zoom * v2.x + diff.zoom * offset.x + zoomCenter.x * (1 - diff.zoom),
                    y: diff.zoom * v2.y + diff.zoom * offset.y + zoomCenter.y * (1 - diff.zoom)
                }
                this.mask = {
                    left: v12.x,
                    top: v12.y,
                    width: v22.x - v12.x,
                    height: v22.y - v12.y
                }
                this.currentViewport = {
                    left: p1.x,
                    top: p1.y,
                    right: p2.x,
                    bottom: p2.y
                }
            }
        }
    },
    mounted() {
        this.height = this.mask.height = (window.innerHeight * this.width) / window.innerWidth
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
