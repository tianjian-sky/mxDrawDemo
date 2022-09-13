import { MrxDbgUiPrPoint, MrxDbgUiPrBaseReturn, MxThreeJS, MxDbCloudLine, MxDbEntity, McGiWorldDraw, MxFun, MxDbEllipse, McEdGetPointWorldDrawObject } from "mxdraw"
import { Shape, BufferGeometry, Geometry, Face3, Line, Group, Mesh, MeshBasicMaterial, Vector3, Color, Points } from "three";
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
    pointList: Array<Vector3> = []
    annotationId: String = ''
    layout: String = ''
    code: String = ''
    constructor(params) {
        super(params)
        if (params.pointList) {
            this.pointList = params.pointList
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
        this.setColor(params.color)
        this.setLineWidth(params.lineWidth)
        this.opacity = params.opacity || 0.5
    }
    worldDraw(pWorldDraw: McGiWorldDraw): void {
        let group = new Group()
        group.userData.type = 'cbim_annotation_arrow'
        group.userData.annotationId = this.annotationId
        for (let i = 0; i < this.pointList.length; i += 2) {
            let pointStart = this.pointList[i]
            let pointEnd = this.pointList[i + 1]
            // if (!pointStart || !pointEnd) continue
            // if (pointStart.x != pointEnd.x && pointStart.y != pointEnd.y) {
            const lineWidth = this.getLineWidth()
            const color = this.getColor()
            let angle = Math.atan2(pointEnd.y - pointStart.y, pointEnd.x - pointStart.x)
            // 距离
            const dist = Math.sqrt(Math.pow(pointStart.x - pointEnd.x, 2) + Math.pow(pointStart.y - pointEnd.y, 2))
            let arrowLen = dist / 10
            const foot = new Vector3(pointStart.x + arrowLen * Math.cos(angle), pointStart.y + arrowLen * Math.sin(angle), 0)
            const theta = 20 * Math.PI / 180
            const pointStart1 = new Vector3(
                foot.x * Math.cos(-theta) - foot.y * Math.sin(-theta) - pointStart.x * Math.cos(-theta) + pointStart.y * Math.sin(-theta) + pointStart.x,
                foot.x * Math.sin(-theta) + foot.y * Math.cos(-theta) - pointStart.x * Math.sin(-theta) - pointStart.y * Math.cos(-theta) + pointStart.y,
                0
            )
            const pointStart2 = new Vector3(
                foot.x * Math.cos(theta) - foot.y * Math.sin(theta) - pointStart.x * Math.cos(theta) + pointStart.y * Math.sin(theta) + pointStart.x,
                foot.x * Math.sin(theta) + foot.y * Math.cos(theta) - pointStart.x * Math.sin(theta) - pointStart.y * Math.cos(theta) + pointStart.y,
                0
            )
            // 材质
            let material = new LineMaterial({
                color,
                linewidth: lineWidth
            })
            // 防止线宽过宽
            material.resolution.set(window.innerWidth, window.innerHeight)
            let triangle = _drawTriangle(pointStart, pointStart1, pointStart2, color)
            let geometry = new LineGeometry()
            geometry.setPositions(_transCoordArr([foot, pointEnd]))
            let line = new Line2(geometry, material)
            group.add(line, triangle)
            // }
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
        return new CbimMxDbArrowLine()
    }

    public dwgIn(obj: any) {
        console.log('dwg in', obj)
        this.onDwgIn(obj)
        // this.centerPt.copy(obj['centerPt'])
        // this.acnode.copy(obj['acnode'])
        return true
    }
    dwgOut(obj: any) {
        console.log('dwg out', obj)
        this.onDwgOut(Object.assign(obj, {
            pointList: this.pointList,
            annotationId: this.annotationId,
            code: this.code,
            layout: this.layout
        }))
        // obj.centerPt = this.centerPt
        // obj.acnode = this.acnode
        return obj
    }
    getGripPoints() {

    }
    getTypeName(): string {
        return "CbimMxDbArrowLine"
    }
    moveGripPointsAt(index: number, offset: Vector3) {
        return true
    }
}

export async function DrawArrowLineByAction(params, context) {
    context.drawing = true
    const ent = new CbimMxDbArrowLine({
        lineWidth: params.lineWidth || 1,
        color: params.color,
        code: params.code || ''
    })
    const mxDraw = MxFun.getCurrentDraw()
    // mxDraw.addMxEntity(ent)
    // document.addEventListener('click', e => {
    //     const pt = MxFun.screenCoord2Doc(e.offsetX, e.offsetY)
    //     if (ent.pointList.length && ent.pointList.length % 2 == 0) {
    //         ent.pointList[ent.pointList.length - 1] = pt
    //     } else {
    //         ent.pointList.push(pt)
    //     }
    //     console.log(ent.pointList.length)
    // })
    // document.addEventListener('mousemove', e => {
    //     const pt = MxFun.screenCoord2Doc(e.offsetX, e.offsetY)
    //     if (ent.pointList.length && ent.pointList.length % 2 == 0) {
    //         ent.pointList[ent.pointList.length - 1] = pt
    //     } else {
    //         ent.pointList.push(pt)
    //     }
    // })
    // mxDraw.addMxEntity(ent)
    const ptList = ent.pointList
    do {
        // console.warn(ent, ent.getLayer())
        const point = new MrxDbgUiPrPoint()
        const worldDrawComment = new McEdGetPointWorldDrawObject()
        point.setMessage("\n点击开始绘制椭圆:");
        const pt1 = await point.go()
        if (!pt1) break
        ent.pointList.push(pt1)
        ent.pointList.push(pt1)
        worldDrawComment.setDraw(currentPoint => {
            ent.pointList[ent.pointList.length - 1] = currentPoint
            worldDrawComment.drawCustomEntity(ent)
        })
        point.setUserDraw(worldDrawComment)
        point.setMessage("\n再次点击结束绘制椭圆:");
        await point.go()
        if (!context.batch) {
            context.drawing = false
        }
    } while (context.drawing)
    mxDraw.addMxEntity(ent)
    return ent
}

export async function DrawArrowLineByObj(params) {
    const entity = new CbimMxDbArrowLine({
        color: params.color,
        lineWidth: params.lineWidth,
        opacity: params.opacity,
    })
    entity.pointList = params.pointList
    const mxDraw = MxFun.getCurrentDraw()
    mxDraw.addMxEntity(entity)
}
