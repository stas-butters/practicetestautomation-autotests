import { test, expect } from '@playwright/test';
import { TablePage } from '../src/pages/TablePage';

test.describe('Practice Test Table — Filtering and Sorting', () => {
  let tablePage: TablePage;

  test.beforeEach(async ({ page }) => {
    tablePage = new TablePage(page);
    await tablePage.open();
  });

  test('TC1: Filtering by Java language displays only Java courses and the Reset button', async () => {
    await expect(tablePage.resetButton).toBeHidden();

    await tablePage.selectLanguage('Java');

    await expect(tablePage.resetButton).toBeVisible();
    const languages = await tablePage.getColumnTexts(3);
    expect(languages.length).toBeGreaterThan(0);
    expect(languages.every((lang) => lang === 'Java')).toBeTruthy();
  });

  test('TC2: Filtering by Beginner level displays only Beginner courses', async () => {
    await tablePage.setLevels(['Beginner']);

    const levels = await tablePage.getColumnTexts(4);
    expect(levels.length).toBeGreaterThan(0);
    expect(levels.every((lvl) => lvl === 'Beginner')).toBeTruthy();
  });

  test('TC3: Filtering by minimum enrollments (10,000+)', async () => {
    await tablePage.selectMinEnrollments('10000');

    const rawEnrollments = await tablePage.getColumnTexts(5);
    const numbers = rawEnrollments.map((val) => Number(val.replace(/,/g, '')));

    expect(numbers.length).toBeGreaterThan(0);
    expect(numbers.every((count) => count >= 10000)).toBeTruthy();
  });

  test('TC4: Combined filtering (Python + Beginner + 10,000+)', async () => {
    await tablePage.selectLanguage('Python');
    await tablePage.setLevels(['Beginner']);
    await tablePage.selectMinEnrollments('10000');

    await expect(tablePage.visibleRows).toHaveCount(1);
    const languages = await tablePage.getColumnTexts(3);
    const levels = await tablePage.getColumnTexts(4);

    expect(languages.every((lang) => lang === 'Python')).toBeTruthy();
    expect(levels.every((lvl) => lvl === 'Beginner')).toBeTruthy();
  });

  test('TC5: Empty search result displays "No matching courses." message', async () => {
    await tablePage.selectLanguage('Python');
    await tablePage.setLevels(['Advanced']);
    await tablePage.selectMinEnrollments('50000');

    await expect(tablePage.visibleRows).toHaveCount(0);
    await expect(tablePage.noDataMessage).toBeVisible();
    await expect(tablePage.noDataMessage).toHaveText('No matching courses.');
  });

  test('TC6: Reset button resets all filters to default state and hides itself', async () => {
    const initialCount = await tablePage.visibleRows.count();

    await tablePage.selectLanguage('Java');
    await tablePage.setLevels(['Intermediate']);
    await expect(tablePage.resetButton).toBeVisible();

    await tablePage.resetFilters();

    await expect(tablePage.resetButton).toBeHidden();
    await expect(tablePage.visibleRows).toHaveCount(initialCount);
  });

  test('TC7: Sorting by Enrollments in ascending order', async () => {
    await tablePage.sortBy('Enrollments');

    const rawEnrollments = await tablePage.getColumnTexts(5);
    const actual = rawEnrollments.map((val) => Number(val.replace(/,/g, '')));
    const expected = [...actual].sort((a, b) => a - b);

    expect(actual).toEqual(expected);
  });

  test('TC8: Sorting by Course Name in alphabetical order', async () => {
    await tablePage.sortBy('Course Name');

    const actualNames = await tablePage.getColumnTexts(2);
    const expectedNames = [...actualNames].sort((a, b) => a.localeCompare(b));

    expect(actualNames).toEqual(expectedNames);
  });
});
