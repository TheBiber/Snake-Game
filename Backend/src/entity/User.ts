import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  // חובה שיהיה כתוב export כאן!
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  passwordHash!: string;

  @Column()
  highScore!: string;
}
