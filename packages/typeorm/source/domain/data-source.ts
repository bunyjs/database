import {DataSource} from "typeorm";

import {DecoratorType, createDecorator} from "@buny/ioc";
import {usable} from "@buny/di";

const dataSourceStore = new Set<typeof DataSource>();

const dataSource = createDecorator("dataSource", () => ({
  apply: [
    DecoratorType.Class,
  ],
  use: [
    usable(),
  ],
  onInit: (context) => {
    if (dataSourceStore.has(context.target)) {
      return;
    }

    dataSourceStore.add(context.target);
  },
}));

export {
  dataSourceStore,
};

export {
  dataSource,
};
