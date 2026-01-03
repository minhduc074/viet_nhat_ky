import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AIUsage, Pagination } from '../../models/admin.models';

@Component({
  selector: 'app-ai-usage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-usage.component.html',
  styleUrls: ['./ai-usage.component.css']
})
export class AiUsageComponent implements OnInit {
  usages: AIUsage[] = [];
  pagination: Pagination | null = null;
  statistics: any = null;
  loading = true;
  error: string | null = null;

  filters = {
    provider: '',
    startDate: '',
    endDate: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAIUsage();
  }

  loadAIUsage(page: number = 1): void {
    this.loading = true;
    this.error = null;

    const filterParams: any = {};
    if (this.filters.provider) filterParams.provider = this.filters.provider;
    if (this.filters.startDate) filterParams.startDate = this.filters.startDate;
    if (this.filters.endDate) filterParams.endDate = this.filters.endDate;
    
    this.adminService.getAIUsage(page, 50, filterParams).subscribe({
      next: (data) => {
        this.usages = data.usages;
        this.pagination = data.pagination;
        this.statistics = data.statistics;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load AI usage data';
        this.loading = false;
        console.error('AI usage error:', err);
      }
    });
  }

  applyFilters(): void {
    this.loadAIUsage(1);
  }

  clearFilters(): void {
    this.filters = {
      provider: '',
      startDate: '',
      endDate: ''
    };
    this.loadAIUsage(1);
  }

  goToPage(page: number): void {
    if (this.pagination && page >= 1 && page <= this.pagination.totalPages) {
      this.loadAIUsage(page);
    }
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  formatPercent(num: number): string {
    return num.toFixed(2) + '%';
  }

  formatTime(ms: number): string {
    return ms.toFixed(0) + ' ms';
  }
}
