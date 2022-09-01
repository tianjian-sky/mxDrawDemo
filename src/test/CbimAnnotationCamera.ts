///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序与成都梦想凯德科技有限公司成协议。通过使用本软件、其文档或相关材料
///////////////////////////////////////////////////////////////////////////////

export class CbimAnnotationCamera {
    constructor(mxfun) {
        this.mxfun = mxfun
        this.init()
    }

    init() {
        this.mxfun.addCommand('Cbim_DrawingCameraZoom', async (factor) => {
            console.log('Cbim_DrawingCameraZoom', factor)
            this.mxfun.getCurrentDraw().zoomScale(factor)
        })
        this.mxfun.addCommand('Cbim_DrawingCameraReset', async (factor) => {
            this.mxfun.getCurrentDraw().zoomInitialStates()
        })
        this.mxfun.addCommand('Cbim_DrawingCameraRotateLeft', async (factor) => {
            this.mxfun.getCurrentDraw().zoomInitialStates()
        })
        this.mxfun.addCommand('Cbim_DrawingCameraRotateRight', async (factor) => {
            this.mxfun.getCurrentDraw().zoomInitialStates()
        })
    }
}