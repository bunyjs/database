import {DataSource, Entity, PrimaryGeneratedColumn, Column} from "typeorm";

import {dataSource} from "@buny/typeorm";

import App, {start} from "@buny/core";
import {usable, use} from "@buny/di";

import Config, {Mode} from "@buny/config";

@dataSource()
class MainDataSource extends DataSource {
  constructor(@use() config: Config) {
    super({
      type: "sqlite",
      database: ":memory:",
      synchronize: config.mode === Mode.Development,
      entities: [
        User,
      ],
    });
  }
}

@Entity()
class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;
}

@usable()
class UserService {
  @use()
    mainDataSource: MainDataSource;
}

@usable()
class MyApp extends App {
  @use()
    userService: UserService;

  @start()
  async start() {
    await this.userService.mainDataSource.getRepository(User).save({
      name: "John Doe",
    });

    const users = await this.userService.mainDataSource.getRepository(User).find();

    console.log(users);
  }
}

await MyApp.bootstrap();
