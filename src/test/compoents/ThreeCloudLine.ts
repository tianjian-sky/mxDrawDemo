import { color } from "echarts"
import { MxFun } from "mxdraw"
import { 
    Vector2,
    Vector3,
    BufferGeometry,
    Geometry,
    LineBasicMaterial,
    ArcCurve,
    Line,
    Float32BufferAttribute,
    VertexColors,
    Scene,
    Color
 } from "three"
 export function createCloudArcCurvePoints(startPoint:Vector3, endPoint: Vector3, radius?: number) {
     // 计算直线夹角
     function calculateLineAngle(p0:THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3)
     { 
         const deg = Math.PI * 2 / 360
         // 计算直线的角度
         let startAngle = (Math.atan2((p1.y - p0.y), (p1.x - p0.x)) * 180 / Math.PI) * deg
         let endAngle = (Math.atan2((p2.y - p0.y), (p2.x - p0.x)) * 180 / Math.PI) * deg

         return {
           startAngle,
           endAngle
         }
     }
    const center = new Vector3((startPoint.x  + endPoint.x) / 2, (startPoint.y  + endPoint.y) / 2, 0)
    if(!radius) {
        radius = center.distanceTo(startPoint)
    }
    const {  
        startAngle,
        endAngle
    } = calculateLineAngle(center, startPoint,  endPoint)
    const curve  = new ArcCurve(center.x, center.y, radius,startAngle, endAngle, true)
    return curve.getPoints(10)
 }


export function createThreeCloudLine(points: Vector3[] | Vector2[]) {
   
    const geometry = new BufferGeometry()
    setThreeCloudLineColorPoints(geometry, points)
    const material = new LineBasicMaterial( { linewidth: 5, vertexColors: VertexColors} )
    
    const splineObject = new Line( geometry, material )
    splineObject.computeLineDistances()
    return splineObject
}

// 设置point和颜色
export function setThreeCloudLineColorPoints(geometry: BufferGeometry | Geometry,points: Vector3[] | Vector2[], color: Color | number | string = "#ffffff") {
    const colorVal = new Color(color)
    if((geometry as Geometry)?.isGeometry) {
        geometry = geometry as Geometry
        geometry = new BufferGeometry().fromGeometry(geometry)
    }
    // BufferGeometry 设置point和color的方式
    else if((geometry as BufferGeometry).isBufferGeometry){
        const geo1 = geometry as BufferGeometry
        const positions = []
        const colors = []
        for(let i = 0; i < points.length; i++) {
            positions.push( points[i].x, points[i].y, (points[i] as any)?.z || 0)
            colors.push( colorVal.r, colorVal.g, colorVal.b );
        }
        geo1.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ));
        geo1.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );
    }
}
// 取云线圆弧直径处 点坐标
export function getArcDiameterPoint(pt:Vector3, pt1:Vector3, diameter:number) {
    const length = pt.distanceTo(pt1)
    const x = (diameter * (pt1.x - pt.x)) / length + pt.x;
    const y = (diameter * (pt1.y - pt.y)) / length + pt.y;
    return new Vector3(x, y, pt.z)
}


export class CloudLine {
    points3: Vector3[] = []
    points: Vector2[] = []
    colors: number[] = []
    startPoint: Vector3
    oldPt: Vector3
    line!: Line
    radius!: number
    scene?: Scene | null
    isAutoClose!: boolean | undefined
    /**
     * 创建云线实例需要的参数
     * @param scene Three场景
     * @param startPoint 云线开始点
     * @param endPoint 云线结束点
     * @param radius 圆弧半径
     * @param isAutoClose 是否自动闭合
    */
    constructor(scene?: Scene | null, startPoint = new Vector3(), endPoint = new Vector3(), radius:number = MxFun.screenCoordLong2Doc(16), isAutoClose?: boolean) {
        this.startPoint = startPoint
        this.oldPt = startPoint
        this.scene = scene
        this.isAutoClose = isAutoClose
        this.radius = radius
        this.points3.push(startPoint)
        this.to(startPoint, endPoint, radius)
    }
    /**
     * 更新云线圆弧
     * @param pt 半圆弧起始点
     * @param pt1 半圆弧终止
     * @param r 圆弧半径
     * @returns true表示 触发云线闭合
    */
    update(pt: THREE.Vector3, pt1: THREE.Vector3, r: number) {
        const diameter = r * 2
        if((pt.distanceTo(pt1) >= diameter)) {
           
            const newPoint = getArcDiameterPoint(pt, pt1, diameter)
            this.points3.push(newPoint)
            const arcPoints =  createCloudArcCurvePoints(pt, newPoint, r)
            this.points.push(...arcPoints)
            if (!this.line) {
            
              this.line = createThreeCloudLine(this.points)
              this.scene && this.scene.add(this.line)
            } else {
              setThreeCloudLineColorPoints(this.line.geometry, this.points)
            }
            this.oldPt = newPoint.clone()

            if(this.oldPt.distanceTo(this.startPoint) <= r * 2 && this.points.length > 44 && this.isAutoClose) {
                this.addPoints(createCloudArcCurvePoints(this.oldPt, this.startPoint))
                return true
            }
        }
    }

    /**
     * 绘制云线
    * @param startPoint 云线开始点
     * @param endPoint 云线结束点
     * @param radius 圆弧半径
    */
    to(startPoint:Vector3, endPoint:Vector3, radius:number) {
         // 直径
         const diameter = radius * 2
         // 整个线段长度
         const length = startPoint.distanceTo(endPoint)
         // 可以画多少个半圆
         const num = Math.round(length / diameter)
         let i
         let newPoint
         for(i = 0; i < num; i++) {
            newPoint = getArcDiameterPoint(this.oldPt, endPoint, diameter)
            this.points3.push(newPoint)
            this.update(this.oldPt, newPoint, radius)
         }
         return this
    }


    /**
     * 添加顶点
    * @param points 要添加的顶点二维向量数组
    */
    addPoints(points: Vector2[]) {
        this.points.push(...points)
        this.line &&  setThreeCloudLineColorPoints(this.line.geometry, this.points)
    }
    /**
     * 销毁云线(包括Line geometry material)
     * */ 
    destroy() {
        this.scene && this.scene.remove(this.line);
        this.line.geometry.dispose();
        (this.line.material as LineBasicMaterial).dispose()
    }

} 