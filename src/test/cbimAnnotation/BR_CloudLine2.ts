import { MrxDbgUiPrPoint, MrxDbgUiPrBaseReturn, MxThreeJS, MxDbCloudLine, MxDbEntity, McGiWorldDraw, MxFun, MxDbEllipse, McEdGetPointWorldDrawObject } from "mxdraw"
import { Shape, BufferGeometry, Line, LineBasicMaterial, Vector3, Color } from "three";

class CbimMxDbCloudLine extends MxDbEntity {
    constructor() {
        super()
    }
    worldDraw(pWorldDraw: McGiWorldDraw): void {
    }

    getGripPoints(): Vector3[] {
        return [] // [this.centerPt, this.acnode]
    }
    moveGripPointsAt(index: number, offset: Vector3): boolean {
        // if (index === 0) {
        //     this.centerPt.add(offset)
        //     this.acnode.add(offset)
        // } else {
        //     this.acnode.add(offset)
        // }
        return true
    }
    create(): MxDbEntity {
        return new MxDbCircle()
    }

    public dwgIn(obj: any) {
        this.onDwgIn(obj)
        // this.centerPt.copy(obj['centerPt'])
        // this.acnode.copy(obj['acnode'])
        return true
    }
    dwgOut(obj: any) {
        this.onDwgOut(obj)
        // obj.centerPt = this.centerPt
        // obj.acnode = this.acnode
        return obj
    }
    getGripPoints() {

    }
    getTypeName(): string {
        return "CbimMxDbEclipse"
    }
    moveGripPointsAt(index: number, offset: Vector3) {
        return true
    }
}

export async function DrawCloudLineV2ByAction(params, context) {
    const drawings = []
    context.drawing = true
    // 屏幕坐标半径
    do {
        const point = new MrxDbgUiPrPoint()
        const mxDraw = MxFun.getCurrentDraw()
        const worldDrawComment = new McEdGetPointWorldDrawObject()
        const radius = MxFun.screenCoordLong2Doc(params.radius || 16)
        point.setMessage("\n点击开启绘制云线:")
        let pt = await point.go()
        if (!pt) break
        const mxCloudLine = new MxDbCloudLine()
        mxCloudLine.setLineWidth(params.linewidth)
        mxCloudLine.setColor(params.color)
        mxCloudLine.setRadius(radius)
        mxCloudLine.addPoint(pt)
        worldDrawComment.setDraw(currentPoint => {
            if (pt.distanceTo(currentPoint) > radius) {
                pt = currentPoint.clone()
                mxCloudLine.addPoint(currentPoint, true)
            }
            worldDrawComment.drawCustomEntity(mxCloudLine)
        })
        point.setUserDraw(worldDrawComment)
        point.setMessage("\n再次点击结束绘制云线:");
        await point.go()
        mxDraw.addMxEntity(mxCloudLine)
        if (!context.batch) {
            context.drawing = false
        }
    } while (context.drawing)
    return drawings
}

export async function DrawCloudLineV2ByObj(params) {
    const obj = new MxDbEllipse();
    return obj
}
