///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序与成都梦想凯德科技有限公司成协议。通过使用本软件、其文档或相关材料
///////////////////////////////////////////////////////////////////////////////
import { MxMeasure } from './MeasureDistance'
import { MeasureAngle } from './MeasureAngle'
import { MeasureArea } from './MeasureArea'
export class CbimAnnotationMeasure {
    constructor(mxfun) {
        this.mxfun = mxfun
        this.lineMeasure = new MxMeasure()
        this.areaMeasure = new MeasureArea()
        this.angleMeasure = new MeasureAngle()
        this.init()
    }

    init() {
        this.mxfun.addCommand('Cbim_MeasureDistance', async () => {
            this.lineMeasure.DoDimensionMeasurement()
        })
        this.mxfun.addCommand('Cbim_MeasureAngle', async () => {
            this.angleMeasure.Do()
        })
        this.mxfun.addCommand('Cbim_MeasureArea', async () => {
            this.areaMeasure.Do()
        })
        this.mxfun.addCommand('Cbim_MeasureClear', async () => {
            this.lineMeasure.clear()
            this.areaMeasure.clear()
            this.angleMeasure.clear()
        })
    }
}