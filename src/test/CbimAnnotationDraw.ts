///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序与成都梦想凯德科技有限公司成协议。通过使用本软件、其文档或相关材料
///////////////////////////////////////////////////////////////////////////////
import { DrawRectByAction } from './cbimAnnotation/BR_Rectangle'
import { DrawEclipseByAction } from './cbimAnnotation/BR_Ellipse'
import { DrawCloudLineV2ByAction } from './cbimAnnotation/BR_CloudLine2'
import { DrawArrowLineByAction } from './cbimAnnotation/BR_ArrowLine'

export class CbimAnnotationDraw {
    constructor(mxfun) {
        this.batch = false
        this.drawing = false
        this.currentDrawObj = null
        this.currentBatchDrawObj = null
        this.mxfun = mxfun
        this.init()
    }

    init() {
        this.mxfun.addCommand('Cbim_AnnotationArrow', async (args) => {
            this.drawing = true
            const obj = await DrawArrowLineByAction(args)
            this.currentDrawObj = obj
            this.drawing = false
            console.log('draw obj', obj)
        })
        this.mxfun.addCommand('Cbim_AnnotationCloud', async (args) => {
            this.drawing = true
            const obj = await DrawCloudLineV2ByAction(args)
            this.currentDrawObj = obj
            this.drawing = false
            console.log('draw obj', obj)

        })
        this.mxfun.addCommand('Cbim_AnnotationRectangle', async (args) => {
            this.drawing = true
            const obj = await DrawRectByAction(args)
            this.currentDrawObj = obj
            this.drawing = false
            console.log('draw obj', obj)
        })
        this.mxfun.addCommand('Cbim_AnnotationEclipse', async (args) => {
            this.drawing = true
            const obj = await DrawEclipseByAction(args)
            this.currentDrawObj = obj
            this.drawing = false
            console.log('draw obj', obj)
        })
        this.mxfun.addCommand('Cbim_AnnotationClose', (args) => { console.warn(args) })
        this.mxfun.addCommand('Cbim_AnnotationColorChange', (args) => { console.warn(args) })
        this.mxfun.addCommand('Cbim_AnnotationLineWidthChange', (args) => { console.warn(args) })
        this.mxfun.addCommand('Cbim_AnnotationBatchDrawChange', (args) => { console.warn(args) })
    }
}