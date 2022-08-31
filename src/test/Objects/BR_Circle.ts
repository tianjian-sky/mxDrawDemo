import { MrxDbgUiPrPoint, MrxDbgUiPrBaseReturn , MxThreeJS, MxDbEntity, McGiWorldDraw, MxFun } from "mxdraw"
import { CircleGeometry, LineBasicMaterial, LineLoop, Vector3 } from "three";

class MxDbCircle extends MxDbEntity {
    /** 圆中心点 */ 
    public centerPt = new Vector3()
    /** 圆弧上任意一点 */ 
    public acnode = new Vector3()
    worldDraw(pWorldDraw: McGiWorldDraw): void {
        const radius =  this.acnode.distanceTo(this.centerPt)
        const geometry = new CircleGeometry(radius, 64, 3, 2 * Math.PI)
        const material = new LineBasicMaterial({ color: this.color })
        geometry.vertices.shift()
        const mEnt = new LineLoop(geometry, material)
        mEnt.position.set(this.centerPt.x, this.centerPt.y, this.centerPt.z)
        pWorldDraw.drawEntity(mEnt)
    }
    getGripPoints(): Vector3[] {
       return [this.centerPt, this.acnode]
    }
    moveGripPointsAt(index: number, offset: Vector3): boolean {
        if(index === 0) {
            this.centerPt.add(offset)
            this.acnode.add(offset)
        }else {
            this.acnode.add(offset)
        }
       return true
    }
    create(): MxDbEntity {
        return new MxDbCircle()
    }
   
    public dwgIn(obj: any) {
        this.onDwgIn(obj)
        this.centerPt.copy(obj['centerPt'])
        this.acnode.copy(obj['acnode'])
        return true
    }
    dwgOut(obj:any) {
        this.onDwgOut(obj)
        obj.centerPt = this.centerPt
        obj.acnode = this.acnode
        return obj
    }
    getTypeName(): string {
        return "MxDbCircle"
    }
    
}

export default function BR_Circle() {
    const getPoint = new MrxDbgUiPrPoint()
    getPoint.setMessage("\n指定圆心:")
    getPoint.go(async (status)=> {
        if(status === MrxDbgUiPrBaseReturn.kOk) {
            const circle =  new MxDbCircle()
            circle.centerPt = getPoint.value()
           
            getPoint.setMessage("\n指定圆弧上任意一点:")
            getPoint.setUserDraw((currentPoint, pDraw)=> {
                circle.acnode = currentPoint
                pDraw.drawLine(circle.centerPt, circle.acnode)
                pDraw.drawCustomEntity(circle)
            })
            const acnode = await getPoint.go()
            if(acnode) {
                circle.acnode = acnode
                MxFun.getCurrentDraw().addMxEntity(circle)
            }

        }
    })
}