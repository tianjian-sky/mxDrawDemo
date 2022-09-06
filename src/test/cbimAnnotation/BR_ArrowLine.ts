import { MrxDbgUiPrPoint, MrxDbgUiPrBaseReturn, MxThreeJS, MxDbCloudLine, MxDbEntity, McGiWorldDraw, MxFun, MxDbEllipse, McEdGetPointWorldDrawObject } from "mxdraw"
import { Shape, BufferGeometry, Geometry, Face3, Line, Group, Mesh, MeshBasicMaterial, Vector3, Color } from "three";
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'

function _drawTriangle(p0, p1, p2, color) {
    let geometry = new Geometry()
    geometry.vertices.push(p0, p1, p2)
    geometry.faces.push(new Face3(0, 1, 2))
    geometry.computeFaceNormals()
    let mesh = new Mesh(geometry, new MeshBasicMaterial({ color }))
    return mesh
}

function _transCoordArr(arr) {
    let positions = []
    arr.forEach(item => {
        positions.push(item.x, item.y, item.z)
    })
    return positions
}

class CbimMxDbArrowLine extends MxDbEntity {
    startPoint = new Vector3()
    endPoint = new Vector3()
    markNumberRadius = 2
    constructor(params) {
        super(params)
        this.setColor(params.color)
        this.setLineWidth(params.lineWidth)
        this.opacity = params.opacity || 0.5
    }
    worldDraw(pWorldDraw: McGiWorldDraw): void {
        if (this.startPoint.x != this.endPoint.x && this.startPoint.y != this.endPoint.y) {
            const lineWidth = this.getLineWidth()
            const color = this.getColor()
            let angle = Math.atan2(this.endPoint.y - this.startPoint.y, this.endPoint.x - this.startPoint.x)
            // 距离
            const dist = Math.sqrt(Math.pow(this.startPoint.x - this.endPoint.x, 2) + Math.pow(this.startPoint.y - this.endPoint.y, 2))
            let arrowLen = dist / 10
            const foot = new Vector3(this.startPoint.x + arrowLen * Math.cos(angle), this.startPoint.y + arrowLen * Math.sin(angle), 0)
            const theta = 20 * Math.PI / 180
            const pointStart1 = new Vector3(
                foot.x * Math.cos(-theta) - foot.y * Math.sin(-theta) - this.startPoint.x * Math.cos(-theta) + this.startPoint.y * Math.sin(-theta) + this.startPoint.x,
                foot.x * Math.sin(-theta) + foot.y * Math.cos(-theta) - this.startPoint.x * Math.sin(-theta) - this.startPoint.y * Math.cos(-theta) + this.startPoint.y,
                0
            )
            const pointStart2 = new Vector3(
                foot.x * Math.cos(theta) - foot.y * Math.sin(theta) - this.startPoint.x * Math.cos(theta) + this.startPoint.y * Math.sin(theta) + this.startPoint.x,
                foot.x * Math.sin(theta) + foot.y * Math.cos(theta) - this.startPoint.x * Math.sin(theta) - this.startPoint.y * Math.cos(theta) + this.startPoint.y,
                0
            )
            // 材质
            let material = new LineMaterial({
                color,
                linewidth: lineWidth
            })
            // 防止线宽过宽
            material.resolution.set(window.innerWidth, window.innerHeight)
            let pointStart = new Vector3(this.startPoint.x, this.startPoint.y, 0)
            let pointEnd = new Vector3(this.endPoint.x, this.endPoint.y, 0)
            let triangle = _drawTriangle(pointStart, pointStart1, pointStart2, color)
            let geometry = new LineGeometry()
            geometry.setPositions(_transCoordArr([foot, pointEnd]))
            let line = new Line2(geometry, material)
            let group = new Group()
            group.add(line, triangle)
            pWorldDraw.drawEntity(group)
        }
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
        return new CbimMxDbArrowLine()
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

export async function DrawArrowLineByAction(params, context) {
    const drawings = []
    context.drawing = true
    do {
        const point = new MrxDbgUiPrPoint()
        const mxDraw = MxFun.getCurrentDraw()
        const worldDrawComment = new McEdGetPointWorldDrawObject()
        const ent = new CbimMxDbArrowLine({
            lineWidth: params.lineWidth || 1,
            color: params.color
        })
        point.setMessage("\n点击开始绘制椭圆:");
        const pt1 = await point.go()
        if (!pt1) break
        ent.startPoint = ent.endPoint = pt1
        worldDrawComment.setDraw(currentPoint => {
            ent.endPoint = currentPoint
            worldDrawComment.drawCustomEntity(ent)
        })
        point.setUserDraw(worldDrawComment)
        point.setMessage("\n再次点击结束绘制椭圆:");
        await point.go()
        mxDraw.addMxEntity(ent)
        if (!context.batch) {
            context.drawing = false
        }
    } while (context.drawing)
    return drawings
}

export async function DrawArrowLineByObj(params) {
    const rect = new CbimMxDbArrowLine()
    return rect
}
