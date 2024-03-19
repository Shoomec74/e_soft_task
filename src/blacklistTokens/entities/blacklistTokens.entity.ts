import { EntityBoilerplate } from 'src/utils/entityBoilerplate';
import { Column, Entity } from 'typeorm';

@Entity()
export class BlacklistTokens extends EntityBoilerplate {
  @Column({ type: 'varchar', length: 500, unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expirationDate: Date;
}
