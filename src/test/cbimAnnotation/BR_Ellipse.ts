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

class CbimMxDbEclipse extends MxDbEntity {
    startPoint = new Vector3()
    endPoint = new Vector3()
    markNumberRadius = 2
    bezierCurveCircle = 6		// 贝塞尔曲线绘制内切圆的时候两个控制点超出的高度系数
    constructor(params) {
        super(params)
        this.setColor(params.color)
        this.setLineWidth(params.lineWidth)
        this.opacity = params.opacity || 0.5
    }
    worldDraw(pWorldDraw: McGiWorldDraw): void {
        // 绘制矩形框
        const startPoint = this.startPoint
        const endPoint = this.endPoint
        const color = this.color
        const lineWidth = this.getLineWidth()
        let pointData = []
        // 清空之前的所有顶点
        let bezierCurveArr = []
        // start代表的是左上角，end代表的是右下角
        let startX = startPoint.x
        let startY = startPoint.y
        let endX = endPoint.x
        let endY = endPoint.y
        if (startPoint.x < endPoint.x) {
            startX = startPoint.x
            endX = endPoint.x
        } else {
            startX = endPoint.x
            endX = startPoint.x
        }
        if (startPoint.y > endPoint.y) {
            startY = startPoint.y
            endY = endPoint.y
        } else {
            startY = endPoint.y
            endY = startPoint.y
        }
        const ellipseLine = (px, py, mx, my) => {
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
                y: py + (py - my) / this.bezierCurveCircle,
                z: 0
            }
            up.secondControlPoint = {
                x: mx,
                y: py + (py - my) / this.bezierCurveCircle,
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
                y: my - (py - my) / this.bezierCurveCircle,
                z: 0
            }
            down.secondControlPoint = {
                x: px,
                y: my - (py - my) / this.bezierCurveCircle,
                z: 0
            }
            bezierCurveArr.push(down)
        }
        ellipseLine(startX, startY, endX, endY)
        // 遍历绘制云线
        bezierCurveArr.forEach((item, index) => {
            pointData = pointData.concat(getBezierCurvePoint(item, 'twoControlPoint'))
        })
        let geometry = new LineGeometry()
        let material = new LineMaterial({
            color,
            linewidth: lineWidth
        })
        geometry.setPositions(transCoordArr(pointData))
        // Create the final object to add to the scene
        let line = new Line2(geometry, material)
        let group = new Group()
        group.add(line)
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

export async function DrawEclipseByAction(params) {
    const getPoint = new MrxDbgUiPrPoint()
    const mxDraw = MxFun.getCurrentDraw()
    const worldDrawComment = new McEdGetPointWorldDrawObject()
    // const mxEllipse = new CbimMxDbEclipse(params)
    const mxEllipse = new MxDbEllipse()
    mxEllipse.setLineWidth(params.lineWidth)
    mxEllipse.setColor(params.color)
    getPoint.setMessage("\n点击开始绘制椭圆:")
    const p1: THREE.Vector3 | null = await getPoint.go()
    // mxEllipse.startPoint = p1
    mxEllipse.point1 = p1
    worldDrawComment.setDraw((currentPoint) => {
        // 动态绘制three.js物体对象
        // mxEllipse.endPoint = currentPoint
        mxEllipse.point2 = currentPoint
        worldDrawComment.drawCustomEntity(mxEllipse)
    })
    getPoint.setUserDraw(worldDrawComment)
    getPoint.setMessage("\n再次点击结束绘制椭圆:")
    await getPoint.go()
    mxDraw.addMxEntity(mxEllipse)
    return mxEllipse
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
