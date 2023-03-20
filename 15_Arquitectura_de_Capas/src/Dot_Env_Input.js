  import parseArgs from "yargs/yargs"


const yargs = parseArgs(process.argv.slice(2))

const { mode, port, debug, _ } = yargs
  .alias({
    m: "mode",
    p: "port",
    d: "debug"
  })
  .boolean("DEBUG")
  .default({
    mode: "FORK",
    port: 3000,
    debug: false
  })
  .argv

export const DOT_ENV = {
  PORT: port,
  MODE: mode,
  DEBUG: debug
}
