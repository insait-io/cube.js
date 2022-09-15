
// TODO: read the hostname and port from the env.
// const cubeServerHelperHost = process.env.CUBEJS_HELPER_NAME.trim().length > 0 ? process.env.CUBEJS_HELPER_NAME : "localhost"
// const cubeServerHelperPort = (process.env.CUBEJS_HELPER_PORT && parseInt(process.env.CUBEJS_HELPER_PORT, 10)) || 4001
const cubeServerHelperHost = "localhost"
const cubeServerHelperPort = 4001

export const CUBE_SERVER_HELPER_URL = `${cubeServerHelperHost}:${cubeServerHelperPort}`