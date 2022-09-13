import { MrxDbgUiPrPoint, MrxDbgUiPrBaseReturn, MxThreeJS, MxDbEntity, McGiWorldDraw, MxFun, MxDbRect, McEdGetPointWorldDrawObject } from "mxdraw"
import { BufferAttribute, PlaneBufferGeometry, Group, DoubleSide, MeshBasicMaterial, Vector3, Mesh, Points } from "three";

class CbimMxDbRect extends MxDbEntity {
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
        group.userData.type = 'cbim_annotation_rectanble'
        for (let i = 0; i < this.pointList.length; i += 2) {
            const pointStart = this.pointList[i]
            const pointEnd = this.pointList[i + 1]
            // 给定两个对角点的坐标绘制平面
            const geometry = new PlaneBufferGeometry(Math.abs(pointEnd.x - pointStart.x), Math.abs(pointEnd.y - pointStart.y), 1, 1)
            //类型数组创建顶点位置position数据
            const vertices = new Float32Array([
                pointStart.x, pointStart.y, 0, //顶点1坐标
                pointEnd.x, pointStart.y, 0, //顶点2坐标
                pointEnd.x, pointEnd.y, 0, //顶点3坐标
                pointStart.x, pointEnd.y, 0 //顶点6坐标
            ])
            // 创建属性缓冲区对象
            const attribue = new BufferAttribute(vertices, 3) //3个为一组
            // 设置几何体attributes属性的位置position属性
            geometry.attributes.position = attribue
            const normals = new Float32Array([
                0, 0, 1, //顶点1法向量
                0, 0, 1, //顶点2法向量
                0, 0, 1, //顶点3法向量
                0, 0, 1 //顶点6法向量
            ])
            // 设置几何体attributes属性的位置normal属性
            geometry.attributes.normal = new BufferAttribute(normals, 3) //3个为一组,表示一个顶点的xyz坐标
            // Uint16Array类型数组创建顶点索引数据
            const indexes = new Uint16Array([
                // 0对应第1个顶点位置数据、第1个顶点法向量数据
                // 1对应第2个顶点位置数据、第2个顶点法向量数据
                // 索引值3个为一组，表示一个三角形的3个顶点
                0, 1, 2,
                0, 2, 3
            ])
            // 索引数据赋值给几何体的index属性
            geometry.index = new BufferAttribute(indexes, 1) //1个为一组

            const material = new MeshBasicMaterial({
                color: this.getColor(),
                transparent: true,
                opacity: this.opacity,
                side: DoubleSide
            })
            const plane = new Mesh(geometry, material)
            group.add(plane)
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
        return new CbimMxDbRect()
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
            annotationId: this.annotationId,
            code: this.code,
            layout: this.layout
        }))
        return obj
    }
    getGripPoints() {

    }
    getTypeName(): string {
        return "CbimMxDbRect"
    }
    moveGripPointsAt(index: number, offset: Vector3) {
        return true
    }
}

export async function DrawRectByAction(params, context) {
    context.drawing = true
    const rect = new CbimMxDbRect({
        lineWidth: params.lineWidth || 1,
        color: params.color
    })
    const mxDraw = MxFun.getCurrentDraw()
    do {
        const getPoint = new MrxDbgUiPrPoint();
        getPoint.setMessage("\n指定第一点:");
        let pt1: Vector3 | null = await getPoint.go();
        if (!pt1) break
        rect.pointList.push(pt1)
        rect.pointList.push(pt1)
        // 在点取第二点时，设置动态绘制.
        const worldDrawComment = new McEdGetPointWorldDrawObject();
        worldDrawComment.setDraw((currentPoint: Vector3) => {
            rect.pointList[rect.pointList.length - 1] = currentPoint
            worldDrawComment.drawCustomEntity(rect);
        })
        getPoint.setBasePt(pt1);
        getPoint.setUseBasePt(true);
        getPoint.setUserDraw(worldDrawComment);
        getPoint.setMessage("\n指定第二点:");
        let pt2: Vector3 | null = await getPoint.go();
        if (!pt2) break
        // rect.pt2 = getPoint.value();
        if (!context.batch) {
            context.drawing = false
        }
    } while (context.drawing)
    mxDraw.addMxEntity(rect)
    return rect
}

export async function DrawRectByObj(params) {
    const entity = new CbimMxDbRect({
        color: params.color,
        lineWidth: params.lineWidth,
        code: params.code
    })
    entity.pointList = params.pointList
    const mxDraw = MxFun.getCurrentDraw()
    mxDraw.addMxEntity(entity)
}
