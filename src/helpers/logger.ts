const ACTIVE_MODULES: Record<string, Record<string, boolean>> = {
  log: {
    all: false,
  },
  error: {
    all: true,
  },
};

export class LoggerHelper {
  static isLogActive(module: string): boolean {
    if (ACTIVE_MODULES.log.hasOwnProperty(module)) {
      return ACTIVE_MODULES.log[module];
    }

    return ACTIVE_MODULES.log.all;
  }

  static isErrorActive(module: string): boolean {
    if (ACTIVE_MODULES.error.hasOwnProperty(module)) {
      return ACTIVE_MODULES.error[module];
    }

    return ACTIVE_MODULES.error.all;
  }

  static factory = (module: string, ...preffixMsg: any[]) => ({
    log: (...msg: any[]): void => {
      if (!LoggerHelper.isLogActive(module)) {
        return;
      }

      console.log(preffixMsg, msg);
    },
    error: (...msg: any[]): void => {
      if (!LoggerHelper.isErrorActive(module)) {
        return;
      }

      console.error(preffixMsg, msg);
    },
  });
}
