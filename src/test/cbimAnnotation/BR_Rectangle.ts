import { MrxDbgUiPrPoint, MrxDbgUiPrBaseReturn, MxThreeJS, MxDbEntity, McGiWorldDraw, MxFun, MxDbRect, McEdGetPointWorldDrawObject } from "mxdraw"
import { Shape, BufferGeometry, Line, LineBasicMaterial, Vector3, Color } from "three";

class CbimMxDbRect extends MxDbEntity {
    /** 圆中心点 */
    public startPoint = new Vector3()
    /** 圆弧上任意一点 */
    public endPoint = new Vector3()
    public color = 0x00ff00
    constructor() {
        super()
    }
    worldDraw(pWorldDraw: McGiWorldDraw): void {
        // 绘制矩形框
        const startPoint = this.startPoint
        const endPoint = this.endPoint
        const color = this.color

        // 给定两个对角点的坐标绘制虚线矩形框
        let rectShape = new Shape()
        rectShape.moveTo(startPoint.x, startPoint.y)
        rectShape.lineTo(endPoint.x, startPoint.y)
        rectShape.lineTo(endPoint.x, endPoint.y)
        rectShape.lineTo(startPoint.x, endPoint.y)
        rectShape.lineTo(startPoint.x, startPoint.y)
        const points = rectShape.getPoints()
        const geometryPoints = new BufferGeometry().setFromPoints(points)
        const line = new Line(geometryPoints, new LineBasicMaterial({
            color,
            linewidth: 1
        }))
        pWorldDraw.drawEntity(line)
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
        return "CbimMxDbCircle"
    }
    moveGripPointsAt(index: number, offset: Vector3) {
        return true
    }
}

export async function DrawRectByAction(params) {
    console.log('DrawRectByAction', params)
    const getPoint = new MrxDbgUiPrPoint();
    getPoint.setMessage("\n指定第一点:");
    let pt1: THREE.Vector3 | null = await getPoint.go();
    if (!pt1) {
        return;
    }
    let rect = new MxDbRect();
    rect.pt1 = pt1;

    // 在点取第二点时，设置动态绘制.
    const worldDrawComment = new McEdGetPointWorldDrawObject();
    worldDrawComment.setDraw((currentPoint: THREE.Vector3) => {
        rect.pt2 = currentPoint;
        worldDrawComment.drawCustomEntity(rect);
    });

    getPoint.setBasePt(pt1);
    getPoint.setUseBasePt(true);

    getPoint.setUserDraw(worldDrawComment);
    getPoint.setMessage("\n指定第二点:");

    let pt2: THREE.Vector3 | null = await getPoint.go();
    if (!pt2) {
        return;
    }
    rect.pt2 = getPoint.value();
    rect.setColor(params.color)
    rect.isSolidColorFill = true;
    rect.opacity = params.opacity || 0.5
    rect.renderOrder = 5;
    rect.setRadius(10);
    MxFun.getCurrentDraw().addMxEntity(rect);
    return rect
}

export async function DrawRectByObj(params) {
    const rect = new MxDbRect();
    const pt1 = params.begin
    const pt2 = params.end
    rect.pt1 = pt1
    rect.pt2 = pt2
    rect.setColor(params.color)
    rect.isSolidColorFill = true;
    rect.opacity = params.opacity || 0.9
    rect.renderOrder = 5;
    rect.setRadius(10);
    MxFun.getCurrentDraw().addMxEntity(rect)
    return rect
}
