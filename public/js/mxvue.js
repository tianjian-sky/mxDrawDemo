function MxVueComandLine() {
  // 命令行
  let msCmdText = "";
  let msCmdDisplay = "";
  let msCmdTip = "";

  let mUpDisplayFun = undefined;
  let mxFunObject = undefined;

  // 命令行更新
  this.mountUpDisplayFun = function (fun) {
    mUpDisplayFun = fun;
  }

  this.upDisplay = function () {
    // ?????????
    console.log(msCmdTip);

    if (mUpDisplayFun == undefined) {
      return;
    }
    mUpDisplayFun();
  }

  this.setCmdText = function (str) {
    msCmdText = str;
  }

  this.getCmdText = function () {
    return msCmdText;
  }

  this.getCmdDisplay = function () {
    return msCmdDisplay;
  }

  this.setCmdDisplay = function (str) {
    msCmdDisplay = str;
  }

  this.addCmdDisplay = function (str) {
    if (msCmdDisplay.length > 1024) {
      msCmdDisplay = msCmdDisplay.substring(msCmdDisplay.length - 1024, msCmdDisplay.length);
      msCmdDisplay = msCmdDisplay + str;
    }
    else {
      msCmdDisplay = msCmdDisplay + str;
    }
  }

  this.setCmdTip = function (str) {
    msCmdTip = str;
  }


  this.getCmdTip = function () {
    return msCmdTip;
  }
}

const MxInputType = {
  kNoInput : 0,
  kXYCoordInput : 1,
  kDistanceInput : 2,
  kDynTip : 3
};

const MxInputPostionType = {
  kRelative : 0,    // 相对mPos计算。并排放。
  kAbsolutely : 1  // 绝对位置，指定位置。
};

function MxDynamicInput()
{
  let mType = MxInputType.kNoInput;
  let mPos=[0,0];
  let mTip = "";
  
  let mValue1 = "";
  let mValue1Pos = [0,0];

  let mValue2 = "";
  let mValue2Pos = [0,0];
  

  let misShow = false;

  let mOnKeydownEvent = undefined;

  let mFocusValue = "";
  
  this.setFocusValue = function(value){
    mFocusValue = value;
  }

  this.getFocusValue = function(){
    return mFocusValue;
  }

 
  this.mountKeydownEvent = function (fun) {
    mOnKeydownEvent = fun;
  }

  this.onKeydown = function (keyCode) {
    if (mOnKeydownEvent == undefined) {
      return;
    }
    mOnKeydownEvent(keyCode);
  }
  

  this.setType = function(type){
    mType = type;
  }

  this.getType = function(){
    return mType;
  }

  this.isShow = function(){
    return misShow;
  }

  this.setPos = function(pos){
    mPos = pos;
  }

  this.setTip = function(tip){
    mTip = tip;
  }
  
  this.setValue1 = function(val){
    mValue1 = val;
  }

  this.getValue1 = function(){
    return mValue1;
  }

  this.setValue1Pos = function(pos){
    mValue1Pos = pos;
  }

  this.setValue2 = function(val){
    mValue2 = val;
  }

  this.getValue2 = function(){
    return mValue2;
  }

  this.setValue2Pos = function(pos){
    mValue2Pos = pos;
  }

  this.setShow = function(isShow){
    misShow = isShow;
  }

  this.getData = function(){
    if(!misShow){
      return undefined;
    }

    let ret = {list:[{value:"",readonly:true},{value:"",readonly:false},{value:"",readonly:false}],pos:mPos,postype:MxInputPostionType.kRelative};
    if(mType == MxInputType.kNoInput){
      return undefined;
    }
    else if(mType == MxInputType.kXYCoordInput){
      ret.list[0].show = true;
      ret.list[0].value = mTip;
      ret.list[0].readonly = true;

      ret.list[1].show = true;
      ret.list[1].value = mValue1;
      ret.list[1].readonly = false;

      ret.list[2].show = true;
      ret.list[2].value = mValue2;
      ret.list[2].readonly = false;
    }
    else if(mType == MxInputType.kDistanceInput)
    {
      ret.list[0].show = true;
      ret.list[0].value = mTip;
      ret.list[0].readonly = true;
      

      ret.list[1].show = true;
      ret.list[1].value = mValue1;
      ret.list[1].readonly = false;
      ret.list[1].pos = mValue1Pos;

      ret.list[2].show = true;
      ret.list[2].value = mValue2;
      ret.list[2].readonly = true;
      ret.list[2].pos = mValue2Pos;
      ret.postype = MxInputPostionType.kAbsolutely;
    }
    else if(mType == MxInputType.kDynTip)
    {

      ret.list[0].show = true;
      ret.list[0].value = mTip;
      ret.list[0].readonly = true;

      ret.list[1].show = false;
      ret.list[2].show = false;
    }
    else {
      ret = undefined;
    }
    return ret;
  }
}



function MxVueInterface() {
  
  const CursorType = {
    kNormal: "cursor3",
    kRect: "cursor1",
    kCross: "cursor2"
  }

  let mSetCoordFun = undefined;

  let mUpdateCursorFun = undefined;


  let mOnKeydownEvent = undefined;

  let mCursorType = CursorType.kNormal;

  let mComandLine = new MxVueComandLine();

  let mdynamicInput = new MxDynamicInput();

  let mMxEvents = {};

  this.mountSetCoordFun = function (fun) {
    mSetCoordFun = fun;
  }

  this.mountUpdateCursorFun = function (fun) {
    mUpdateCursorFun = fun;
  }


  this.mountKeydownEvent = function (fun) {
    mOnKeydownEvent = fun;
  }



  this.onKeydown = function (keyCode) {
    if (mOnKeydownEvent == undefined) {
      return;
    }
    mOnKeydownEvent(keyCode);
  }



  this.setTipCoord = function (str) {
    // ??????????
    console.log(str);
    if (mSetCoordFun == undefined) {
      return;
    }
    mSetCoordFun(str);
  }

  this.getCursorType = function () {
    return mCursorType;
  }


  this.setCursorType = function (curtype) {

    if (typeof (curtype) == "number") {
      switch (curtype) {
        case 0:
          {
            mCursorType = CursorType.kNormal;
            break;
          }

        case 1:
          {
            mCursorType = CursorType.kRect;
            break;
          }
        case 2:
          {
            mCursorType = CursorType.kCross;
            break;
          }
      }
    }
    else {
      mCursorType = curtype;
    }

    if (mUpdateCursorFun == undefined) {
      return;
    }
    mUpdateCursorFun();
  }



  this.getTitle = function () {
    return mTitle;
  }

  this.getTopButtonBarData = function () {
    return mTopButtonBarData;
  }

  this.getMenuBarData = function () {
    return mMenuBarData;
  }

  this.getRighButtonBarData = function () {
    return mRighButtonBarData;
  }

  this.getLeftButtonBarData = function () {
    return mLeftButtonBarData;
  }


  this.getTitleButtonBarData = function () {
    return mTitleButtonBarData;
  }


  this.getLayerComboxData = function () {
    return mLayerComboxData;
  }

  this.getColorComboxData = function () {
    return mColorComboxData;
  }


  this.getLinetypeComboxData = function () {
    return mLinetypeComboxData;
  }

  this.getFooterData = function () {
    return mFooterData;
  }

  this.sendStringToExecute = function (sCmd) {
    mxFunObject.sendStringToExecute(sCmd)
  }

  this.getCmdLine = function () {
    return mComandLine;
  }

  this.getDynamicInput = function(){
    return mdynamicInput;
  }

  this.init = function (mxFun) {
    mxFunObject = mxFun;
    
  }

  this.OnMxEvent = function(event){
    let eventName = event["name"];
    if(eventName == undefined){
      return;
    }
    let call = mMxEvents[eventName];
    if(call == undefined){
      return;
    }
    call(event["param"]);
  }

  this.mountMxEvent = function(name,call){
    mMxEvents[name] = call;
  }

}

window["mxvue"] = new MxVueInterface();
