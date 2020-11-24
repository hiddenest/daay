import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import dayjs from 'dayjs';
import { throttle } from 'lodash';

import { Icon } from '@airbridge/component';

import { useMultipleRef } from 'hooks';

import {
  addModifiers,
  focusDate,
} from './DatePickerUtils';

import type {
  DatePickerProps,
  ModifierTypes,
} from './DatePickerTypes';

import DatePickerMonthView from './DatePickerMonthView';

import * as styles from './DatePicker.style';


const enum Cursor {
  start = 'startDate',
  end = 'endDate',
}

const enum NavigationDirection {
  prev = 'prev',
  next = 'next',
}

const KEYBOARD_DATE_MAPPER = {
  ArrowUp: { amount: -1, unit: 'week' },
  ArrowDown: { amount: 1, unit: 'week' },
  ArrowLeft: { amount: -1, unit: 'day' },
  ArrowRight: { amount: 1, unit: 'day' },
} as const;


const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(({
  dateFrom,
  dateTo,
  numberOfMonths = 2,
  pick = 'range',
  isOutsideRange: propsIsOutsideRange = () => false,
}, ref) => {
  const container = useMultipleRef<HTMLDivElement | null>(null, [ref]);
  const interval = useRef<number>();
  const animation = useRef<number>();

  const [baseDate, setBaseDate] = useState(dayjs());

  const isOutsideRange = useCallback((day: dayjs.Dayjs) => (
    propsIsOutsideRange({ day, base: baseDate })
  ), [baseDate, propsIsOutsideRange]);

  const [cursor, setCursor] = useState(Cursor.start);
  const [updateKey, forceUpdate] = useState({});
  const [navigationDirection, setNavigationDirection] = useState<NavigationDirection | undefined>();

  const [startDate, setStartDate] = useState(dateFrom);
  const [endDate, setEndDate] = useState(dateTo);

  const [modifiers, setModifiers] = useState<ModifierTypes>({});
  const [dateRange, setDateRange] = useState(() => {
    const base = dateTo ?? dateFrom ?? dayjs();
    let initialDate = base.startOf('month');

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!isOutsideRange(initialDate)) {
        break;
      }

      initialDate = initialDate.subtract(1, 'month');
    }

    const months = [...new Array(numberOfMonths + 2).keys()].reverse();
    return months.map(i => initialDate.subtract(i - 1, 'month'));
  });


  const handleClickNavigation = useCallback((
    direction: NavigationDirection,
  ) => () => {
    setNavigationDirection(direction);

    window.clearTimeout(animation.current);
    animation.current = window.setTimeout(() => {
      setDateRange((prevDateRange) => {
        let nextDateRange = [...prevDateRange];

        if (direction === 'next') {
          const nextMonth = prevDateRange[prevDateRange.length - 1]
            .clone()
            .add(1, 'month');

          nextDateRange.shift();
          nextDateRange.push(nextMonth);
        }

        if (direction === 'prev') {
          const prevMonth = prevDateRange[0]
            .clone()
            .subtract(1, 'month');

          nextDateRange.pop();
          nextDateRange.unshift(prevMonth);
        }

        setNavigationDirection(undefined);

        nextDateRange = nextDateRange.slice(0, numberOfMonths + 2);
        return nextDateRange;
      });
    }, 250);
  }, [numberOfMonths]);

  const handleClickMonth = useCallback((
    day: dayjs.Dayjs,
  ) => {
    const nextStartDate = day;
    let nextEndDate: typeof endDate;

    if (pick === 'range') {
      nextEndDate = day.endOf('month');

      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (!isOutsideRange(nextEndDate)) {
          break;
        }

        nextEndDate = nextEndDate.subtract(1, 'day');
      }
    }

    setStartDate(nextStartDate);
    setEndDate(nextEndDate);
    forceUpdate({});
  }, [isOutsideRange, pick]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFocusDay = useCallback(throttle((day: dayjs.Dayjs) => {
    if (
      pick === 'range' &&
      startDate &&
      cursor === Cursor.end
    ) {
      let estimatedStartDate = startDate;
      let estimatedEndDate = day;

      if (day.isBefore(startDate)) {
        estimatedStartDate = day;
        estimatedEndDate = startDate;
      }

      let nextModifiers = addModifiers({}, 'range', estimatedStartDate, estimatedEndDate);
      nextModifiers = addModifiers(nextModifiers, 'cursor', startDate);
      setModifiers(nextModifiers);
    }
  }, 16), [startDate, cursor, pick]);

  const handleClickDay = useCallback((day: dayjs.Dayjs) => {
    if (pick === 'single') {
      setStartDate(day);
      setEndDate(undefined);

      const nextModifiers = addModifiers({}, 'cursor', day);
      setModifiers(nextModifiers);
      return;
    }

    if (cursor === Cursor.start) {
      setStartDate(day);
      setEndDate(undefined);
      setCursor(Cursor.end);

      const nextModifiers = addModifiers({}, 'cursor', day);
      setModifiers(nextModifiers);
    }

    if (cursor === Cursor.end) {
      let nextStartDate = startDate;
      let nextEndDate = day;

      // 종료일이 시작일보다 앞서는 경우 위치를 바꿔줌
      if (startDate && day.isBefore(startDate)) {
        nextStartDate = day;
        nextEndDate = startDate;
      }

      setStartDate(nextStartDate);
      setEndDate(nextEndDate);
      setCursor(Cursor.start);
    }
  }, [pick, cursor, startDate]);

  const handleKeyDownDay = useCallback((
    e: KeyboardEvent,
  ) => {
    const { key } = e;
    const target = e.target as HTMLButtonElement;

    if (KEYBOARD_DATE_MAPPER[key]) {
      const currentDate = dayjs(target.getAttribute('data-date') ?? '');
      if (!currentDate.isValid()) {
        return;
      }

      const {
        amount,
        unit,
      } = KEYBOARD_DATE_MAPPER[key];

      const nextDate = currentDate
        .startOf('day')
        .add(amount, unit);

      focusDate(container.current, nextDate);
      return;
    }

    // Home을 눌렀을 때 해당 주의 시작일로,
    // End를 눌렀을 때 해당 주의 마지막일로 이동
    if (key === 'Home' || key === 'End') {
      const currentDate = dayjs(target.getAttribute('data-date') ?? '');
      if (!currentDate.isValid()) {
        return;
      }

      const nextDate = key === 'Home'
        ? currentDate.startOf('week')
        : currentDate.endOf('week');

      focusDate(container.current, nextDate);
    }

    // PageUp을 눌렀을 때 이전 달로,
    // PageDown을 눌렀을 때 다음 달로 이동
    if (key === 'PageUp' || key === 'PageDown') {
      const direction = key === 'PageUp'
        ? NavigationDirection.prev
        : NavigationDirection.next;

      handleClickNavigation(direction)();
    }
  }, [handleClickNavigation]);


  useEffect(() => {
    const weekDiff = baseDate.diff(baseDate.startOf('month'), 'week');
    const nextFocusDate = dateRange[dateRange.length - 2]
      .clone()
      .add(weekDiff, 'week')
      .day(baseDate.day());

    focusDate(container.current, nextFocusDate);
  }, [dateRange]); // eslint-disable-line

  useEffect(() => {
    setCursor(Cursor.start);
  }, [dateFrom, dateTo, pick]);

  useEffect(() => {
    // 1분에 1회씩 기본 날짜를 업데이트하여 화면을 계속 켜도 문제가 없도록 함
    const timeout = (
      (baseDate.endOf('minute').second() + 1) -
      baseDate.second()
    );

    interval.current = window.setTimeout(() => {
      setBaseDate(dayjs());
      window.clearTimeout(interval.current);
    }, timeout * 1000);
  }, [baseDate]);

  useEffect(() => {
    container.current?.addEventListener('keydown', handleKeyDownDay);
  }, [handleKeyDownDay]);

  useEffect(() => {
    if (startDate && endDate) {
      let nextModifiers = addModifiers({}, 'range', startDate, endDate);
      nextModifiers = addModifiers(nextModifiers, 'cursor', startDate);
      nextModifiers = addModifiers(nextModifiers, 'cursor', endDate);

      setModifiers(nextModifiers);
    }
  }, [!!startDate && !!endDate, updateKey]); // eslint-disable-line


  const Navigator = useMemo(() => {
    const [prevMonth] = dateRange;
    const nextMonth = dateRange[dateRange.length - 1];

    return (
      <>
        <styles.Navigator
          disabled={isOutsideRange(prevMonth)}
          position='left'
          type='button'
          onClick={handleClickNavigation(NavigationDirection.prev)}
        >
          <Icon size={14}>arrow_back</Icon>
        </styles.Navigator>
        <styles.Navigator
          disabled={isOutsideRange(nextMonth)}
          position='right'
          type='button'
          onClick={handleClickNavigation(NavigationDirection.next)}
        >
          <Icon size={14}>arrow_forward</Icon>
        </styles.Navigator>
      </>
    );
  }, [
    dateRange,
    handleClickNavigation,
    isOutsideRange,
  ]);

  return (
    <styles.Container
      ref={container}
      aria-modal='true'
      tabIndex={0}
    >
      {Navigator}
      <styles.MonthViewWrapper
        direction={`${navigationDirection ?? ''}`}
        numberOfMonths={numberOfMonths}
      >
        <styles.MonthViewList>
          {dateRange.map(month => (
            <DatePickerMonthView
              key={month.month()}
              isOutsideRange={isOutsideRange}
              modifiers={modifiers}
              month={month}
              pick={pick}
              onClickDay={handleClickDay}
              onClickMonth={handleClickMonth}
              onFocusDay={handleFocusDay}
            />
          ))}
        </styles.MonthViewList>
      </styles.MonthViewWrapper>
    </styles.Container>
  );
});

export default DatePicker;
