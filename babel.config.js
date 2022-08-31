module.exports = {
  env:{
    "development":{
      "sourceMaps":true,
      "retainLines":true, 
    }
  },
  presets: [
    '@vue/cli-plugin-babel/preset',

  ],

  // 设置mxdraw库按需加载
  plugins: [
    [
      "import", {
        "libraryName": "mxdraw",
        "libraryDirectory": "dist/lib/MxModule",
        "camel2UnderlineComponentName": false,
        "camel2DashComponentName": false
      }
    ],
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
  

}
