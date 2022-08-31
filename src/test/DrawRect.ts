///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件及其文档和相关资料归成都梦想凯德科技有限公司
//应用包含本软件的程序必须包括以下声明
//在版权声明中：
//此应用程序与成都梦想凯德科技有限公司成协议。
//通过使用本软件、其文档或相关材料
///////////////////////////////////////////////////////////////////////////////
import * as THREE from "three";
import {
  McEdGetPointWorldDrawObject,
  MrxDbgUiPrPoint,
  MxDbRect,
  MxFun,
} from "mxdraw";

export async function Mx_DrawRect() {
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
  rect.color = new THREE.Color("#665533");
  rect.isSolidColorFill = true;
  rect.opacity = 0.9;
  rect.renderOrder = 5;
  rect.setRadius(10);
  MxFun.getCurrentDraw().addMxEntity(rect);
}
