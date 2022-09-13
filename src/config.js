/**
 * @Author jimmyluo
 * @DateTime 2020/7/27
 * @Version 1.0.0
 * @LAST Modified By jimmyluo
 * @LAST Modified Time  2020/7/27
 * @DESC index
 **/
const env = process.env.NODE_ENV
const configs = {
    production: {
        dwgFolder: './public',
    },
    development: {
        dwgFolder: ''
    }
}
export default configs[env]
