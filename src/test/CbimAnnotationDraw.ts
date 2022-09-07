///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序与成都梦想凯德科技有限公司成协议。通过使用本软件、其文档或相关材料
///////////////////////////////////////////////////////////////////////////////
import { DrawRectByAction, DrawRectByObj } from './cbimAnnotation/BR_Rectangle'
import { DrawEclipseByAction, DrawEclipseByObj } from './cbimAnnotation/BR_Ellipse'
import { DrawCloudLineV2ByAction, DrawCloudLineV2ByObj } from './cbimAnnotation/BR_CloudLine2'
import { DrawCloudLineByAction, DrawCloudLineByObj } from './cbimAnnotation/BR_CloudLine'
import { DrawArrowLineByAction, DrawArrowLineByObj } from './cbimAnnotation/BR_ArrowLine'

export class CbimAnnotationDraw {
    constructor(mxfun) {
        this.batch = false
        this.drawing = false
        this.currentDrawObj = null
        this.currentBatchDrawObj = null
        this.mxfun = mxfun
        this.layout = 'Model'
        this.init()
    }

    init() {
        this.mxfun.addCommand('Cbim_AnnotationArrow', async (args) => {
            const obj = await DrawArrowLineByAction(args, this)
            this.currentDrawObj = obj
            console.log('draw obj', obj)
        })
        this.mxfun.addCommand('Cbim_AnnotationCloudV1', async (args) => {
            const obj = await DrawCloudLineByAction(args, this)
            this.currentDrawObj = obj
            console.log('draw obj', obj)

        })
        this.mxfun.addCommand('Cbim_AnnotationCloudV2', async (args) => {
            const obj = await DrawCloudLineV2ByAction(args, this)
            this.currentDrawObj = obj
            console.log('draw obj', obj)

        })
        this.mxfun.addCommand('Cbim_AnnotationRectangle', async (args) => {
            const obj = await DrawRectByAction(args, this)
            this.currentDrawObj = obj
            console.log('draw obj', obj)
        })
        this.mxfun.addCommand('Cbim_AnnotationEclipse', async (args) => {
            const obj = await DrawEclipseByAction(args, this)
            this.currentDrawObj = obj
            console.log('draw obj', obj)
        })
        this.mxfun.addCommand('Cbim_AnnotationClose', (args) => { console.warn(args) })
        this.mxfun.addCommand('Cbim_AnnotationColorChange', (args) => { console.warn(args) })
        this.mxfun.addCommand('Cbim_AnnotationLineWidthChange', (args) => { })
        this.mxfun.addCommand('Cbim_AnnotationBatchDrawChange', (args) => {
            this.batch = args
        })
        this.mxfun.addCommand('Cbim_AnnotationBatchDrawComplete', (args) => {
            this.drawing = false
            this.batch = false
        })
        this.mxfun.addCommand('Cbim_AnnotationSaveJSON', () => {
            const annotations = this.mxfun.getCurrentDraw().saveMxEntityToJson()
            localStorage.setItem('cbim-annotation', annotations)
        })
        this.mxfun.addCommand('Cbim_AnnotationJsonDraw', () => {
            const annotations = JSON.parse(localStorage.getItem('cbim-annotation') || {})
            console.log('anno', annotations, typeof annotations)
            this.drawAnnotations(annotations.entitys || [])
        })
    }

    setLayout(layout) {
        this.layout = layout
    }

    drawAnnotations(annotations) {
        annotations.forEach(obj => {
            console.log('draw anno', obj)
            switch (obj.TypeName) {
                case 'CbimMxDbArrowLine':
                    DrawArrowLineByObj(obj)
                    break
                case 'CbimMxDbCloudLine':
                    DrawCloudLineByObj(obj)
                    break
                case 'CbimMxDbEclipse':
                    DrawEclipseByObj(obj)
                    break
                case 'CbimMxDbRect':
                    DrawRectByObj(obj)
                    break
                default:
                    break
            }
        })
    }
}