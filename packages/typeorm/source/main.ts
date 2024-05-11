import {init, shutdown} from "@buny/core";
import {use, usable} from "@buny/di";

import container from "@buny/ioc";

import Logger from "@buny/logger";

import {dataSourceStore} from "./domain/data-source";

interface TypeormConfig {
}

declare module "@buny/config" {
  interface ExtendableConfig {
    typeorm?: TypeormConfig;
  }
}

@usable()
class Typeorm {
  @use()
    logger: Logger;

  @init()
  async init() {
    const dataSourcesModules = dataSourceStore.values();

    for (const dataSourcesModule of dataSourcesModules) {
      this.logger.info(`Initializing data source: ${this.logger.mark(dataSourcesModule.name)}`);
      const dataSource = await container.resolve(dataSourcesModule);
      await dataSource.initialize();
    }
  }

  @shutdown()
  async shutdown() {
    const dataSourcesModules = dataSourceStore.values();

    for (const dataSourcesModule of dataSourcesModules) {
      this.logger.info(`Destroying data source: ${this.logger.mark(dataSourcesModule.name)}`);
      const dataSource = await container.resolve(dataSourcesModule);
      await dataSource.destroy();
    }
  }
}

export * from "./domain/data-source";

export type {
  TypeormConfig,
};

export default Typeorm;
