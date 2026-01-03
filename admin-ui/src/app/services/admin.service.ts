import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, AIUsage, DashboardStats, Pagination } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'https://viet-nhat-ky.vercel.app/api/admin'; // Update with your backend URL

  constructor(private http: HttpClient) { }

  // Authentication
  setToken(token: string): void {
    localStorage.setItem('adminToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  clearToken(): void {
    localStorage.removeItem('adminToken');
  }

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard`);
  }

  // Users Management
  getUsers(page: number = 1, limit: number = 20, search: string = ''): Observable<{ users: User[], pagination: Pagination }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<{ users: User[], pagination: Pagination }>(`${this.baseUrl}/users`, { params });
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  createUser(user: Partial<User> & { password: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${id}`, user);
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/users/${id}`);
  }

  // AI Usage Monitoring
  getAIUsage(
    page: number = 1,
    limit: number = 50,
    filters?: {
      userId?: string;
      provider?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Observable<{
    usages: AIUsage[],
    pagination: Pagination,
    statistics: any
  }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (filters) {
      if (filters.userId) params = params.set('userId', filters.userId);
      if (filters.provider) params = params.set('provider', filters.provider);
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
    }

    return this.http.get<{
      usages: AIUsage[],
      pagination: Pagination,
      statistics: any
    }>(`${this.baseUrl}/ai-usage`, { params });
  }
}
