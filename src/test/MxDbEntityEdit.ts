///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司
//应用包含本软件的程序必须包括以下声明
//在版权声明中：
//此应用程序与成都梦想凯德科技有限公司成协议。
//通过使用本软件、其文档或相关材料
///////////////////////////////////////////////////////////////////////////////
import { MxDbEntity, MxFun } from "mxdraw";
import * as THREE from "three"

function BR_DeleteEntity() {
    let mxObj = MxFun.getCurrentDraw();
    let aryId = mxObj.getMxCurrentSelect();
    if (aryId.length != 0) {
        mxObj.eraseMxEntity(aryId[0]);
        mxObj.updateDisplay();
    }
}

function BR_CopyEntity() {

    let mxObj = MxFun.getCurrentDraw();
    let aryId = mxObj.getMxCurrentSelect();
    if (aryId.length == 0) {
        return;
    }

    let ent: MxDbEntity = mxObj.getMxEntity(aryId[0]);
    let newEnt: MxDbEntity = ent.clone();
    let lDist = mxObj.screenCoordLong2Doc(10);
    let mat = new THREE.Matrix4();
    mat.makeTranslation(lDist, lDist, 0);
    newEnt.transformBy(mat);
    mxObj.addMxEntity(newEnt);
    mxObj.clearMxCurrentSelect();
    mxObj.addMxCurrentSelect(newEnt.objectId());
}

function BR_SetEntityColor(color: any) {
    let mxObj = MxFun.getCurrentDraw();
    let aryId = mxObj.getMxCurrentSelect();
    if (aryId.length == 0) {
        return;
    }

    let ent: MxDbEntity = mxObj.getMxEntity(aryId[0]);
    let iColor = 0xFFFFFF;
    //colors = ['red', 'yellow', 'blue']
    if (color == "yellow") {
        iColor = 0xFFFF00;
    } else if (color == "red") {
        iColor = 0xFF0000;
    }
    else if (color == "blue") {
        iColor = 0x0000FF;
    }
    ent.setColor(iColor);
    ent.setNeedUpdateDisplay();
}

function BR_DditTextEntity() {

    let mxObj = MxFun.getCurrentDraw();
    let aryId = mxObj.getMxCurrentSelect();
    if (aryId.length == 0) {
        return;
    }

    let ent: MxDbEntity = mxObj.getMxEntity(aryId[0]);
    let newEnt: MxDbEntity = ent.clone();
    let lDist = mxObj.screenCoordLong2Doc(10);
    let mat = new THREE.Matrix4();
    mat.makeTranslation(lDist, lDist, 0);
    newEnt.transformBy(mat);
    mxObj.addMxEntity(newEnt);
    mxObj.clearMxCurrentSelect();
    mxObj.addMxCurrentSelect(newEnt.objectId());
}

function BR_Save() {
    let mxObj = MxFun.getCurrentDraw();
    let aryId = mxObj.getMxCurrentSelect();
    const mxcad = MxFun.getCurrentMxCAD()
    console.log('mxcad', mxcad)
    console.warn('br save', mxObj, aryId)
    // let ent: MxDbEntity = mxObj.getMxEntity(aryId[0]);
    // let newEnt: MxDbEntity = ent.clone();
    // let lDist = mxObj.screenCoordLong2Doc(10);
    // let mat = new THREE.Matrix4();
    // mat.makeTranslation(lDist, lDist, 0);
    // newEnt.transformBy(mat);
    // mxObj.addMxEntity(newEnt);
    // mxObj.clearMxCurrentSelect();
    // mxObj.addMxCurrentSelect(newEnt.objectId());
    mxcad.saveFile('/demo/buf/a.dwg', e => {
        console.log(e)
        if (e.succeeded) {
            const url = 'http://localhost:2700' + '/save/demo/buf/a.dwg'
            window.open(url)
        }
    })
}

export function init() {
    MxFun.addCommand('BR_DeleteEntity', BR_DeleteEntity);
    MxFun.addCommand('BR_CopyEntity', BR_CopyEntity);
    MxFun.addCommand('BR_SetEntityColor', BR_SetEntityColor);
    MxFun.addCommand('BR_Save', BR_Save)
}


