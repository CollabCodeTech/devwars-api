import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import BaseModel from './BaseModel';
import { UserProfile } from './UserProfile';
import { LinkedAccount } from './LinkedAccount';

export enum UserRole {
    PENDING = 'PENDING',
    USER = 'USER',
    MODERATOR = 'MODERATOR',
    ADMIN = 'ADMIN',
}

@Entity('users')
export class User extends BaseModel {
    // ------------------------------------------------------------
    // Columns
    @Column()
    public lastSignIn: Date;

    @Column({ unique: true })
    public email: string;

    @Column({ unique: true })
    public username: string;

    @Column()
    public password: string;

    @Column()
    public role: UserRole;

    @Column({ nullable: true })
    public token: string;

    @Column({ nullable: true })
    public avatarUrl: string;

    // ------------------------------------------------------------
    // Relations
    @OneToOne((type) => UserProfile, (profile) => profile.user)
    public userProfile: UserProfile;

    @OneToMany((type) => LinkedAccount, (link) => link.user)
    public linkedAccount: LinkedAccount;
}
