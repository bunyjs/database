import {DataSource} from "typeorm";

import {DecoratorType, createDecorator, createMetadata} from "@bunyjs/ioc";

import {createClassRegistry} from "@bunyjs/utility";

import {usable} from "@bunyjs/di";

const dataSourceRegistry = createClassRegistry<DataSource>();

interface DataSourceConfig {
  manualInitializer?: boolean;
  manualShutdown?: boolean;
}

const dataSourceMetadata = createMetadata<DataSourceConfig>();

const dataSource = createDecorator("dataSource", (config?: DataSourceConfig) => ({
  apply: [
    DecoratorType.Class,
  ],
  instance: [
    DataSource,
  ],
  use: [
    usable(),
  ],
  onInit: (context) => {
    dataSourceMetadata.from(context.target).set(config ?? {});

    if (dataSourceRegistry.has(context.target)) {
      return;
    }

    dataSourceRegistry.add(context.target);
  },
}));

export {
  dataSourceRegistry,
  dataSourceMetadata,
};

export {
  dataSource,
};
