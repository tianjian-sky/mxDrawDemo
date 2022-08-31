import { McEdGetPointWorldDrawObject, MrxDbgUiPrPoint, MxDbRegularPolygon, MxFun } from "mxdraw"

export default function() {
    const point = new MrxDbgUiPrPoint()
	const mxDraw = MxFun.getCurrentDraw()
	const worldDrawComment = new McEdGetPointWorldDrawObject()
    const mxRegularPolygon = new MxDbRegularPolygon()
    mxRegularPolygon.sidesNumber = 8;

    point.setMessage("\n点击开始绘制多边形:");
	point.go(() => {
        mxRegularPolygon.centerPoint = point.value()
		
		worldDrawComment.setDraw(
			(
			currentPoint
			) => {
			// 动态绘制three.js物体对象
            mxRegularPolygon.otherPoint = currentPoint
			worldDrawComment.drawCustomEntity(mxRegularPolygon)
			}
		)
		point.setUserDraw(worldDrawComment)
        point.setMessage("\n再次点击结束绘制多边形:");
		point.go(()=> {
            mxDraw.addMxEntity(mxRegularPolygon)
        })	
	})
}
