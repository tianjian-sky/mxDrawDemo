<template>
    <div class="content" :style="{cursor}">
        <div id="mxdiv">
            <el-select v-model="fileUrl" style="position:absolute;right:10px;top:10px;" @change="loadFile">
                <el-option v-for="item in FILES" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <!-- <TestMenu :data="list" @change="onClick" ref="testMenu">
                <template slot="top">
                    <h1 class="menu-title">
                        <img :src="logoImgUrl" alt="MxCad" /> 网页制图
                    </h1>
                </template>
            </TestMenu> -->
            <!-- <div class="layer_btn_box" @click="layerBtnClikc">
                <div class="iconfont icon-layers layer_btn"></div>
            </div> -->
            <div class="sidebar-menu">
                <div class="menu-item" v-for="(item, index) in sidebarMenuData" :key="index" @click="layerBtnClikc(item)">
                    <img class="item-img" v-if="item.icon.indexOf('/') >= 0" :src="item.icon" />
                    <span v-else class="iconfont item-icon" :class="item.icon"></span>
                    <span class="menu-item-name">{{ item.name }}</span>
                </div>
            </div>
            <SheetLayerSettingsWindow :list="sheetLayerSettingsData" :isShow="isShowLayerBox" @close="
          () => {
            isShowLayerBox = false;
          }
        " />
            <SheetLayoutSettingsWindow :viewer="viewer" :list="sheetLayoutSettingsData" :isShow="isShowLayoutBox" :currentSpace="currentSpace" @close="() => {
            isShowLayoutBox = false;
          }" @changeLayout=" (layout)=> handleChangeLayout(layout)" />
            <ColorPciker v-model=" color" ref="colorPciker" @input="updateColor" />
            <div id="myChart"></div>
            <CoordinatePrompt />
            <ObjectActionBar :isShow="isShowObjectActionbar" />
            <canvas :id="canvasId" @mousedown="canvasMouseDown" @mousemove="canvasMouseMove" @mouseup="canvasMouseUp" @click="canvasClick" @dblclick="canvasDblclick"></canvas>
            <Annotation-tools v-if="isShowAnnotationTools" :annotationMode="annotationMode" :batchAnnotation="batchAnnotation" @update:mode="val => annotationMode = val" @update:batch="val => batchAnnotation = val" @postMessage="handleAnnotationMessagePost"></Annotation-tools>
            <Camera-tools ref="minimap" :bg="bgImg" :viewer="viewer" :viewport="vp" @postMessage="handleAnnotationMessagePost"></Camera-tools>
            <Measure-Tools v-if="isShowMeasureTools" @postMessage="handleAnnotationMessagePost"></Measure-Tools>
            <div class="bottom-bar">
                <ul>
                    <li v-for="item in menus" class="" @click="item.onClick">
                        <el-tooltip :content="item.name">
                            <a class="" :class="item.icon" style="color:orangered;"></a>
                        </el-tooltip>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 修改文字弹框 -->
        <el-dialog title="修改文字内容" :visible.sync="isShowTextDialog" :before-close="handleCloseTextDialog">
            <el-input v-model="inputText"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCloseTextDialog">取 消</el-button>
                <el-button type="primary" @click="textDialogConfirm">确 定</el-button>
            </span>
        </el-dialog>

    </div>

</template>
<script lang="ts">
import '../iconfontMx.css'
import { Component, Vue, Prop } from 'vue-property-decorator'
import configs from '@/config'
import { MxFun, MxDbLine, MxDbLeadComment } from 'mxdraw'
import { RegistMxCommands, RxInitMxEntity } from '@/test/command'
import SheetLayerSettingsWindow, { LayerItemType } from '@/components/SheetLayerSettingsWindow/SheetLayerSettingsWindow.vue'
import SheetLayoutSettingsWindow, { LayoutItemType } from '@/components/SheetLayoutSettingsWindow/SheetLayoutSettingsWindow.vue'
import TestMenu, { MenuItemType } from '@/components/TestMenu/TestMenu.vue'
import ColorPciker from '@/components/ColorPciker/ColorPciker.vue'
import { layout as layoutIcon, layer as layerIcon } from '@/assets/img/menuIcon'
import store from '@/store'
import { setSenceColor } from '@/test/systems/setSenceColor'
import CoordinatePrompt from '@/components/CoordinatePrompt/CoordinatePrompt.vue'
import ObjectActionBar from '@/components/ObjectActionBar/ObjectActionBar.vue'
import AnnotationTools from '@/components/AnnotationTools'
import MeasureTools from '@/components/MeasureTools'
import CameraTools from '@/components/CameraTools'
import { CbimMxDbArrowLine } from '@/test/cbimAnnotation/BR_ArrowLine'
import { CbimMxDbCloudLine } from '@/test/cbimAnnotation/BR_CloudLine'
import { CbimMxDbEclipse } from '@/test/cbimAnnotation/BR_Ellipse'
import { CbimMxDbRect } from '@/test/cbimAnnotation/BR_Rectangle'
import { Vector2, Raycaster, Box3, FontLoader } from 'three'

const win: any = window
@Component({
    components: {
        SheetLayerSettingsWindow,
        SheetLayoutSettingsWindow,
        TestMenu,
        ColorPciker,
        CoordinatePrompt,
        AnnotationTools,
        CameraTools,
        MeasureTools,
        ObjectActionBar
    }
})
export default class Home extends Vue {
    @Prop({
        type: String,
        default: 'myCanvas'
    })
    canvasId!: String;
    [x: string]: any
    logoImgUrl = require('@/assets/img/logo.png')
    FILES = [/* '/demo/buf/image.jpeg', '/demo/buf/image2.png', */ '/demo/buf/fjdy.dwg', '/demo/buf/a.dwg', '/demo/buf/b.dwg', '/demo/buf/c.dwg', '/demo/buf/hhhh.dwg', '/demo/buf/test2.dwg', '/demo/buf/dxf1.dxf', '/demo/buf/dxf2.dxf', '/demo/buf/dxf3.dxf', '/demo/buf/dxf4.dxf', '/demo/buf/dxf5.dxf']
    LAYOUTS = {
        '/demo/buf/image.jpeg': ['Model'],
        '/demo/buf/image2.png': ['Model'],
        '/demo/buf/fjdy.dwg': ['Model', 'Layout1', 'Layout2'],
        '/demo/buf/a.dwg': ['Model', 'Layout1', 'Layout2'],
        '/demo/buf/b.dwg': ['Model', 'Layout1', 'Layout2'],
        '/demo/buf/c.dwg': ['Model', 'Layout1', 'Layout2'],
        '/demo/buf/hhhh.dwg': ['Model', 'Layout1', 'Layout2'],
        '/demo/buf/test2.dwg': ['Model', 'Layout1'],
        '/demo/buf/dxf1.dxf': ['Model', 'Layout1', 'Layout2'],
        '/demo/buf/dxf2.dxf': ['Model', 'Layout1', 'Layout2'],
        '/demo/buf/dxf3.dxf': ['Model', 'Layout1', 'Layout2'],
        '/demo/buf/dxf4.dxf': ['Model', 'Layout1', 'Layout2'],
        '/demo/buf/dxf5.dxf': ['Model', 'Layout1', 'Layout2']
    }
    color = '#ffffff'
    isShowObjectActionbar = false
    inputText = ''
    bgImg = ''
    vp = null
    viewer = null
    isShowTextDialog = false
    isShowLayerBox = false
    isShowLayoutBox = false
    isShowAnnotationTools = false
    isShowMeasureTools = false
    isShowColor = false
    cursor = 'default'
    // 当前选择的自定义对象
    currentEnt: any = null
    currentSpace = 'Model'
    fileUrl = '/demo/buf/fjdy.dwg'
    annotationMode = ''
    batchAnnotation = false
    currentDrawing = null
    sidebarMenuData = [
        {
            icon: layerIcon,
            name: '图层',
            cmd: 'layer'
        },
        {
            icon: layoutIcon,
            name: '布局',
            cmd: 'layout'
        }
    ]
    public menus: any = []
    public list: any = [
        {
            name: '测量',
            cmd: '',
            icon: '',
            children: [
                {
                    name: '长度测量',
                    cmd: 'BR_DimensionMeasurement',
                    icon: 'icon-changdu'
                },

                {
                    name: '面积测量',
                    cmd: 'BR_Area',
                    icon: 'icon-area2'
                },

                {
                    name: '坐标测量',
                    cmd: 'BR_Coord',
                    icon: 'icon-shitucezuobiao'
                },
                {
                    name: '测量角度',
                    cmd: 'BR_AngleSurveying',
                    icon: 'icon-jiaodu'
                },
                {
                    name: '绘制圆弧|| 测量弧长',
                    cmd: 'BR_Arc',
                    icon: 'icon-caozuojiemiantubiao---_sandianhuayuanhu'
                }
            ]
        },
        {
            name: '点标记',
            cdm: '',
            icon: '',
            children: [
                {
                    name: '引线标记',
                    cmd: 'BR_LeadTag',
                    icon: ''
                }
            ]
        },
        {
            name: '批注',
            cmd: '',
            icon: '',
            children: [
                {
                    name: '绘制任意线',
                    cmd: 'BR_AnyLine',
                    icon: 'icon-ziyouquxian'
                },
                {
                    name: '画线',
                    cmd: 'BR_Line',
                    icon: 'icon-huaxian-copy'
                },
                {
                    name: '样条曲线',
                    cmd: 'BR_SplineCurve',
                    icon: 'icon-quxian'
                },
                {
                    name: '绘制云线',
                    cmd: 'BR_CloudLine',
                    icon: 'icon-yun'
                },
                {
                    name: '引线标注',
                    cmd: 'BR_Comment',
                    icon: 'icon-yinxian'
                },
                {
                    name: '审图',
                    cmd: 'BR_CheckDraw',
                    icon: 'icon-weibiaoti-'
                },
                {
                    name: '绘制矩形',
                    cmd: 'Mx_DrawRect',
                    icon: 'icon-juxing'
                },
                {
                    name: '绘制圆',
                    cmd: 'BR_Circle',
                    icon: 'icon-yuan1'
                },
                {
                    name: '绘制椭圆',
                    cmd: 'BR_Ellipse',
                    icon: 'icon-tuoyuan'
                },
                {
                    name: '绘制文字',
                    cmd: 'BR_Text',
                    icon: 'icon-wenzi'
                },

                //  {
                //     name: "箭头批注",
                //     cmd: "BR_Arrow",
                //     icon: "icon-jiantou_youxia_o",
                // },
                {
                    name: '绘制多边形',
                    cmd: 'BR_ThreeRegularPolygon',
                    icon: 'icon-duobianxing'
                }
            ]
        },
        {
            name: '全图',
            cmd: 'BR_ZooomInitialStates',
            icon: 'icon-quantu'
        },

        {
            name: '窗口缩放',
            cmd: 'BR_ZoomW',
            icon: 'icon-suofang'
        },

        {
            name: '打印',
            cmd: 'BR_Print',
            icon: 'icon-icon-'
        },

        {
            name: '全屏显示',
            cmd: 'BR_FullScreen',
            icon: 'icon-quantu',
            changeCallback(item: MenuItemType) {
                const isFullScreen = item.cmd === 'BR_QuitFullScreen'
                item.cmd = isFullScreen ? 'BR_FullScreen' : 'BR_QuitFullScreen'
                item.name = isFullScreen ? '退出全屏' : '全屏显示'
                item.icon = isFullScreen ? 'icon-tuichuquanping' : 'icon-quantu'
            }
        },
        {
            name: '设置背景',
            icon: 'icon-huanbeijing',
            changeCallback: () => {
                const colorPciker = this.$refs.colorPciker as ColorPciker
                colorPciker.show()
            }
        },

        {
            name: '打开test2.dwg',
            icon: '',
            cmd: 'BR_OpenFile'
        },

        {
            name: '测试',
            icon: '',
            cmd: 'BR_Test'
        },

        {
            name: 'demo1',
            cmd: '',
            icon: 'icon-202yonghu_yonghu3',
            children: [
                {
                    name: '闪烁特效',
                    cmd: 'BR_Twinkle',
                    icon: 'icon-shanshuo'
                },
                {
                    name: '两点之间移动效果',
                    cmd: 'BR_MoveEff',
                    icon: 'icon-liangdianyidong'
                },
                {
                    name: 'echarts表格绘制',
                    cmd: 'BR_Echarts',
                    icon: 'icon-pie-chart-sharp'
                },

                {
                    name: '模型大小固定位置不固定',
                    cmd: 'BR_ModelFixed',
                    icon: 'icon-gudingdaxiao'
                }
            ]
        },
        {
            name: 'demo2',
            cmd: '',
            icon: 'icon-202yonghu_yonghu3',
            children: [
                {
                    name: '绘制标记点',
                    cmd: 'Mx_DrawTag',
                    icon: 'icon-MBEfenggeduosetubiao-biaoji'
                },

                {
                    name: '距离测量',
                    cmd: 'BR_DimensionMeasurement',
                    icon: 'icon-changdu'
                },

                {
                    name: '删除标记点',
                    cmd: 'Mx_DeleteTag',
                    icon: 'icon-shanchu'
                },
                {
                    name: '删除A2点',
                    cmd: 'Mx_DeleteTag_A2',
                    icon: 'icon-shanchu'
                },
                {
                    name: '插入图片',
                    cmd: 'Mx_DrawImage',
                    icon: 'icon-charutupian'
                },
                {
                    name: '绘制固定位置图片',
                    cmd: 'Mx_DrawFixImage',
                    icon: 'icon-guding'
                },
                {
                    name: '固定图片转非固定',
                    cmd: 'Mx_FixImageToNoFix',
                    icon: ''
                },

                {
                    name: '非固定图片转固定',
                    cmd: 'Mx_NoFixImageToFix',
                    icon: ''
                },

                {
                    name: '保存当前视区范围',
                    cmd: 'BR_SaveViewport',
                    icon: 'icon-baocun'
                },

                {
                    name: '恢复保存的视区范围',
                    cmd: 'BR_RestoreViewport',
                    icon: 'icon-shujubeifenhuifu'
                },

                {
                    name: '输出到显示到Image',
                    cmd: 'BR_WriteImage',
                    icon: ''
                },

                {
                    name: '禁用视区的缩放',
                    cmd: 'BR_DisabledZoom',
                    icon: ''
                },

                {
                    name: '禁用视区的移动',
                    cmd: 'BR_DisabledPan',
                    icon: ''
                },

                {
                    name: '保存当前图上数据',
                    cmd: 'Mx_SaveAllMxEntity',
                    icon: ''
                },

                {
                    name: '恢复图上数据',
                    cmd: 'Mx_LoadAllMxEntity',
                    icon: ''
                }
            ]
        }
    ]
    currentItemIndex = -1
    sheetLayerSettingsData: Array<LayerItemType> = []
    sheetLayoutSettingsData: Array<LayoutItemType> = []

    mounted() {
        //MxFun.setMxServer("ws://localhost:5090");
        MxFun.setIniset({
            // 启用对象选择功能.
            EnableIntelliSelect: true,
            IntelliSelectType: 1,
            multipleSelect: false
        })

        /*
        let aryStaticFile= ["./demo/buf/$hhhh.dwg.mxb1.wgh",
            "./demo/buf/$hhhh.dwg.mxb2.wgh",
            "./demo/buf/$hhhh.dwg.mxb3.wgh",
            "./demo/buf/$hhhh.dwg.mxb4.wgh",
            "./demo/buf/$hhhh.dwg.mxb5.wgh",
            "./demo/buf/$hhhh.dwg.mxb6.wgh",
            "./demo/buf/$hhhh.dwg.mxb7.wgh",
            "./demo/buf/$hhhh.dwg.mxb8.wgh",
            "./demo/buf/$hhhh.dwg.mxb9.wgh"
            ];
            */

        const myThis = this

        // 创建MxCAD对像.
        MxFun.createMxObject({
            canvasId: this.canvasId,
            //cadFile: "http://localhost:8088/demo/buf/hhhh.dwg",
            //cadFile: "/demo/buf/$hhhh.dwg.mxb1.wgh",
            // cadFile: '/demo/buf/hhhh.dwg',
            cadFile: configs.dwgFolder + this.fileUrl,
            //cadFile: "/demo/buf/aaa.dwg",
            //cadFile: aryStaticFile,
            isMxCAD: false,
            useWebsocket: false,
            callback: (mxDrawObject, { canvas, canvasParent }) => {
                this.viewer = mxDrawObject
                this.sheetLayoutSettingsData = this.LAYOUTS[this.fileUrl]
                canvasParent.className = 'mxdiv'
                // mxDrawObject.initRunMode(2)
                // 用于屏幕截图，启用three.js 绘图缓冲,不用截图，可以禁用该功能。
                mxDrawObject.initRendererParam({ preserveDrawingBuffer: true, alpha: true })

                //设计鼠标中键移动视区.
                mxDrawObject.setMouseMiddlePan(false)

                // 添加图层数据更新显示.
                mxDrawObject.addEvent('uiSetLayerData', (listLayer: Array<LayerItemType>) => {
                    myThis.sheetLayerSettingsData = listLayer
                })

                //MxFun.showLayer(idLayer, isShow, false);

                mxDrawObject.addEvent('viewsizechange', e => {
                    console.log('viewsizechange', e)
                })
                mxDrawObject.addEvent('MxEntitySelectChange', e => {
                    console.log('MxEntitySelectChange', e)
                })

                mxDrawObject.addEvent('loadComplete', e => {
                    console.log('mx loadComplete', e)
                    const canvas = mxDrawObject.getCanvas()
                    this.bgImg = canvas.toDataURL('image/png', 1)
                    canvas.toBlob(b => {
                        this.bgImg = URL.createObjectURL(b)
                    })
                    console.log('canv', canvas, mxDrawObject)
                    const ul = [0, 0]
                    const br = [mxDrawObject.getViewWidth(), mxDrawObject.getViewHeight()]
                    const p1 = mxDrawObject.screenCoord2World(ul[0], ul[1], 0)
                    const p2 = mxDrawObject.screenCoord2World(br[0], br[1], 0)
                    this.vp = {
                        left: p1.x,
                        top: p1.y,
                        right: p2.x,
                        bottom: p2.y
                    }
                })

                // 对象被选择的通知事件 。
                mxDrawObject.addEvent('MxEntitySelectChange', (aryId: Array<number>) => {
                    console.log('MxEntitySelectChange', aryId)
                    if (aryId.length > 0) {
                        this.isShowObjectActionbar = true
                    } else {
                        this.isShowObjectActionbar = false
                    }
                })
                this.initMenus()
                this.initEvent()
                const fontLoader = new FontLoader()
                fontLoader.load(
                    configs.dwgFolder + '/song.json',
                    font => {
                        window.mxFontData = font
                    },
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                    },
                    function (err) {
                        console.log('An error happened', err)
                    }
                )
            }
        })
        MxFun.listenForCommandLineInput(({ msCmdTip, msCmdDisplay, msCmdText }) => {
            store.commit('setMsCmdTip', msCmdTip)
        })
        MxFun.listenForCoordTip(tipCoord => {
            store.commit('setTipCoord', tipCoord)
        })
        // 注册命令.
        RegistMxCommands()

        // 注册自定实体.
        RxInitMxEntity()
    }

    loadFile(fileUrl) {
        this.viewer.makeCurrent()
        this.currentSpace = 'Model'
        MxFun.openFile(configs.dwgFolder + fileUrl)
        this.$refs.minimap.changeDrawing()
    }

    // 关闭文字弹框
    handleCloseTextDialog() {
        this.isShowTextDialog = false
    }
    // 显示文字弹框
    showTextDialog(text: string) {
        this.inputText = text
        this.isShowTextDialog = true
    }
    // 文字弹框确定按钮
    textDialogConfirm() {
        this.handleCloseTextDialog()
        if (this.currentEnt) {
            this.currentEnt.text = this.inputText
            this.currentEnt.setNeedUpdateDisplay()
            MxFun.updateDisplay()
        }
    }

    // 鼠标移入canvas画布事件
    canvasMouseover() {
        const testMenu = this.$refs.testMenu as TestMenu
        testMenu.closeSubmenu()
        testMenu.closeActive()
    }
    // canvas画布点击事件
    canvasClick(event: any) {
        const colorPciker = this.$refs.colorPciker as ColorPciker
        colorPciker.hide()
    }

    // canvas 鼠标双击事件
    canvasDblclick() {
        const mxObj = MxFun.getCurrentDraw()
        const aryId = mxObj.getMxCurrentSelect()
        this.currentEnt = mxObj.getMxEntity(aryId[0]) as any
        if (this.currentEnt && this.currentEnt.text) {
            this.showTextDialog(this.currentEnt.text)
        }
    }
    handleAnnotationMessagePost(cmd, val) {
        this.viewer.makeCurrent()
        MxFun.sendStringToExecute(cmd, val)
    }
    updateColor(color: any) {
        this.viewer.makeCurrent()
        const scene = MxFun.getCurrentDraw().getScene()
        setSenceColor(scene, color.hex)
        MxFun.updateDisplay()
    }
    // 点击事件
    public onClick(item: MenuItemType, event: Event, index: number) {
        this.viewer.makeCurrent()
        if (item.cmd) {
            MxFun.sendStringToExecute(item.cmd)
        }
    }

    layerBtnClikc(item: any) {
        this.viewer.makeCurrent()
        switch (item.cmd) {
            case 'layer':
                this.isShowLayerBox = !this.isShowLayerBox
                break
            case 'layout':
                this.isShowLayoutBox = !this.isShowLayoutBox
                break
        }
    }
    // 显示对象操作栏
    showObjectActionbar() {
        this.isShowObjectActionbar = true
    }
    handleChangeLayout(layout: String) {
        let fileUrl = this.fileUrl.replace(/\./, function () {
            if (layout === 'Model') return '.'
            else return `#${layout}#.`
        })
        if (layout != 'Model' && fileUrl.match(/\.dxf$/)) {
            fileUrl = fileUrl.replace(/\.dxf$/, '.dwg')
        }
        this.currentSpace = layout
        MxFun.openFile(configs.dwgFolder + fileUrl)
        this.$refs.minimap.changeDrawing()
    }
    initMenus() {
        this.menus = [
            {
                name: '视图重置',
                icon: 'el-icon-s-home',
                onClick: () => {
                    this.viewer.makeCurrent()
                    this.viewer.zoomInitialStates()
                    setTimeout(() => {
                        this.viewer.updateDisplay()
                    }, 100)
                }
            },
            {
                name: '批注',
                icon: 'el-icon-edit',
                onClick: () => {
                    this.viewer.makeCurrent()
                    this.isShowAnnotationTools = !this.isShowAnnotationTools
                }
            },
            {
                name: '测量',
                icon: 'el-icon-odometer',
                onClick: () => {
                    this.viewer.makeCurrent()
                    this.isShowMeasureTools = !this.isShowMeasureTools
                }
            },
            {
                name: '设置背景',
                icon: 'el-icon-picture',
                onClick: () => {
                    this.viewer.makeCurrent()
                    const colorPciker = this.$refs.colorPciker as ColorPciker
                    this.isShowColor = !this.isShowColor
                    if (this.isShowColor) {
                        colorPciker.show()
                    } else {
                        colorPciker.hide()
                    }
                }
            },
            {
                name: '清除批注',
                icon: 'el-icon-delete',
                onClick: () => {
                    this.viewer.makeCurrent()
                    this.viewer.getAllMxEntity().forEach(obj => {
                        // this.viewer.eraseMxEntity(obj.MxDbEntityImp.id)
                        this.viewer.eraseAllMxEntity()
                        this.viewer.updateDisplay()
                    })
                }
            },
            {
                name: '导出dwg',
                icon: 'el-icon-download',
                onClick: () => {
                    this.saveDrawing()
                }
            }
        ]
    }
    initEvent() {
        this.$el.addEventListener('mousemove', event => {
            this.viewer.makeCurrent()
            const intersects = this.getIntersectAnnotation(event.offsetX, event.offsetY)
            this.cursor = intersects.length ? 'pointer' : 'default'
        })
        this.$el.addEventListener('click', event => {
            this.viewer.makeCurrent()
            const _getAnnotationObj = part => {
                while (part) {
                    if (part?.userData?.type && part?.userData?.type?.indexOf('cbim_annotation') === 0) {
                        return part
                    } else {
                        part = part.parent
                    }
                }
                return null
            }
            const intersects = this.getIntersectAnnotation(event.offsetX, event.offsetY)
            this.cursor = intersects.length ? 'pointer' : 'default'
            let target
            for (const obj of intersects) {
                target = _getAnnotationObj(obj.object)
                if (target) break
            }
            if (target) {
                const box = new Box3()
                box.setFromObject(target)
                const center = this.viewer.worldCoord2Doc2(box.getCenter())
                MxFun.getCurrentDraw().zoomCenter(center.x, center.y)
            }
        })
    }
    getIntersectAnnotation(mouseX, mouseY) {
        const db = MxFun.getCurrentDraw().getMxDatabase()
        const layerId = db._mxDatabase.curLayer
        const layerMap = db._mxDatabase.mapNameToLayer
        let layer = null
        layerMap.forEach((val, key) => {
            if (val.name === layerId) {
                layer = val.group
            }
        })
        let intersects = []
        const rc = new Raycaster()
        const pointer = new Vector2()
        const camera = MxFun.getCurrentDraw().getCamera()
        pointer.x = (mouseX / MxFun.getCurrentDraw().getViewWidth()) * 2 - 1
        pointer.y = -(mouseY / MxFun.getCurrentDraw().getViewHeight()) * 2 + 1
        if (layer) {
            rc.setFromCamera(pointer, camera)
            intersects = rc.intersectObjects([layer], true)
        }
        return intersects
    }
    async saveDrawing() {
        let mxobj = MxFun.getCurrentDraw()
        let line = new MxDbLine()
        const p1 = mxobj.screenCoord2Doc(150 + Math.random() * 300, 150 + Math.random() * 300)
        const p2 = mxobj.screenCoord2Doc(300 + Math.random() * 300, 300 + Math.random() * 300)
        line.pt1 = p1
        line.pt2 = p2
        line.setColor(0xff0000)
        line.setDashLineDisplay(true)
        line.setLineWidth(2)
        line.setLineWidthByPixels(true)

        let leadComment = new MxDbLeadComment()
        leadComment.point1 = { x: p1.x + MxFun.screenCoordLong2Doc(20), y: p1.y, z: 0 }
        leadComment.point2 = { x: p2.x + MxFun.screenCoordLong2Doc(20), y: p2.y, z: 0 }
        // leadComment.setColor(0x00ff00)
        leadComment.textHeight = MxFun.screenCoordLong2Doc(20)
        leadComment.text = '测试Test'
        // MxFun.addToCurrentSpace(line)
        MxFun.addToCurrentSpace(leadComment)
        mxobj.updateDisplay()
        let sSaveData: any = mxobj.saveMxEntityToObject()
        sSaveData.saveFile = 'export.dwg'
        const req = await fetch(`${configs.serverUrl}/savedwgCbim`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: sSaveData,
                originalFile: this.fileUrl.replace('/demo/buf/', '')
            })
        })
        const resp = await req.json()
        const sSaveUrl = 'http://10.81.3.40:3000/demo/' + sSaveData.saveFile
        // 后台程序TsWebNodejs\routes\savedwg.js，它会调用MxFileConvert.exe使用MxDrawNode\src\mxconvert\SaveCommentToDwg.ts把批注数据，保存到demo目录下的hhhhnew.dwg文件中.
        window.open(sSaveUrl)
    }
    canvasMouseDown(e) {
        console.log('md', e)
        const pt = this.viewer.screenCoord2Doc(e.offsetX, e.offsetY)
        console.log('pt', pt)
        const _addDraw = pt => {
            if (this.annotationMode == 1) {
                this.viewer.enablePan(false)
                this.currentDrawing = new CbimMxDbArrowLine({
                    annotationId: 'cbim-annotation-temp',
                    color: '#ff0000',
                    lineWidth: 1,
                    pointList: [pt, pt]
                })
                this.currentDrawing.draw()
            }
            if (this.annotationMode == 2) {
                this.viewer.enablePan(false)
                this.currentDrawing = new CbimMxDbCloudLine({
                    annotationId: 'cbim-annotation-temp',
                    color: '#ff0000',
                    lineWidth: 1,
                    pointList: [pt, pt]
                })
                this.currentDrawing.draw()
            }
            if (this.annotationMode == 4) {
                this.viewer.enablePan(false)
                this.currentDrawing = new CbimMxDbRect({
                    annotationId: 'cbim-annotation-temp',
                    color: '#ff0000',
                    lineWidth: 1,
                    pointList: [pt, pt]
                })
                this.currentDrawing.draw()
            }
            if (this.annotationMode == 5) {
                this.viewer.enablePan(false)
                this.currentDrawing = new CbimMxDbEclipse({
                    annotationId: 'cbim-annotation-temp',
                    color: '#ff0000',
                    lineWidth: 1,
                    pointList: [pt, pt]
                })
                this.currentDrawing.draw()
            }
            console.log(this.currentDrawing)
        }
        if (this.annotationMode) {
            if (this.batchAnnotation) {
                if (!this.currentDrawing) {
                    _addDraw(pt)
                } else {
                    this.currentDrawing.pointList.push(pt, pt)
                }
            } else {
                _addDraw(pt)
            }
        }
    }
    timer = null
    canvasMouseMove(e) {
        const pt = this.viewer.screenCoord2Doc(e.offsetX, e.offsetY)
        if (this.annotationMode && this.currentDrawing) {
            const pts = this.currentDrawing.pointList
            pts[pts.length - 1] = pt
            this.viewer.eraseMxEntity(this.currentDrawing.entId)
            this.viewer.updateDisplay()
            if (this.annotationMode == 1) {
                this.currentDrawing = new CbimMxDbArrowLine({
                    annotationId: 'cbim-annotation-temp',
                    color: '#ff0000',
                    lineWidth: 1,
                    pointList: pts
                })
            }
            if (this.annotationMode == 2) {
                this.currentDrawing = new CbimMxDbCloudLine({
                    annotationId: 'cbim-annotation-temp',
                    color: '#ff0000',
                    lineWidth: 1,
                    pointList: pts
                })
            }
            if (this.annotationMode == 4) {
                this.currentDrawing = new CbimMxDbRect({
                    annotationId: 'cbim-annotation-temp',
                    color: '#ff0000',
                    lineWidth: 1,
                    pointList: pts
                })
            }
            if (this.annotationMode == 5) {
                this.currentDrawing = new CbimMxDbEclipse({
                    annotationId: 'cbim-annotation-temp',
                    color: '#ff0000',
                    lineWidth: 1,
                    pointList: pts
                })
            }
            this.currentDrawing.draw()
            this.viewer.updateDisplay()
        }
    }
    canvasMouseUp(e) {
        if (this.annotationMode) {
            if (this.batchAnnotation) {
                console.log(123)
            } else {
                this.viewer.enablePan(true)
                this.currentDrawing = null
            }
        }
        console.log(this.viewer.getScene())
    }
}
</script>
<style>
html,
body,
#app {
    height: 100%;
    overflow: hidden;
    background-color: #ccc;
}
</style>
<style scoped>
html::-webkit-scrollbar {
    width: 0 !important;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
}
.children-li {
    margin-top: 0;
    border: 0;
    border-bottom: 1px solid #ccc;
}
.content {
    height: 100%;
    display: flex;
    justify-content: center;
}
#myChart {
    /* width: 500px;
    height: 300px; */
    color: #ffffff;
    position: absolute;
}

#myCanvas {
    width: 100%;
}
.mxdiv {
    width: 100%;
    position: relative;
    padding-top: 0;
    height: 100%;
}

.menu-title {
    color: #00a99e;
    font-size: 22px;
    font-weight: 500;
    display: flex;
    justify-content: center;
}
.menu-title img {
    margin-right: 8px;
}

.sidebar-menu {
    position: absolute;
    right: 0;
    background-color: #333333;
    display: flex;
    flex-direction: column;
    color: #fff;
    padding: 10px 0;
    top: 50%;
    transform: translate(0, -50%);
}
.menu-item {
    width: 100%;
    height: 100%;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    padding: 14px;
}
.menu-item-name {
    width: 20px;
    margin: 0 auto;
    line-height: 24px;
    font-size: 20px;
    margin-top: 4px;
}

/* ul,
li {
  list-style-type: none;
  padding: 0;
} */
/* li {
  background-image: linear-gradient(#e7f4fc, #c9e8fa);
  width: 100%;
  line-height: 30px;
  border: 1px #a5b6d2 solid;
  color: #000;
  margin-top: 10px;
  text-align: center;
  cursor: pointer;
} */

.layer_btn_box {
    position: absolute;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #333;
    cursor: pointer;
    vertical-align: top;
    top: 45px;
    right: 40px;
}

.layer_btn {
    font-size: 32px;
    background-color: #9f9f9f;
}
.layer_btn_box:hover .layer_btn {
    background-color: #fff;
}
.bottom-bar {
    position: absolute;
    left: 20px;
    bottom: 10px;
}
.bottom-bar ul {
    display: flex;
    list-style-type: none;
}
.bottom-bar li {
    margin-right: 10px;
    width: 32px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    background: #fff;
    border-radius: 4px;
    text-align: center;
}

.bottom-bar li.active {
    color: orangered;
}
</style>
