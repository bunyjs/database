import {DataSource, Entity, PrimaryGeneratedColumn, Column} from "typeorm";

import {dataSource} from "@bunyjs/typeorm";

import App, {start} from "@bunyjs/core";
import {usable, use} from "@bunyjs/di";

import Config, {Mode} from "@bunyjs/config";

@Entity()
class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;
}

@dataSource()
class MainDataSource extends DataSource {
  constructor(@use() config: Config) {
    super({
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      dropSchema: true,
      logger: config.mode === Mode.Development ? "debug" : "simple-console",
      entities: [
        User,
      ],
    });
  }
}

@usable()
class UserService {
  @use()
    mainDataSource: MainDataSource;

  get repository() {
    return this.mainDataSource.getRepository(User);
  }

  createUser(name: string) {
    return this.repository.save({
      name,
    });
  }

  getUsers() {
    return this.repository.find();
  }
}

@usable()
class MyApp extends App {
  @use()
    userService: UserService;

  @start()
  async start() {
    await this.userService.createUser("Jane Doe");
    await this.userService.createUser("Black Acre");

    const users = await this.userService.getUsers();

    console.log(users);
  }
}

await MyApp.bootstrap();
