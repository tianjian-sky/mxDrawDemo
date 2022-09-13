import { MrxDbgUiPrPoint, MxDbEntity, McGiWorldDraw, MxFun, MxDbEllipse, McEdGetPointWorldDrawObject } from "mxdraw"
import { Group, Vector3, CubicBezierCurve3, QuadraticBezierCurve3 } from "three";
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'

function upLine(px, py, mx, my, bezierCurveX, bezierCurveHeight, bezierCurveArr) {
    let one = Math.abs((mx - px) / bezierCurveX)
    for (let i = 0; i < one; i++) {
        let obj = {}
        if (mx - (px + bezierCurveX * i) < bezierCurveX) {
            // 最后一点
            obj.startPoint = {
                x: px + bezierCurveX * i,
                y: py,
                z: 0
            }
            obj.endPoint = {
                x: mx,
                y: py,
                z: 0
            }
            obj.middlePoint = {
                x: (px + bezierCurveX * i) + ((mx - (px + bezierCurveX * i)) / 2),
                y: py + bezierCurveHeight,
                z: 0
            }
        } else {
            obj.startPoint = {
                x: px + bezierCurveX * i,
                y: py,
                z: 0
            }
            obj.endPoint = {
                x: px + bezierCurveX * (i + 1),
                y: py,
                z: 0
            }
            obj.middlePoint = {
                x: px + bezierCurveX * (i + 0.5),
                y: py + bezierCurveHeight,
                z: 0
            }
        }
        bezierCurveArr.push(obj)
    }
}

function rightLine(px, py, mx, my, bezierCurveY, bezierCurveHeight, bezierCurveArr) {
    let one = Math.abs((my - py) / bezierCurveY)
    for (let i = 0; i < one; i++) {
        let obj = {}
        if (py - (my + bezierCurveY * i) < bezierCurveY) {
            // 最后一点
            obj.startPoint = {
                x: mx,
                y: py - bezierCurveY * i,
                z: 0
            }
            obj.endPoint = {
                x: mx,
                y: my,
                z: 0
            }
            obj.middlePoint = {
                x: mx + bezierCurveHeight,
                y: my + (((py - bezierCurveY * i) - my) / 2),
                z: 0
            }
        } else {
            obj.startPoint = {
                x: mx,
                y: py - bezierCurveY * i,
                z: 0
            }
            obj.endPoint = {
                x: mx,
                y: py - bezierCurveY * (i + 1),
                z: 0
            }
            obj.middlePoint = {
                x: mx + bezierCurveHeight,
                y: py - bezierCurveY * (i + 0.5),
                z: 0
            }
        }
        bezierCurveArr.push(obj)
    }
}

function downLine(px, py, mx, my, bezierCurveX, bezierCurveHeight, bezierCurveArr) {
    let one = Math.abs((mx - px) / bezierCurveX)
    for (let i = 0; i < one; i++) {
        let obj = {}
        if (mx - (px + bezierCurveX * i) < bezierCurveX) {
            // 最后一点
            obj.startPoint = {
                x: mx - bezierCurveX * i,
                y: my,
                z: 0
            }
            obj.endPoint = {
                x: px,
                y: my,
                z: 0
            }
            obj.middlePoint = {
                x: px + (((mx - bezierCurveX * i) - px) / 2),
                y: my - bezierCurveHeight,
                z: 0
            }
        } else {
            obj.startPoint = {
                x: mx - bezierCurveX * i,
                y: my,
                z: 0
            }
            obj.endPoint = {
                x: mx - bezierCurveX * (i + 1),
                y: my,
                z: 0
            }
            obj.middlePoint = {
                x: mx - bezierCurveX * (i + 0.5),
                y: my - bezierCurveHeight,
                z: 0
            }
        }
        bezierCurveArr.push(obj)
    }
}

function leftLine(px, py, mx, my, bezierCurveY, bezierCurveHeight, bezierCurveArr) {
    let one = Math.abs((my - py) / bezierCurveY)
    for (let i = 0; i < one; i++) {
        let obj = {}
        if (py - (my + bezierCurveY * i) < bezierCurveY) {
            // 最后一点
            obj.startPoint = {
                x: px,
                y: my + bezierCurveY * i,
                z: 0
            }
            obj.endPoint = {
                x: px,
                y: py,
                z: 0
            }
            obj.middlePoint = {
                x: px - bezierCurveHeight,
                y: py - ((py - (my + bezierCurveY * i)) / 2),
                z: 0
            }
        } else {
            obj.startPoint = {
                x: px,
                y: my + bezierCurveY * i,
                z: 0
            }
            obj.endPoint = {
                x: px,
                y: my + bezierCurveY * (i + 1),
                z: 0
            }
            obj.middlePoint = {
                x: px - bezierCurveHeight,
                y: my + bezierCurveY * (i + 0.5),
                z: 0
            }
        }
        bezierCurveArr.push(obj)
    }
}

function getBezierCurvePoint(data, sign) {
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

class CbimMxDbCloudLine extends MxDbEntity {
    pointList: Array<Vector3> = []
    bezierCurveLength = 10 // 曲线间距
    bezierCurveHeight = 1.2 // 曲线的弧度
    annotationId: String = ''
    layout: String = ''
    code: String = ''
    constructor(params) {
        super(params)
        if (params.pointList) {
            this.pointList = params.pointList
        }
        if (params.color) {
            this.setColor(params.color)
        }
        if (params.lineWidth) {
            this.setLineWidth(params.lineWidth)
        }
        if (params.bezierCurveLength) {
            this.bezierCurveLength = params.bezierCurveLength
        } else {
            this.bezierCurveLength = MxFun.screenCoordLong2Doc(10)
        }
        if (params.bezierCurveHeight) {
            this.bezierCurveHeight = params.bezierCurveHeight
        } else {
            this.bezierCurveHeight = MxFun.screenCoordLong2Doc(5)
        }
        if (params.annotationId) {
            this.annotationId = params.annotationId
        }
        if (params.layout) {
            this.layout = params.layout
        }
        if (params.code) {
            this.code = params.code
        }
    }
    worldDraw(pWorldDraw: McGiWorldDraw): void {
        const group = new Group()
        group.userData.type = 'cbim_annotation_cloudLine'
        for (let i = 0; i < this.pointList.length; i += 2) {
            let pointStart = this.pointList[i]
            let pointEnd = this.pointList[i + 1]
            console.warn(!pointStart, !pointEnd, this.pointList.length, i)
            if (!pointStart || !pointEnd) continue
            if (pointStart.x != pointEnd.x && pointStart.y != pointEnd.y) {
                // 重置所有顶点的数据
                let pointData = []
                // 清空之前的所有顶点
                const bezierCurveArr = []
                // start代表的是左上角，end代表的是右下角
                let startX = pointStart.x
                let startY = pointStart.y
                let endX = pointEnd.x
                let endY = pointEnd.y
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
                // 重新计算曲线的宽和高
                let x = Math.round(Math.abs(endX - startX) / this.bezierCurveLength) || 1
                let y = Math.round(Math.abs(endY - startY) / this.bezierCurveLength) || 1
                this.bezierCurveX = Math.abs(endX - startX) / x
                this.bezierCurveY = Math.abs(endY - startY) / y
                upLine(startX, startY, endX, endY, this.bezierCurveX, this.bezierCurveHeight, bezierCurveArr)
                rightLine(startX, startY, endX, endY, this.bezierCurveY, this.bezierCurveHeight, bezierCurveArr)
                downLine(startX, startY, endX, endY, this.bezierCurveX, this.bezierCurveHeight, bezierCurveArr)
                leftLine(startX, startY, endX, endY, this.bezierCurveY, this.bezierCurveHeight, bezierCurveArr)
                // 遍历绘制云线
                bezierCurveArr.forEach((item, index) => {
                    pointData = pointData.concat(getBezierCurvePoint(item))
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
                group.add(new Line2(geometry, material))
            }
        }
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
        return new CbimMxDbCloudLine()
    }

    public dwgIn(obj: any) {
        this.onDwgIn(obj)
        // this.centerPt.copy(obj['centerPt'])
        // this.acnode.copy(obj['acnode'])
        return true
    }
    dwgOut(obj: any) {
        this.onDwgOut(Object.assign(obj, {
            pointList: this.pointList,
            bezierCurveLength: this.bezierCurveLength,
            bezierCurveHeight: this.bezierCurveHeight,
            annotationId: this.annotationId,
            code: this.code,
            layout: this.layout
        }))
        return obj
    }
    getGripPoints() {

    }
    getTypeName(): string {
        return "CbimMxDbCloudLine"
    }
    moveGripPointsAt(index: number, offset: Vector3) {
        return true
    }
}

export async function DrawCloudLineByAction(params, context) {
    context.drawing = true
    const mxCloudLine = new CbimMxDbCloudLine({
        lineWidth: params.lineWidth,
        color: params.color
    })
    const mxDraw = MxFun.getCurrentDraw()
    // 屏幕坐标半径
    do {
        const point = new MrxDbgUiPrPoint()
        const worldDrawComment = new McEdGetPointWorldDrawObject()
        point.setMessage("\n点击开启绘制云线:")
        let pt = await point.go()
        if (!pt) break
        mxCloudLine.pointList.push(pt)
        mxCloudLine.pointList.push(pt)
        worldDrawComment.setDraw(currentPoint => {
            mxCloudLine.pointList[mxCloudLine.pointList.length - 1] = currentPoint
            worldDrawComment.drawCustomEntity(mxCloudLine)
        })
        point.setUserDraw(worldDrawComment)
        point.setMessage("\n再次点击结束绘制云线:");
        await point.go()
        if (!context.batch) {
            context.drawing = false
        }
    } while (context.drawing)
    mxDraw.addMxEntity(mxCloudLine)
    return mxCloudLine
}

export async function DrawCloudLineByObj(params) {
    const entity = new CbimMxDbCloudLine({
        color: params.color,
        lineWidth: params.lineWidth,
        code: params.code || '',
        opacity: params.opacity,
    })
    entity.pointList = params.pointList
    entity.bezierCurveLength = params.bezierCurveLength // 曲线间距
    entity.bezierCurveHeight = params.bezierCurveHeight // 曲线的弧度
    const mxDraw = MxFun.getCurrentDraw()
    mxDraw.addMxEntity(entity)
}
