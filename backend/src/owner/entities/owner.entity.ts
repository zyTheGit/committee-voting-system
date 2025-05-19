import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 200, nullable: false })
  phone: string;

  @Column({ length: 20, nullable: false })
  houseNumber: string;

  @Column({ length: 100, nullable: false })
  idNumber: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}