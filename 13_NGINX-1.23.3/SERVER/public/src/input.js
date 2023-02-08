  import parseArgs from "yargs/yargs"
//import parseArgs from "minimist"

const yargs = parseArgs(process.argv.slice(2))

const { mode, port, debug, _ } = yargs
  .boolean("DEBUG")
  .default({
    mode: "production",
    port: 3000,
    debug: false
  })
  .alias({
    m: "mode",
    p: "port",
    d: "debug"
  })
  .argv

/*   const miniOptions = {
    default: {
      port: 3000,
      mode: "production"
    },
    alias: {
      p: "port",
      m: "mode"
    }
  }
const miniArgs = parseArgs(process.argv, miniOptions)

  export const DOT_ENV = {
    MODE: miniArgs.mode,
    PORT: miniArgs.port
  }
 */

export const DOT_ENV = {
  PORT: port
}
