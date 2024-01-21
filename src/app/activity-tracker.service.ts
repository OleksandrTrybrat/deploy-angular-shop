import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';

interface ActivityLogItem {
  action: string;
  userId: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityTrackerService {
  private activityLog: ActivityLogItem[] = [];
  private blockedUsers: Set<number> = new Set();
  private isUserBlockedSubject = new BehaviorSubject<boolean>(false);
  private isCaptchaBlockedSubject = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private snackBar: MatSnackBar, private userService: UserService) {}

  logActivity(action: string, userId: number) {
    const timestamp = Date.now();
    this.activityLog.push({ action, userId, timestamp });
    console.log(`Logged activity: Action "${action}" for User ID ${userId} at ${new Date(timestamp)}`);
  }

  analyzeActivity(userId: number): boolean {
    const clickThreshold = 3;
    const timeThreshold = 5000;

    const userActivities = this.activityLog.filter(activity => activity.userId === userId);
    if (userActivities.length < clickThreshold) {
      return false;
    }

    const clickIntervals = [];
    for (let i = 1; i < userActivities.length; i++) {
      const interval = userActivities[i].timestamp - userActivities[i - 1].timestamp;
      clickIntervals.push(interval);
    }

    const averageInterval = clickIntervals.reduce((sum, interval) => sum + interval, 0) / clickIntervals.length;
    if (averageInterval < timeThreshold) {
      return true;
    }

    if (userActivities.length > clickThreshold) {
      return true;
    }

    return false;
  }

  blockUser(userId: number): boolean {
    if (this.blockedUsers.has(userId) || this.isCaptchaBlockedSubject.value) {
      return false;
    }

    const blockedUser = this.userService.getUserById(userId);
    if (blockedUser) {
      blockedUser.isBlocked = true;
      this.userService.updateUser(blockedUser);
      this.blockedUsers.add(userId);
      this.isUserBlockedSubject.next(true);
      return true;
    }

    return false;
  }

  setIsUserBlocked(isBlocked: boolean) {
    this.isUserBlockedSubject.next(isBlocked);
  }

  getIsUserBlocked(): Observable<boolean> {
    return this.isUserBlockedSubject.asObservable();
  }
}


