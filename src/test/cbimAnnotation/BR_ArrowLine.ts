import { MrxDbgUiPrPoint, MrxDbgUiPrBaseReturn, MxThreeJS, MxDbCloudLine, MxDbEntity, McGiWorldDraw, MxFun, MxDbEllipse, McEdGetPointWorldDrawObject } from "mxdraw"
import { Shape, BufferGeometry, Geometry, Face3, Line, Group, Mesh, MeshBasicMaterial, Vector3, Color } from "three";
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'

function computeAngle2(px, py, mx, my) {
    var x = Math.abs(px - mx)
    var y = Math.abs(py - my)
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    var sin = y / z
    //用反三角函数求弧度
    var radina = Math.asin(sin)
    //将弧度转换成角度
    var angle = Math.floor(180 / (Math.PI / radina))
    //鼠标在x轴正方向上
    if (mx < px && my == py) {
        angle = 0
    }
    //鼠标在x轴负方向
    else if (mx > px && my == py) {
        angle = 180
    }
    //鼠标在y轴正方向上
    else if (mx == px && my < py) {
        angle = 90
    }
    //鼠标在y轴负方向上
    else if (mx == px && my > py) {
        angle = 270
    }
    //鼠标在第一象限
    else if (mx > px && my < py) {
        angle = 180 - angle
    }
    //鼠标在第二象限
    else if (mx < px && my < py) {
        angle = angle
    }
    //鼠标在第三象限
    else if (mx < px && my > py) {
        angle = 360 - angle
    }
    //鼠标在第四象限
    else if (mx > px && my > py) {
        angle = 180 + angle
    }
    return angle
}

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
        const lineWidth = this.getLineWidth()
        const color = this.getColor()
        let angle = computeAngle2(this.endPoint.x, this.endPoint.y, this.startPoint.x, this.startPoint.y)
        // 距离
        const dist = Math.sqrt(Math.pow(this.startPoint.x - this.endPoint.x) + Math.pow(this.startPoint.y - this.endPoint.y))
        let arrowLen = this.markNumberRadius * (1 + (lineWidth - 1) / 10)
        let theta = 40
        let angle1 = (angle + theta) * Math.PI / 180 //角a2
        let angle2 = (angle - theta) * Math.PI / 180 //角a1
        let topX = arrowLen * Math.cos(angle1) //上箭头初始位置y坐标
        let topY = arrowLen * Math.sin(angle1)
        let botX = arrowLen * Math.cos(angle2) //下箭头初始位置x坐标
        let botY = arrowLen * Math.sin(angle2)
        // 材质
        let material = new LineMaterial({
            color,
            lineWidth
        })
        let material1 = new LineMaterial({
            color,
            lineWidth,
            transparent: true,
            opacity: this.opacity
        })
        // 防止线宽过宽
        material.resolution.set(window.innerWidth, window.innerHeight)
        material1.resolution.set(window.innerWidth, window.innerHeight)
        let pointStart = new Vector3(this.startPoint.x, this.startPoint.y, 0)
        let pointEnd = new Vector3(this.endPoint.x, this.endPoint.y, 0)
        let pointStart1 = new Vector3(this.startPoint.x + topX, this.startPoint.y + topY, 0)
        let pointStart2 = new Vector3(this.startPoint.x + botX, this.startPoint.y + botY, 0)
        let triangle = _drawTriangle(pointStart1, pointStart, pointStart2, color)
        let geometry = new LineGeometry()
        let lineStartPoint = new Vector3(this.startPoint.x + (topX + botX) / 2, this.startPoint.y + (topY + botY) / 2, 0)
        geometry.setPositions(_transCoordArr([lineStartPoint, pointEnd]))
        let line = new Line2(geometry, material)
        let group = new Group()
        group.add(line, triangle)
        pWorldDraw.drawEntity(group)
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
