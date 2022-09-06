import { MrxDbgUiPrPoint, MrxDbgUiPrBaseReturn, MxThreeJS, MxDbEntity, McGiWorldDraw, MxFun, MxDbEllipse, McEdGetPointWorldDrawObject } from "mxdraw"
import { Shape, BufferGeometry, QuadraticBezierCurve3, CubicBezierCurve3, Line, LineBasicMaterial, Vector3, Color, Group } from "three";
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'

function transCoordArr(arr) {
    let positions = []
    arr.forEach(item => {
        positions.push(item.x, item.y, item.z)
    })
    return positions
}

const getBezierCurvePoint = function (data, sign) {
    let curve = ''
    if (sign == 'twoControlPoint') {
        // 两个控制点的贝塞尔曲线
        curve = new CubicBezierCurve3(
            new Vector3(data.startPoint.x, data.startPoint.y, data.startPoint.z),
            new Vector3(data.firstControlPoint.x, data.firstControlPoint.y, data.firstControlPoint.z),
            new Vector3(data.secondControlPoint.x, data.secondControlPoint.y, data.secondControlPoint.z),
            new Vector3(data.endPoint.x, data.endPoint.y, data.endPoint.z)
        )
    } else {
        // 单个控制点的贝塞尔曲线
        curve = new QuadraticBezierCurve3(
            new Vector3(data.startPoint.x, data.startPoint.y, data.startPoint.z),
            new Vector3(data.middlePoint.x, data.middlePoint.y, data.middlePoint.z),
            new Vector3(data.endPoint.x, data.endPoint.y, data.endPoint.z)
        )
    }
    let points = curve.getPoints(50)
    return points
}

function ellipseLine(px, py, mx, my, bezierCurveCircle, bezierCurveArr) {
    // 上
    let up = {}
    up.startPoint = {
        x: px,
        y: (py + my) / 2,
        z: 0
    }
    up.endPoint = {
        x: mx,
        y: (py + my) / 2,
        z: 0
    }
    up.firstControlPoint = {
        x: px,
        y: py + (py - my) / bezierCurveCircle,
        z: 0
    }
    up.secondControlPoint = {
        x: mx,
        y: py + (py - my) / bezierCurveCircle,
        z: 0
    }
    bezierCurveArr.push(up)
    // 下
    let down = {}
    down.startPoint = {
        x: mx,
        y: (py + my) / 2,
        z: 0
    }
    down.endPoint = {
        x: px,
        y: (py + my) / 2,
        z: 0
    }
    down.firstControlPoint = {
        x: mx,
        y: my - (py - my) / bezierCurveCircle,
        z: 0
    }
    down.secondControlPoint = {
        x: px,
        y: my - (py - my) / bezierCurveCircle,
        z: 0
    }
    bezierCurveArr.push(down)
}

class CbimMxDbEclipse extends MxDbEntity {
    pointStart = new Vector3()
    pointEnd = new Vector3()
    bezierCurveCircle = 6 // 贝塞尔曲线绘制内切圆的时候两个控制点超出的高度系数
    constructor(params) {
        super(params)
        if (params.pointStart) {
            this.pointStart = params.pointStart
        }
        if (params.pointEnd) {
            this.pointEnd = params.pointEnd
        }
        if (params.color) {
            this.setColor(params.color)
        }
        if (params.lineWidth) {
            this.setLineWidth(params.lineWidth)
        }
        if (params.bezierCurveCircle) {
            this.bezierCurveCircle = params.bezierCurveCircle
        } else {
            this.bezierCurveCircle = MxFun.screenCoordLong2Doc(6)
        }
    }
    worldDraw(pWorldDraw: McGiWorldDraw): void {
        // 绘制矩形框
        let pointData = []
        // 清空之前的所有顶点
        const bezierCurveArr = []
        // start代表的是左上角，end代表的是右下角
        let startX = this.pointStart.x
        let startY = this.pointStart.y
        let endX = this.pointEnd.x
        let endY = this.pointEnd.y
        if (startX > endX) {
            const temp = startX
            startX = endX
            endX = temp
        }
        if (startY < endY) {
            const temp = startY
            startY = endY
            endY = temp
        }
        ellipseLine(startX, startY, endX, endY, this.bezierCurveCircle, bezierCurveArr)
        // 遍历绘制云线
        bezierCurveArr.forEach((item, index) => {
            pointData = pointData.concat(getBezierCurvePoint(item, 'twoControlPoint'))
        })
        if (pointData.length == 0) return false
        let geometry = new LineGeometry()
        let material = new LineMaterial({
            color: this.getColor(),
            linewidth: this.getLineWidth()
        })
        material.resolution.set(window.innerWidth, window.innerHeight)
        const pts = []
        pointData.forEach(vec => {
            pts.push(vec.x, vec.y, vec.z)
        })
        geometry.setPositions(pts)
        const group = new Group()
        group.add(new Line2(geometry, material))
        pWorldDraw.drawEntity(new Line2(geometry, material))
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
        return new CbimMxDbEclipse()
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

export async function DrawEclipseByAction(params, context) {
    const drawings = []
    context.drawing = true
    do {
        const mxDraw = MxFun.getCurrentDraw()
        const point = new MrxDbgUiPrPoint()
        const worldDrawComment = new McEdGetPointWorldDrawObject()
        const ent = new CbimMxDbEclipse({
            lineWidth: params.lineWidth,
            color: params.color
        })
        point.setMessage("\n点击开始绘制椭圆:")
        const pt: THREE.Vector3 | null = await point.go()
        if (!pt) break
        ent.pointStart = pt
        worldDrawComment.setDraw(currentPoint => {
            ent.pointEnd = currentPoint
            worldDrawComment.drawCustomEntity(ent)
        })
        point.setUserDraw(worldDrawComment)
        point.setMessage("\n再次点击结束绘制云线:");
        await point.go()
        mxDraw.addMxEntity(ent)
        if (!context.batch) {
            context.drawing = false
        }
    } while (context.drawing)
    return drawings
}

export async function DrawEclipseByObj(params) {
    const obj = new MxDbEllipse();
    const pt1 = params.begin
    const pt2 = params.end
    obj.point1 = pt1
    obj.point2 = pt2
    obj.setColor(params.color)
    obj.setLineWidth(params.lineWidth)
    MxFun.getCurrentDraw().addMxEntity(obj)
    return obj
}
