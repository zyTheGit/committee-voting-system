import { Injectable } from '@nestjs/common';
import { JwtAuthStrategy } from '../../auth/strategies/jwt-auth.strategy';

@Injectable()
export class OwnerAclService {
  constructor(private readonly jwtAuthStrategy: JwtAuthStrategy) {}

  isOwner(userId: string, ownerId: string): boolean {
    return userId === ownerId;
  }

  canRead(userId: string, ownerId: string): boolean {
    return this.isOwner(userId, ownerId);
  }

  canUpdate(userId: string, ownerId: string): boolean {
    return this.isOwner(userId, ownerId);
  }

  canDelete(userId: string, ownerId: string): boolean {
    return this.isOwner(userId, ownerId);
  }
}