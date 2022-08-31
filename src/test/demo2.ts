///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司
//应用包含本软件的程序必须包括以下声明
//在版权声明中：
//此应用程序与成都梦想凯德科技有限公司成协议。
//通过使用本软件、其文档或相关材料
///////////////////////////////////////////////////////////////////////////////
import * as THREE from "three";
import {MrxDbgUiPrPoint,MxDbSVG, MxDbSVGText, MxFun, MxThreeJS } from "mxdraw";


enum MouseButton {
    kInvalid = -1,
    kLeft = 0,
    kMid = 1,
    kRight = 2
  };

// 注册鼠标事件.
let isRegistMouseEvent = false;
function registMouseEvent() {
    if (isRegistMouseEvent) {
        return;
    }
    isRegistMouseEvent = true;

    MxFun.addWindowsEvent((type: string, event: any) => {
       
        if (type == "mousedown") {
            // 如果当前有命令在运行，就不处理鼠标事件。
            if (MxFun.isRunningCommand()) {
                return 0;
            }

            // 只处理鼠标左键按下事件.
           // if (event.button != MouseButton.kLeft) {
            if (event.button != MouseButton.kRight) {
                return 0;
            }

            var srcElement = event.srcElement;
            if (srcElement && srcElement.tagName == "CANVAS") {
                let mxobj = MxFun.getCurrentDraw();
                let pt = new THREE.Vector3(event.offsetX, event.offsetY,0);
                pt = mxobj.screenCoord2Doc(pt.x,pt.y);
                let aryFind = mxobj.findMxEntityAtPoint(pt);

                if (aryFind.length) {
                    event.preventDefault();
                    if(aryFind[0].getTypeName() == "MxDbSVG"){
                        let tag:MxDbSVG = aryFind[0] as MxDbSVG;
                        let txt:MxDbSVGText | null  = tag.getText(0);
                        if(txt){
                            mxobj.resetThreeJSControls();
                            alert(txt.txt);
                        }
                    }
                }

                return 1;
            }
        }
        return 0;
    });
}

let iDrawTagCount = 0;

export function Mx_DrawTag() {
    registMouseEvent();
    // 点取第一点.
    const getPoint = new MrxDbgUiPrPoint();
    getPoint.setMessage("\n指定第一点:");
    getPoint.go((status) => {
        if (status != 0) {
            return;
        }
        const pt = getPoint.value();
       
        let svg = new MxDbSVG();
        svg.setSvgPath(`models/svg/mark.svg`);
        svg.setSvgPostion(pt);
        svg.svgMargin.x = 0.09;
        svg.svgMargin.y = 0.09;
        svg.setSvgAlignmentRatio(new THREE.Vector2(0.5,0.5));
        
        svg.setRenderOrder(20);
        let iSize = 50;
        let svgSize = MxFun.screenCoordLong2Doc(iSize);
        
        svg.setSvgSize(new THREE.Vector2(svgSize,0) );
        iDrawTagCount++;

        let svgTxt1:MxDbSVGText = new MxDbSVGText();
        svgTxt1.txt = "A" + iDrawTagCount;
        let lTextH = MxFun.screenCoordLong2Doc(30);
        svgTxt1.txtPos = new THREE.Vector3(pt.x,pt.y - svgSize * 0.5 - lTextH ,0);
        svgTxt1.txtHeight = lTextH;
        svg.addText(svgTxt1);

        let svgTxt2:MxDbSVGText = new MxDbSVGText();
        svgTxt2.txt = "B" + iDrawTagCount;
        svgTxt2.txtPos = new THREE.Vector3(pt.x,pt.y + svgSize * 0.5 + lTextH * 0.4 ,0);
        svgTxt2.txtHeight = lTextH;
        svg.addText(svgTxt2);

        svg.color = 0XFF0000;
       
        svg.userData = {data:"xxxx"};
        
        /*
        let text = svg.getText(0);
        if(text){
            text.txt = "xxxx";
            text.color = 0X00FF00;
        }*/

    
        MxFun.getCurrentDraw().addMxEntity(svg);
    });
}

export function Mx_DeleteTag(){
    MxFun.selectEnt("选择删除标记对象",{"type":"MxDbSVG"}).then((id:number)=>{
        if(id != 0){
            let mxobj = MxFun.getCurrentDraw();
            mxobj.getMxEntity(id).erase();
        }
    });
}

export function Mx_DeleteTag_A2(){
    let mxobj = MxFun.getCurrentDraw();
    let aryEnt = mxobj.getAllMxEntity();
    aryEnt.forEach((ent)=>{
        if(ent.getTypeName() == "MxDbSVG")
        {
            let tag:MxDbSVG = ent as MxDbSVG;
            let txt:MxDbSVGText | null  = tag.getText(0);

            if(txt && txt.txt == "A2"){
                tag.erase();
                mxobj.updateDisplay();
            }
        }

    });
}

let ptSaveView1:THREE.Vector3|null = null;
let ptSaveView2:THREE.Vector3|null = null;

export function BR_SaveViewport(){
    let mxobj = MxFun.getCurrentDraw();
    let pt1 = new THREE.Vector3(0,0,0);
    let pt2 = new THREE.Vector3(mxobj.getViewWidth(),mxobj.getViewHeight(),0);
    ptSaveView1 = mxobj.screenCoord2Doc(pt1.x,pt1.y);
    ptSaveView2 = mxobj.screenCoord2Doc(pt2.x,pt2.y);
};

export function BR_RestoreViewport(){
    if(ptSaveView1 == null || ptSaveView2 == null) return;
    let mxobj = MxFun.getCurrentDraw();

    mxobj.zoomW(ptSaveView1,ptSaveView2,false);
    mxobj.updateDisplay();
}

export function BR_WriteImage(){
    MxFun.getCurrentDraw().createCanvasImageData((imageData:String)=>{
      let newWindow:any=window.open();
      if(newWindow != null)
      {
        newWindow.document.write('<img src="'+imageData+'"/>');
      }
    },{
      width:1000,
      height:800
    });
}

export function BR_DisabledZoom(){
    let mxobj = MxFun.getCurrentDraw();
    mxobj.enableZoom(false);
}

export function BR_DisabledPan(){
    let mxobj = MxFun.getCurrentDraw();
    mxobj.enablePan(false);
}




  
  