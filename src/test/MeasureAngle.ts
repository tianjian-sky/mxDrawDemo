///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序与成都梦想凯德科技有限公司成协议。通过使用本软件、其文档或相关材料
///////////////////////////////////////////////////////////////////////////////
import * as THREE from "three";
import { MxFun, MrxDbgUiPrPoint, McEdGetPointWorldDrawObject, MxDb2LineAngularDimension } from "mxdraw"

let measureList = []
export class MeasureAngle {
    public Do() {
        // 动态点对象 存储顶点数组
        const point = new MrxDbgUiPrPoint()
        // 绘制控件
        const mxDraw = MxFun.getCurrentDraw()

        const angleDim = new MxDb2LineAngularDimension()

        // 开启连续点击
        const worldDraw = new McEdGetPointWorldDrawObject()
        point.setMessage("\n指定第一点:");
        point.go((status) => {
            if (status !== 0) {
                return
            }
            point.setMessage("\n指定第二个角度点:");
            angleDim.point1 = point.value()
            worldDraw.setDraw((currentPoint, pWorldDraw) => {
                angleDim.point2 = currentPoint
                worldDraw.drawLine(angleDim.point1, currentPoint)
            })
            point.setUserDraw(worldDraw)
            point.go((status) => {
                point.setMessage("\n指定最后一个点:");
                if (status !== 0) {
                    return
                }
                angleDim.point2 = point.value()
                worldDraw.setDraw((currentPoint, pWorldDraw) => {
                    angleDim.point3 = currentPoint
                    worldDraw.drawCustomEntity(angleDim);
                })
                point.go((status) => {
                    if (status !== 0) {
                        return
                    }
                    mxDraw.addMxEntity(angleDim)
                    measureList.push(angleDim)
                })
            })
        })
    }
    clear() {
        measureList.forEach(obj => {
            MxFun.getCurrentDraw().eraseMxEntity(obj.MxDbEntityImp.id)
        })
        measureList = []
    }
}
