import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  filename: string;

  @Column({ length: 100, nullable: false })
  mimetype: string;

  @Column({ nullable: false })
  size: number;

  @Column({ length: 255, nullable: false })
  path: string;

  @Column({ length: 255, nullable: true })
  originalname: string;

  @Column({ length: 100, nullable: true })
  extension: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  moduleId: string;

  @Column({ length: 50, nullable: true })
  moduleType: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}