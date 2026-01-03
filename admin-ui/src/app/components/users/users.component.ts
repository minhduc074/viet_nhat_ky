import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { User, Pagination } from '../../models/admin.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  pagination: Pagination | null = null;
  loading = true;
  error: string | null = null;
  searchQuery = '';
  showCreateModal = false;
  editingUser: User | null = null;

  newUser = {
    email: '',
    password: '',
    name: '',
    role: 'user',
    isActive: true
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 1): void {
    this.loading = true;
    this.error = null;
    
    this.adminService.getUsers(page, 20, this.searchQuery).subscribe({
      next: (data) => {
        this.users = data.users;
        this.pagination = data.pagination;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Users error:', err);
      }
    });
  }

  onSearch(): void {
    this.loadUsers(1);
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.newUser = {
      email: '',
      password: '',
      name: '',
      role: 'user',
      isActive: true
    };
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  createUser(): void {
    if (!this.newUser.email || !this.newUser.password) {
      alert('Email and password are required');
      return;
    }

    this.adminService.createUser(this.newUser).subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadUsers();
      },
      error: (err) => {
        alert('Failed to create user: ' + (err.error?.error || err.message));
        console.error('Create error:', err);
      }
    });
  }

  editUser(user: User): void {
    this.editingUser = { ...user };
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  saveUser(): void {
    if (!this.editingUser) return;

    this.adminService.updateUser(this.editingUser.id, {
      name: this.editingUser.name,
      role: this.editingUser.role,
      isActive: this.editingUser.isActive
    }).subscribe({
      next: () => {
        this.editingUser = null;
        this.loadUsers(this.pagination?.page || 1);
      },
      error: (err) => {
        alert('Failed to update user: ' + (err.error?.error || err.message));
        console.error('Update error:', err);
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Are you sure you want to delete user ${user.email}?`)) {
      return;
    }

    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.loadUsers(this.pagination?.page || 1);
      },
      error: (err) => {
        alert('Failed to delete user: ' + (err.error?.error || err.message));
        console.error('Delete error:', err);
      }
    });
  }

  goToPage(page: number): void {
    if (this.pagination && page >= 1 && page <= this.pagination.totalPages) {
      this.loadUsers(page);
    }
  }
}
