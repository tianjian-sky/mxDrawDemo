import { MxFun, MrxDbgUiPrPoint, McEdGetPointWorldDrawObject, MrxDbgUiPrBaseReturn, MxThreeJS, MxDbRectBoxLeadComment } from "mxdraw"
import { LineDashedMaterial } from "three"

export default function() {
    const point = new MrxDbgUiPrPoint()
	const mxDraw = MxFun.getCurrentDraw()
	const worldDrawComment = new McEdGetPointWorldDrawObject()
    const mxCheckDraw = new MxDbRectBoxLeadComment()
    mxCheckDraw.textHeight = MxFun.screenCoordLong2Doc(50);
    mxCheckDraw.radius = MxFun.screenCoordLong2Doc(8);
    point.setMessage("\n云线框起始点:");
    point.go((status)=> {
        if (status != MrxDbgUiPrBaseReturn.kOk) {
            return
        }
        mxCheckDraw.point1 = point.value()
        worldDrawComment.setDraw((currentPoint)=> {
            mxCheckDraw.point2 = currentPoint
            worldDrawComment.drawCustomEntity(mxCheckDraw)
           
        })

        point.setUserDraw(worldDrawComment)
        point.setMessage("\n云线框结束点:");
        point.go((status)=> {
            if (status != MrxDbgUiPrBaseReturn.kOk) {
                return
            }
            mxCheckDraw.point2 = point.value()
            
            worldDrawComment.setDraw((currentPoint)=> {
                mxCheckDraw.point3 = currentPoint
                worldDrawComment.drawCustomEntity(mxCheckDraw)
            })
            mxCheckDraw.text = "审图批注XXX"

            point.setMessage("\n审图标注点:");
            point.go((status)=> {
                if (status != MrxDbgUiPrBaseReturn.kOk) {
                    return
                }
                mxCheckDraw.point3 = point.value()
                mxDraw.addMxEntity(mxCheckDraw)
            })
        })
    })
}