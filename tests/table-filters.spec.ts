import { test, expect } from '@playwright/test';
import { TablePage } from '../src/pages/TablePage';

test.describe('Practice Test Table — фільтрація та сортування', () => {
  let tablePage: TablePage;

  test.beforeEach(async ({ page }) => {
    tablePage = new TablePage(page);
    await tablePage.open();
  });

  test('TC1: Фільтрація за мовою Java відображає лише курси Java та кнопку Reset', async () => {
    await expect(tablePage.resetButton).toBeHidden();

    await tablePage.selectLanguage('Java');

    await expect(tablePage.resetButton).toBeVisible();
    const languages = await tablePage.getColumnTexts(3);
    expect(languages.length).toBeGreaterThan(0);
    expect(languages.every((lang) => lang === 'Java')).toBeTruthy();
  });

  test('TC2: Фільтрація за рівнем Beginner залишає тільки курси початкового рівня', async () => {
    await tablePage.setLevels(['Beginner']);

    const levels = await tablePage.getColumnTexts(4);
    expect(levels.length).toBeGreaterThan(0);
    expect(levels.every((lvl) => lvl === 'Beginner')).toBeTruthy();
  });

  test('TC3: Фільтрація за мінімальною кількістю студентів (10,000+)', async () => {
    await tablePage.selectMinEnrollments('10000');

    const rawEnrollments = await tablePage.getColumnTexts(5);
    const numbers = rawEnrollments.map((val) => Number(val.replace(/,/g, '')));

    expect(numbers.length).toBeGreaterThan(0);
    expect(numbers.every((count) => count >= 10000)).toBeTruthy();
  });

  test('TC4: Комбінована фільтрація (Python + Beginner + 10,000+)', async () => {
    await tablePage.selectLanguage('Python');
    await tablePage.setLevels(['Beginner']);
    await tablePage.selectMinEnrollments('10000');

    await expect(tablePage.visibleRows).toHaveCount(1);
    const languages = await tablePage.getColumnTexts(3);
    const levels = await tablePage.getColumnTexts(4);

    expect(languages.every((lang) => lang === 'Python')).toBeTruthy();
    expect(levels.every((lvl) => lvl === 'Beginner')).toBeTruthy();
  });

  test('TC5: Порожній результат пошуку відображає повідомлення "No matching courses."', async () => {
    await tablePage.selectLanguage('Python');
    await tablePage.setLevels(['Advanced']);
    await tablePage.selectMinEnrollments('50000');

    await expect(tablePage.visibleRows).toHaveCount(0);
    await expect(tablePage.noDataMessage).toBeVisible();
    await expect(tablePage.noDataMessage).toHaveText('No matching courses.');
  });

  test('TC6: Кнопка Reset скидає всі фільтри до початкового стану та зникає', async () => {
    const initialCount = await tablePage.visibleRows.count();

    await tablePage.selectLanguage('Java');
    await tablePage.setLevels(['Intermediate']);
    await expect(tablePage.resetButton).toBeVisible();

    await tablePage.resetFilters();

    await expect(tablePage.resetButton).toBeHidden();
    await expect(tablePage.visibleRows).toHaveCount(initialCount);
  });

  test('TC7: Сортування за кількістю студентів (Enrollments) за зростанням', async () => {
    await tablePage.sortBy('Enrollments');

    const rawEnrollments = await tablePage.getColumnTexts(5);
    const actual = rawEnrollments.map((val) => Number(val.replace(/,/g, '')));
    const expected = [...actual].sort((a, b) => a - b);

    expect(actual).toEqual(expected);
  });

  test('TC8: Сортування за назвою курсу (Course Name) в алфавітному порядку', async () => {
    await tablePage.sortBy('Course Name');

    const actualNames = await tablePage.getColumnTexts(2);
    const expectedNames = [...actualNames].sort((a, b) => a.localeCompare(b));

    expect(actualNames).toEqual(expectedNames);
  });
});
