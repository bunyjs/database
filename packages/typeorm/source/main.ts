import {init, shutdown} from "@bunyjs/core";
import {use, usable} from "@bunyjs/di";

import container from "@bunyjs/ioc";

import Logger from "@bunyjs/logger";

import {dataSourceRegistry, dataSourceMetadata} from "./domain/data-source";

import Config from "@bunyjs/config";

interface TypeormConfig {
  manualInitializer?: boolean;
  manualShutdown?: boolean;
}

declare module "@bunyjs/config" {
  interface ExtendableConfig {
    typeorm?: TypeormConfig;
  }
}

@usable()
class Typeorm {
  @use()
    logger: Logger;

  @use()
    config: Config;

  get typeormConfig() {
    return this.config.typeorm ?? {};
  }

  @init()
  async init() {
    if (this.typeormConfig.manualInitializer) {
      return;
    }

    for (const dataSourceClass of dataSourceRegistry.classes) {
      const config = dataSourceMetadata.get(dataSourceClass);

      if (config.manualInitializer) {
        continue;
      }

      this.logger.info(`Initializing data source: ${this.logger.mark(dataSourceClass.name)}`);

      const dataSource = await container.resolve(dataSourceClass);

      if (dataSource.isInitialized) {
        continue;
      }

      await dataSource.initialize();
    }
  }

  @shutdown()
  async shutdown() {
    if (this.typeormConfig.manualShutdown) {
      return;
    }

    for (const dataSourceClass of dataSourceRegistry.classes) {
      const config = dataSourceMetadata.get(dataSourceClass);

      if (config.manualShutdown) {
        continue;
      }

      this.logger.info(`Destroying data source: ${this.logger.mark(dataSourceClass.name)}`);
      const dataSource = await container.resolve(dataSourceClass);
      await dataSource.destroy();
    }
  }
}

export * from "./domain/data-source";

export type {
  TypeormConfig,
};

export default Typeorm;
