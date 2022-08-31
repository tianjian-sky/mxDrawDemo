import { McGiWorldDraw, MrxDbgUiPrPoint, MxDbEntity, MxFun, MxThreeJS } from "mxdraw";
import { Box3, Box3Helper, Group, Mesh, MeshPhongMaterial, Object3D, Path, Shape, ShapeGeometry, Vector2, Vector3 } from "three";
// 小圆点
function createDots(pt: Vector3) {
    const { x, y, z } = pt
    const shape = new Shape(); //Shape对象
    
    shape.arc(x, y, MxFun.screenCoordLong2Doc(6), 0, 2 * Math.PI, true);
    const path1 = new Path();
    path1.arc(x, y, MxFun.screenCoordLong2Doc(3), 0, 2 * Math.PI, true);
    shape.holes.push(path1);
    const geometry = new ShapeGeometry(shape);
    const material = new MeshPhongMaterial({
        color: "#ff0000",
        transparent: true
    });

    const shape1 = new Shape();
   
    shape1.arc(x, y, MxFun.screenCoordLong2Doc(3), 0, 2 * Math.PI, true);

    const geometry1 = new ShapeGeometry(shape1);
    const material1 = new MeshPhongMaterial({
        color: "#e2da8f",
        transparent: true
    });

    const mesh = new Mesh(geometry, material);
    const mesh1 = new Mesh(geometry1, material1);
    mesh.add(mesh1)
    return mesh
}

class MxDbLeadTag extends MxDbEntity {
    pt1 = new Vector3()
    len = 88
    text = '测试文字 \n asdas \n asdasd'
    textHeight = 12
    worldDraw(pWorldDraw: McGiWorldDraw): void {
       // 创建点
        const dots = createDots(this.pt1)
        pWorldDraw.drawEntity(dots)
        dots.geometry.computeBoundingBox()
        pWorldDraw.drawSelectLine(dots.geometry.boundingBox.max, dots.geometry.boundingBox.min)
        if(pWorldDraw.getType() === 2) {
            return 
        }
        let clen = pWorldDraw.getMxObject().screenCoordLong2Doc(this.len);

        let pt2 = new Vector3(this.pt1.x + clen * 2,this.pt1.y + clen, 0);
        
        
        const offsetX = pt2.x - clen
        const pt = new Vector3(offsetX, pt2.y, pt2.z)

        pWorldDraw.setLineWidth(4)
        pWorldDraw.setColor("#ffe605") 
        pWorldDraw.drawLines([this.pt1, pt, pt2])
        const cth = pWorldDraw.getMxObject().screenCoordLong2Doc(this.textHeight);
        // 文字
        const txtpos = pt2.clone().setX(pt2.x)
        pWorldDraw.setColor(0xffffff)
        const text = MxThreeJS.creatTextSprite(this.text, txtpos, cth, 0, pWorldDraw.getColor())
        if(text) {
            // 计算包围盒
            const box = new Box3()
            const size = new Vector3()
            box.expandByObject(text)
            box.getSize(size)
            // 改变文字位置
            text.position.setX(text.position.x + size.x / 2)

            // 文字线框
            const boxOffsetY = pWorldDraw.getMxObject().screenCoordLong2Doc(10);
            const pt1 = box.min.clone().setX(box.min.x + size.x / 2).setY(box.min.y - boxOffsetY)
            const pt3 = box.max.clone().setX(box.max.x + size.x / 2).setY(box.min.y + boxOffsetY)
            pt3.setY(box.max.y + boxOffsetY)
            const pt2 = new Vector3(pt1.x, pt3.y)
            const pt4 =  new Vector3( pt3.x, pt1.y)
            pWorldDraw.setColor("#ffffff") 
            pWorldDraw.drawLine(pt1, pt2)
            pWorldDraw.drawLine(pt3, pt4)
            pWorldDraw.drawLine(pt1, pt4)
            pWorldDraw.drawLine(pt2, pt3)
            
            // 线框装饰:折线
            const brokenLineOffset = boxOffsetY / 2
            const brolenLine1Points = []
            const brolenLine2Points = []
            brolenLine1Points.push(
                new Vector3(pt2.x +  brokenLineOffset, pt2.y - boxOffsetY, pt2.z),
                new Vector3(pt2.x + brokenLineOffset, pt2.y - brokenLineOffset, pt2.z),
                new Vector3(pt2.x + boxOffsetY, pt2.y - brokenLineOffset, pt2.z)
            )
            brolenLine2Points.push(
                new Vector3(pt4.x -  brokenLineOffset, pt4.y + boxOffsetY, pt4.z),
                new Vector3(pt4.x - brokenLineOffset, pt4.y + brokenLineOffset, pt4.z),
                new Vector3(pt4.x - boxOffsetY, pt4.y + brokenLineOffset, pt4.z)
            )
            pWorldDraw.setLineWidth(2)
            pWorldDraw.drawLines(brolenLine1Points)
            pWorldDraw.drawLines(brolenLine2Points)
            
            // 背景填充
            pWorldDraw.setOpacity(0.5)
            pWorldDraw.setColor('#7fd182')
            pWorldDraw.setRenderOrder(-100)
            pWorldDraw.drawSolid([pt1, pt2, pt3, pt4])
           
            // 添加文字
            
            pWorldDraw.setRenderOrder(100)
            pWorldDraw.drawEntity(text)
        }
        
    }
    
    getGripPoints(): Vector3[] {
        return [this.pt1]
    }
    onViewChange(): boolean {
        this.setNeedUpdateDisplay()
        return true
    }
    moveGripPointsAt(index: number, offset: Vector3): boolean {
        if (index === 0) {
            this.pt1.add(offset)
        }
       
        return true
    }
    dwgIn(obj: any): boolean {
        this.onDwgIn(obj)
        this.dwgInHelp(obj, ['pt1', 'text', 'textHeight', 'len'])
        return true
    }
    dwgOut(obj: any) {
        this.onDwgOut(obj)
        this.dwgOutHelp(obj, ['pt1', 'text', 'textHeight', 'len'])
        return obj
    }
}


export default function BR_LeadTag() {
    const getPoint = new MrxDbgUiPrPoint()
    getPoint.go(async () => {
        const tag = new MxDbLeadTag()
        tag.pt1 = getPoint.value()     
        MxFun.getCurrentDraw().addMxEntity(tag)
    })
}