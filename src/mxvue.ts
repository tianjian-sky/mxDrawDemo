import store from "@/store";

class MxVueComandLine {
  // 命令行
  public msCmdText = "";
  public msCmdDisplay = "";
  public msCmdTip = "";

  public mUpDisplayFun: (() => void) | undefined = undefined;
  public mxFunObject = undefined;

  // 命令行更新
  public mountUpDisplayFun =  (fun: (() => void) | undefined) => {
	this.mUpDisplayFun = fun;
  }

  public upDisplay() {

    store.commit('setMsCmdTip', this.msCmdTip);
   
    if (this.mUpDisplayFun == undefined) {
      return;
    }
    this.mUpDisplayFun();
  }

  public setCmdText =  (str: string) => {
   console.log(str)
	this.msCmdText = str;
  }

  public getCmdText =  () => {
	return this.msCmdText;
  }

  public getCmdDisplay =  () => {
	return this.msCmdDisplay;
  }

  public setCmdDisplay =  (str: string) => {
    // console.log(str)
	this.msCmdDisplay = str;
  }

  public addCmdDisplay =  (str: string) => {
	if (this.msCmdDisplay.length > 1024) {
		this.msCmdDisplay = this.msCmdDisplay.substring(this.msCmdDisplay.length - 1024, this.msCmdDisplay.length);
		this.msCmdDisplay = this.msCmdDisplay + str;
	} else {
		this.msCmdDisplay = this.msCmdDisplay + str;
	}
  }

  public setCmdTip =  (str: string) => {
	this.msCmdTip = str;
  }


  public getCmdTip =  () => {
	return this.msCmdTip;
  }
}

const MxInputType = {
  kNoInput : 0,
  kXYCoordInput : 1,
  kDistanceInput : 2,
  kDynTip : 3,
};

const MxInputPostionType = {
  kRelative : 0,    // 相对this.mPos计算。并排放。
  kAbsolutely : 1,  // 绝对位置，指定位置。
};

class MxDynamicInput {
  public mType = MxInputType.kNoInput;
  public mPos = [0, 0];
  public mTip = "";
  public mValue1 = "";
  public mValue1Pos = [0, 0];
  public mValue2 = "";
  public mValue2Pos = [0, 0];
  public misShow = false;

  public mOnKeydownEvent: ((arg0: any) => void) | undefined = undefined;

  public mFocusValue = "";

  public setFocusValue = (value: string) => {
	this.mFocusValue = value;
  }

  public getFocusValue = () => {
	return this.mFocusValue;
  }


  public mountKeydownEvent =  (fun: ((arg0: any) => void) | undefined) => {
	this.mOnKeydownEvent = fun;
  }

  public onKeydown =  (keyCode: any) => {
	if (this.mOnKeydownEvent == undefined) {
		return;
	}
	this.mOnKeydownEvent(keyCode);
  }


  public setType = (type: number) => {
	this.mType = type;
  }

  public getType = () => {
	return this.mType;
  }

  public isShow = () => {
	return this.misShow;
  }

  public setPos = (pos: number[]) => {
	this.mPos = pos;
  }

  public setTip = (tip: string) => {
	this.mTip = tip;
  }

  public setValue1 = (val: string) => {
	this.mValue1 = val;
  }

  public getValue1 = () => {
	return this.mValue1;
  }

  public setValue1Pos = (pos: number[]) => {
	this.mValue1Pos = pos;
  }

  public setValue2 = (val: string) => {
	this.mValue2 = val;
  }

  public getValue2 = () => {
	return this.mValue2;
  }

  public setValue2Pos = (pos: number[]) => {
	this.mValue2Pos = pos;
  }

  public setShow = (isShow: boolean) => {
	this.misShow = isShow;
  }

  public getData = () => {
	if (!this.misShow) {
		return undefined;
	}

	let ret: {
		list: Array<{
			value: string;
			readonly: boolean;
			show?: boolean
			pos?: number[]
		}>;
		pos: number[];
		postype: number;
  } | undefined = {list: [{value: "", readonly: true}, {value: "", readonly: false}, {value: "", readonly: false}], pos: this.mPos, postype: MxInputPostionType.kRelative};
	if (this.mType == MxInputType.kNoInput) {
		return undefined;
	} else if (this.mType == MxInputType.kXYCoordInput) {
		ret.list[0].show = true;
		ret.list[0].value = this.mTip;
		ret.list[0].readonly = true;

		ret.list[1].show = true;
		ret.list[1].value = this.mValue1;
		ret.list[1].readonly = false;

		ret.list[2].show = true;
		ret.list[2].value = this.mValue2;
		ret.list[2].readonly = false;
	} else if (this.mType == MxInputType.kDistanceInput) {
		ret.list[0].show = true;
		ret.list[0].value = this.mTip;
		ret.list[0].readonly = true;


		ret.list[1].show = true;
		ret.list[1].value = this.mValue1;
		ret.list[1].readonly = false;
		ret.list[1].pos = this.mValue1Pos;

		ret.list[2].show = true;
		ret.list[2].value = this.mValue2;
		ret.list[2].readonly = true;
		ret.list[2].pos = this.mValue2Pos;
		ret.postype = MxInputPostionType.kAbsolutely;
	} else if (this.mType == MxInputType.kDynTip) {

		ret.list[0].show = true;
		ret.list[0].value = this.mTip;
		ret.list[0].readonly = true;

		ret.list[1].show = false;
		ret.list[2].show = false;
	} else {
		ret = undefined;
	}
	return ret;
  }
}


const CursorType = {
  kNormal: "cursor3",
  kRect: "cursor1",
  kCross: "cursor2",
};
class MxVueInterface {



  public mSetCoordFun: ((arg0: any) => void) | undefined = undefined;

  public mUpdateCursorFun: (() => void) | undefined = undefined;


  public mOnKeydownEvent: ((arg0: any) => void) | undefined = undefined;

  public mCursorType = CursorType.kNormal;

  public mComandLine = new MxVueComandLine();

  public mdynamicInput = new MxDynamicInput();

  public mMxEvents: {
	[key: string]: Function
  } = {};
  public mxFunObject: any;
  public mFooterData: any;
  public mLinetypeComboxData: any;
  public mTitle: any;
  public mTopButtonBarData: any;
  public mMenuBarData: any;
  public mRighButtonBarData: any;
  public mLeftButtonBarData: any;
  public mTitleButtonBarData: any;
  public mLayerComboxData: any;
  public mColorComboxData: any;

  public mountSetCoordFun =  (fun: ((arg0: any) => void) | undefined) => {
	this.mSetCoordFun = fun;
  }

  public mountUpdateCursorFun =  (fun: (() => void) | undefined) => {
	this.mUpdateCursorFun = fun;
  }


  public mountKeydownEvent =  (fun: ((arg0: any) => void) | undefined) => {
	this.mOnKeydownEvent = fun;
  }



  public onKeydown =  (keyCode: any) => {
	if (this.mOnKeydownEvent == undefined) {
		return;
	}
	this.mOnKeydownEvent(keyCode);
  }



  public setTipCoord =  (str: any) => {

	store.commit('setTipCoord', str);
	if (this.mSetCoordFun == undefined) {
		return;
	}
	this.mSetCoordFun(str);
  }

  public getCursorType =  () => {
	return this.mCursorType;
  }


  public setCursorType =  (curtype: string) => {

	if (typeof (curtype) == "number") {
		switch (curtype) {
		case 0: {
			this.mCursorType = CursorType.kNormal;
			break;
			}

		case 1: {
			this.mCursorType = CursorType.kRect;
			break;
			}
		case 2: {
			this.mCursorType = CursorType.kCross;
			break;
			}
		}
	} else {
		this.mCursorType = curtype;
	}

	if (this.mUpdateCursorFun == undefined) {
		return;
	}
	this.mUpdateCursorFun();
  }



  public getTitle =  () => {
	return this.mTitle;
  }

  public getTopButtonBarData =  () => {
	return this.mTopButtonBarData;
  }

  public getMenuBarData =  () => {
	return this.mMenuBarData;
  }

  public getRighButtonBarData =  () => {
	return this.mRighButtonBarData;
  }

  public getLeftButtonBarData =  () => {
	return this.mLeftButtonBarData;
  }


  public getTitleButtonBarData =  () => {
	return this.mTitleButtonBarData;
  }


  public getLayerComboxData =  () => {
	return this.mLayerComboxData;
  }

  public getColorComboxData =  () => {
	return this.mColorComboxData;
  }


  public getLinetypeComboxData =  () => {
	return this.mLinetypeComboxData;
  }

  public getFooterData =  () => {
	return this.mFooterData;
  }

  public sendStringToExecute =  (sCmd: any) => {
	this.mxFunObject.sendStringToExecute(sCmd);
  }

  public getCmdLine =  () => {
	return this.mComandLine;
  }

  public getDynamicInput = () => {
	return this.mdynamicInput;
  }

  public init =  (mxFun: any) => {
	this.mxFunObject = mxFun;

  }

  public OnMxEvent = (event: { [x: string]: any; }) => {
	const eventName = event.name;
	if (eventName == undefined) {
		return;
	}
	const call = this.mMxEvents[eventName];
	if (call == undefined) {
		return;
	}
	call(event.param);
  }

  public mountMxEvent = (name: string | number, call: any) => {
	this.mMxEvents[name] = call;
  }

}

export default new MxVueInterface();
