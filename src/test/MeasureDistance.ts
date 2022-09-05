///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序与成都梦想凯德科技有限公司成协议。通过使用本软件、其文档或相关材料
///////////////////////////////////////////////////////////////////////////////
import * as THREE from "three";
import {
    McEdGetPointWorldDrawObject,
    McGiWorldDraw,
    MrxDbgUiPrPoint,
    MxDbAlignedDimension,
    MxDbEntity,
    MxFun,
    McGiWorldDrawType
} from "mxdraw";

export class MyAlignedDimension extends MxDbAlignedDimension {
    [x: string]: any
    constructor() {
        super()
    }
    public getDimText(): string {
        var v2ndPtTo1stPt = new THREE.Vector3(this.point1.x - this.point2.x, this.point1.y - this.point2.y, 0);
        var fLen = v2ndPtTo1stPt.length()
        return fLen.toFixed(3) + "M"
    }

    public create() {
        return this.constructor()
    }

    public getTypeName(): string {
        return this.constructor.name
    }
    public dwgOut(obj: any) {
        for (let key in this) {
            if (typeof this[key] !== 'function' && key !== 'MxDbEntityImp') {
                obj[key] = this[key]
            }

        }

        return obj
    }
    public dwgIn(obj: any) {
        const forarr = (arr: any[], newArr: any[]) => {
            for (let i = 0; i++; i < arr.length) {
                if (arr[i] instanceof Array) {
                    forarr(arr[i], newArr[i])
                } else if (typeof arr[i] === 'object') {
                    forobj(arr[i], newArr[i])
                } else {
                    newArr[i] = arr[i]
                }

            }
        }

        const forobj = (obj: any, newObj: any) => {
            for (let key in obj) {
                if (obj[key].isVector3 || obj[key].isVector2 || obj[key].isVector4) {
                    newObj[key] = obj[key].clone()
                } else if (obj[key] instanceof Array) {
                    forarr(obj[key], this[key])
                } else {
                    newObj[key] = obj[key]
                }
            }
        }
        forobj(obj, this)

        return true
    }
}

export class MxMeasure {
    // 开始尺寸测量.
    public DoDimensionMeasurement() {
        // 让用户在图上点取第一点.
        let myThis = this;
        const getPoint = new MrxDbgUiPrPoint();
        getPoint.setMessage("\n指定第一点:");
        getPoint.go((status) => {
            if (status != 0) {
                return;
            }
            const pt1 = getPoint.value();

            // 定义一个尺寸对象.
            //let dim = new MxDbAlignedDimension();
            let dim = new MyAlignedDimension();

            dim.setPoint1(pt1);
            dim.setColor(0xff22);

            // 在点取第二点时，设置动态绘制.
            const worldDrawComment = new McEdGetPointWorldDrawObject();
            worldDrawComment.setDraw((currentPoint: THREE.Vector3) => {
                // 动态绘制调用。
                dim.setPoint2(currentPoint);
                worldDrawComment.drawCustomEntity(dim);
            });

            getPoint.setBasePt(pt1);

            getPoint.setUseBasePt(true);
            getPoint.setUserDraw(worldDrawComment);
            getPoint.setMessage("\n指定第二点:");

            getPoint.go((status) => {
                if (status != 0) {
                    console.log(status);
                    return;
                }
                // 成功取到第二点.
                const pt2 = getPoint.value();

                // 得到尺寸线的第二个点.
                dim.setPoint2(pt2);

                // 绘制自定义实体到图上.
                MxFun.getCurrentDraw().addMxEntity(dim);

                //计算长度.
                var vec = new THREE.Vector3(pt1.x - pt2.x, pt1.y - pt2.y, 0);
                var dLen = vec.length();
                console.log("测试长度是：" + dLen.toFixed(3));
            });
        });
    }
}
