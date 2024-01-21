import { Injectable } from '@angular/core';
import { User } from './shared/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private users: User[] = [
    { id: 1, username: 'Пользователь 1', isBlocked: false, blockedUntil: undefined },
  ];

  private userId: number = 1;

  getUserId(): number {
    return this.userId;
  }

  getUserById(userId: number): User | undefined {
    return this.users.find(user => user.id === userId);
  }

  updateUser(user: User): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }

  isUserBlocked(userId: number): boolean {
    const user = this.users.find(user => user.id === userId);
    return user ? user.isBlocked : false;
  }
}
