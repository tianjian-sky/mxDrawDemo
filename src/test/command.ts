import { init as SampleDrawInit} from './draw';
import { init as CommentInit} from './comment';
import { init as SvgInit} from './drawsvg';
import { init as initMxDbEntityEdit} from './MxDbEntityEdit';
import { MyAlignedDimension } from './MeasureDistance';
import { MyArea } from './MeasureArea';
// import { store } from 'mxdraw'
export function RegistMxCommands() {
  SampleDrawInit();
  CommentInit();
  SvgInit();
  initMxDbEntityEdit();
}

// 初化自定义实体的类信息，用数据归档和恢复.
export function RxInitMxEntity(){
  //...
  new MyAlignedDimension().rxInit();
  new MyArea().rxInit();
  
}
