<template>
    <div class="sheet_layout_settings_window" v-show="isShow">
        <div class="sheet_layout_settings_window_header" @mousedown="onMousedown">
            <span class="sheet_layer-settings_window-header_title">图纸空间</span>
            <div class="bf-close" @click="closeBox"></div>
        </div>
        <div class="sheet_layout_settings_window_header_table_head">
            <div class="sheet_layout_settings_window_header_table_th" v-for="title in titles" :key="title.name" :class="title.className">
                {{ title.name }}
            </div>
        </div>
        <div class="sheet_layout_settings_window_header_table_main sheet_layout_settings_window_container">
            <div class="sheet_layout_settings_window_header_table_tr" v-for="item in list" :key="item.id">
                <div class="sheet_layout_settings_window_header_table_td flex_basis_50 iconfont" :class="item.off === 0 ? 'icon-xianshikejian': 'icon-yincangbukejian'" @click="onClickIsVisible(item)"></div>
                <div class="sheet_layout_settings_window_header_table_td flex_basis_50">
                    <div class="color_box" :style="'background-color: ' + item.color"></div>
                </div>
                <div class="sheet_layout_settings_window_header_table_td flex_basis_auto">{{ item.name }}</div>
                <div class="sheet_layout_settings_window_header_table_td flex_basis_50 iconfont" :class="true ? 'icon-jiesuo': 'icon-suoding'" @click="onClickState(item)"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { MxFun } from 'mxdraw'
export type LayoutItemType = {
    name: string
    id: number
}

const win: any = window

@Component({
    name: 'SheetLayoutSettingsWindow'
})
export default class SheetLayoutSettingsWindow extends Vue {
    @Prop({
        type: Boolean,
        default: false
    })
    isShow!: boolean
    @Prop({
        type: Array,
        default: () => [
            {
                name: '名称',
                type: 'name',
                className: 'flex_basis_auto'
            },
            {
                name: '状态',
                type: 'state',
                className: 'flex_basis_50'
            }
        ]
    })
    titles!: []
    @Prop({
        type: Array,
        default: () => []
    })
    list!: LayoutItemType[]
    onClickIsVisible(item: LayoutItemType) {
        // MxFun.showLayer(item.id, item.off === 0)
    }

    onClickState(item: LayoutItemType) {}
    closeBox() {
        this.$emit('close')
    }
    onMousedown(e: any) {
        // 获取该元素的transform的计算后的值
        function getStyle(el: any, attr: any) {
            if (typeof window.getComputedStyle !== 'undefined') {
                return window.getComputedStyle(el, null)[attr]
            } else if (typeof el.currentStyle !== 'undefined') {
                return el.currentStyle[attr]
            }
            return ''
        }
        // 正则解析
        const matrix3dReg = /^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/,
            matrixReg = /^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/
        /* 定义元素变量 */
        const windowClass: string = 'sheet_layout_settings_window'

        const ELEMENT: any = document.getElementsByClassName(windowClass)[0]

        // 设置class
        if (ELEMENT.className.indexOf('drag_box_translate3d') === -1) {
            ELEMENT.className += ' drag_box_translate3d'
        }

        /* 定义距离尺寸的存储池 */
        const E_SIZER: any = {}
        // 获取解析后的transform样式属性值(计算后的样式)
        const matrix3dSourceValue: any = getStyle(ELEMENT, 'transform')
        // 使用正则解析matrix
        const matrix3dArrValue: any = matrix3dSourceValue.match(matrix3dReg) || matrix3dSourceValue.match(matrixReg)
        // 记录鼠标点击时的坐标
        // console.log(ELEMENT.clientX);
        E_SIZER['clientX'] = e.clientX
        E_SIZER['clientY'] = e.clientY

        // 记录matrix解析后的translateX & translateY的值
        E_SIZER['targetX'] = matrix3dArrValue[1]

        E_SIZER['targetY'] = matrix3dArrValue[2]
        // 计算坐标边界巨鹿

        E_SIZER['distX'] = E_SIZER['clientX'] - E_SIZER['targetX']
        E_SIZER['distY'] = E_SIZER['clientY'] - E_SIZER['targetY']
        const disx = e.pageX - ELEMENT.offsetLeft
        const disy = e.pageY - ELEMENT.offsetTop
        // 鼠标移动
        const fun = function (e: any) {
            // 阻止原生和冒泡
            e.stopPropagation()
            e.preventDefault()

            // 计算元素到屏幕的距离
            let moveX = e.clientX - E_SIZER['distX']
            let moveY = e.clientY - E_SIZER['distY']
            ELEMENT.style.transform = ELEMENT.style.mozTransform = ELEMENT.style.webkitTransform = `translate3d(${moveX}px, ${moveY}px, 1px)`
        }
        // 取消事件
        document.onmousemove = fun
        document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null
        }
    }
}
</script>

<style>
.sheet_layout_settings_window {
    width: 300px;
    height: 416px;
    box-sizing: border-box;
    color: #fff;
    position: absolute;
    user-select: none;
    overflow: hidden;
    background-color: rgba(17, 17, 17, 0.88);
    z-index: 9;
    right: 100px;
    top: 45px;
    border: 1px solid #333;
}

/* 滚动容器 */
.sheet_layout_settings_window_container {
    overflow-y: auto;
    height: 300px;
}
/* 设置滚动条的样式 */
.sheet_layout_settings_window_container::-webkit-scrollbar {
    width: 8px;
}
.sheet_layout_settings_window_container::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.3);
}
/*滚动槽*/
.sheet_layout_settings_window_container::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.3);
    /*border-radius: 10px;*/
}
/* 滚动条滑块 */
.sheet_layout_settings_window_container::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.3);
}

.sheet_layout_settings_window_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: move;
    height: 40px;
    border-bottom: 1px solid #666;
    padding: 0 10px;
}
.sheet_layout_settings_window_header_title {
    font-size: 14px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: -moz-none;
    background-color: rgba(0, 0, 0, 0.88);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.sheet_layout_settings_window_header_table_head {
    display: flex;
}
.sheet_layout_settings_window_header_table_head {
    display: flex;
}
.sheet_layout_settings_window_header_table_th {
    font-size: 14px;
    padding: 5px 0;
}
.flex_basis_50 {
    flex: 0 1 50px;
}
.flex_basis_auto {
    flex: 1 1 auto;
}

.sheet_layout_settings_window_header_table_tr {
    width: 100%;
    display: flex;
    border-collapse: collapse;
    font-size: 12px;
    box-sizing: border-box;
    background-color: rgba(85, 85, 85, 0.45);
    align-items: center;
}
.sheet_layout_settings_window_header_table_td {
    display: flex;
    align-items: center;
    height: 35px;
    border: 1px solid #3f3f3f;
    padding-left: 5px;
}

.color_box {
    width: 12px;
    height: 12px;
    background-color: #fff;
    display: inline-block;
}

.drag_box_translate3d {
    position: absolute;
    transform: translate3d(0, 0, 1px);
    -moz-transform: translate3d(0, 0, 1px);
    -webkit-transform: translate3d(0, 0, 1px);
    will-change: transform;
    -moz-will-change: transform;
    -webkit-will-change: transform;
}

/* 关闭图标 */
.bf-close {
    top: 10px;
    right: 10px;
    width: 16px;
    height: 16px;
    cursor: pointer;
    z-index: 99;
}

.bf-close:after,
.bf-close:before {
    content: '';
    display: block;
    width: 16px;
    height: 1px;
    background-color: #fff;
    position: absolute;
    margin-top: 8px;
}

.bf-close:before {
    transform: rotate(45deg);
}

.bf-close:after {
    transform: rotate(-45deg);
}
</style>