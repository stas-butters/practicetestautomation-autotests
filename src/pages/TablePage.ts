import { Locator, Page } from '@playwright/test';
import { CourseLanguage, CourseLevel, MinEnrollments, SortOption } from '../types/table.types';

export class TablePage {
  readonly page: Page;
  readonly resetButton: Locator;
  readonly noDataMessage: Locator;
  readonly visibleRows: Locator;
  readonly sortSelect: Locator;
  readonly enrollmentsDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.noDataMessage = page.locator('#noData');
    this.visibleRows = page.locator('table tbody tr:visible');
    this.sortSelect = page.locator('#sortBy');
    this.enrollmentsDropdown = page.locator('#enrollDropdown');
  }

  async open(): Promise<void> {
    await this.page.goto('https://practicetestautomation.com/practice-test-table/');
  }

  async selectLanguage(language: CourseLanguage): Promise<void> {
    await this.page.locator(`input[name="lang"][value="${language}"]`).check();
  }

  async setLevels(activeLevels: CourseLevel[]): Promise<void> {
    const allLevels: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
    for (const level of allLevels) {
      const checkbox = this.page.locator(`input[name="level"][value="${level}"]`);
      await checkbox.setChecked(activeLevels.includes(level));
    }
  }

  async selectMinEnrollments(min: MinEnrollments): Promise<void> {
    await this.enrollmentsDropdown.click();
    await this.enrollmentsDropdown.locator(`[data-value="${min}"]`).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption({ label: option });
  }

  async resetFilters(): Promise<void> {
    await this.resetButton.click();
  }

  async getColumnTexts(columnIndex: number): Promise<string[]> {
    const cells = this.visibleRows.locator(`td:nth-child(${columnIndex})`);
    return cells.allInnerTexts();
  }
}
