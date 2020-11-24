import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';

import {
  CellProps,
  ModifierTypes,
  MonthMatrix,
} from './DatePickerTypes';


/**
 * 각 월 별로 캘린더 형태의 7 * week Matrix를 생성하는 함수
 * @param day 값을 받고자 하는 날짜 (dayjs)
 */
export function getMonthMatrix(day: dayjs.Dayjs) {
  const startDate = day.startOf('month');
  const endDate = day.endOf('month');

  const weeks = endDate.diff(startDate, 'week') + 1;
  const dates = endDate.diff(startDate, 'day') + 1;

  const fakeWeeks = [...new Array(7).keys()].map(() => undefined);

  const matrix: MonthMatrix = [...new Array(weeks).keys()]
    .map(() => [...fakeWeeks]);

  [...new Array(dates).keys()].forEach((i) => {
    const date = startDate.add(i, 'day');
    const dayOfWeek = date.day();

    // 다음 연도로 넘어가면 diff가 음수로 나와서 52주를 더해줘야 함
    let week = date.week() - startDate.week();
    if (week < 0) {
      week += 52;
    }

    if (!matrix[week]) {
      matrix[week] = [...fakeWeeks];
    }

    matrix[week][dayOfWeek] = date;
  });

  return matrix;
}

export function addModifiers(
  defaultModifiers: ModifierTypes,
  key: keyof CellProps,
  dateFrom?: dayjs.Dayjs,
  dateTo?: dayjs.Dayjs,
) {
  if (!dateFrom && !dateTo) {
    return defaultModifiers;
  }

  const modifiers = cloneDeep(defaultModifiers);

  [dateFrom, dateTo].forEach((date) => {
    if (!date) { return; }

    const formattedDate = date.format('YYYY-MM-DD');

    if (!modifiers[formattedDate]) {
      Object.assign(modifiers, {
        [formattedDate]: {},
      });
    }

    Object.assign(modifiers[formattedDate], {
      [key]: true,
    });
  });

  if (dateFrom && dateTo) {
    const diff = dateTo.diff(dateFrom, 'day');

    [...new Array(diff).keys()].forEach((i) => {
      const formattedDate = dateFrom
        .add(i, 'day')
        .format('YYYY-MM-DD');

      if (!modifiers[formattedDate]) {
        Object.assign(modifiers, {
          [formattedDate]: {},
        });
      }

      Object.assign(modifiers[formattedDate], {
        [key]: true,
      });
    });
  }

  return modifiers;
}

export function focusDate(
  container: HTMLDivElement | null,
  date: dayjs.Dayjs,
) {
  const element = container
    ?.querySelector(`button[data-date="${date.format('YYYY-MM-DD')}"]`);

  if (element) {
    (element as HTMLButtonElement).focus();
  }
}
