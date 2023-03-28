import logger from "log4js"

const logOpt = {
  appenders: {
    consoleLog: { type: "console"},
    fileWarn: { type: "file", filename:"./Debug-logs/warn.log"},
    fileError: { type: "file", filename:"./Debug-logs/error.log"}
  },
  categories: {
    default: { appenders: ["consoleLog"], level: "trace" },
    console: { appenders: ["consoleLog"], level: "info" },
    warning: { appenders: ["fileWarn"], level: "warn" },
    error: { appenders: ["fileError"], level: "error" }
  }
}

logger.configure(logOpt)

const logDefault = logger.getLogger()
const logConsola = logger.getLogger("console")
const logWarning = logger.getLogger("warning")
const logError = logger.getLogger("error")

export default {
  logDefault,
  logConsola,
  logWarning,
  logError
}