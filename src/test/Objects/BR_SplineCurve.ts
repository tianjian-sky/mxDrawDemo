import { MrxDbgUiPrPoint, MrxDbgUiPrBaseReturn, MxDbEntity, McGiWorldDraw, MxFun } from "mxdraw"
import { CatmullRomCurve3, Geometry, LineBasicMaterial,  Line, Vector3 } from "three";

// 样条曲线
class MxDbSplineCurve extends MxDbEntity {
    /** 圆中心点 */ 
    public points:Vector3[] = []
    /** 闭合 */ 
    public closed = false
    /** 曲线的张力 */ 
    public tension = 0.5
    /** 曲线类型： centripetal、chordal和catmullrom */ 
    public curveType = 'centripetal'
    worldDraw(pWorldDraw: McGiWorldDraw): void {
        const curve = new CatmullRomCurve3(this.points, this.closed, 'catmullrom', this.tension);
        const points = curve.getPoints( 15 * this.points.length );
        const geometry = new Geometry().setFromPoints( points );
        const material = new LineBasicMaterial( { color : this.color } );

        const spline = new Line( geometry, material );
        pWorldDraw.drawEntity(spline)
    }
    getGripPoints(): Vector3[] {
       return this.points
    }
    moveGripPointsAt(index: number, offset: Vector3): boolean {

       this.points[index].add(offset)
       return true
    }
    create(): MxDbEntity {
        return new MxDbSplineCurve()
    }
   
    public dwgIn(obj: any) {
        const isVector = (v: any)=> {
            if(v.isVector3 || v.isVector2 || v.isVector4) {
                return true
            }
            return false
        }
        const maparr = (arr:any[])=> {
            return arr.map((v)=> {
                if(typeof v === 'object') {
                    if(isVector(v)) {
                      return v.clone()
                    }else {
                       return forobj(v, {})
                    }
                    
                }
                else if(v instanceof Array) {
                    v = maparr(v)
                }
                return v
            })
        }
          
        const forobj = (obj:any, newObj:any)=> {
            for(let key in obj) {
              if(obj[key]) {
                if(isVector(obj[key])) {
                  newObj[key] = obj[key].clone()
                }else if(typeof obj[key] === 'object') {
                  newObj[key] = forobj(obj[key], {})
                } 
                else if(obj[key] instanceof Array) {
                  newObj[key] = maparr(obj[key])
                }else {
                  newObj[key] = obj[key]
                }
              }
            }
            return newObj
          }
        forobj(obj, this)
        return true
    }
    dwgOut(obj:any) {
          for(let key in this) {
            if(typeof this[key] !== 'function' && key !=='MxDbEntityImp') {
              obj[key] = this[key]
            } 
          }
        return obj
    }
    getTypeName(): string {
        return "MxDbSplineCurve"
    }
    
}

export default function BR_SplineCurve() {
    const getPoint = new MrxDbgUiPrPoint()
    const spline =  new MxDbSplineCurve()
    getPoint.goWhile(async (status)=> {
       
        if(status === MrxDbgUiPrBaseReturn.kOk) {
            spline.points.push(getPoint.value())
            getPoint.setUserDraw((currentPoint, pDraw)=> {
                const mtp = spline.clone() as MxDbSplineCurve
                mtp.points.push(currentPoint)
                pDraw.drawCustomEntity(mtp)
                if(spline.points.length === 0) {
                    getPoint.setMessage("\n指定第一个点:")
                    
                }else {
                    getPoint.setMessage("\n指定下一个点:")
                    getPoint.setKeyWords("[闭合(C)/ 放弃(U)]")
                }
            })
        }else if(status === MrxDbgUiPrBaseReturn.kKeyWord) {
			if (getPoint.isKeyWordPicked('C')) {
                spline.closed = true
                return { exit: true }
            } else if (getPoint.isKeyWordPicked('U')) {
                spline.points.pop()
            }
        }
    }, ()=> {
        MxFun.getCurrentDraw().addMxEntity(spline)
    })
}