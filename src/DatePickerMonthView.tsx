import React, {
  useCallback,
  useMemo,
  useRef,
} from 'react';

import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { colors } from '@airbridge/component';

import { getMonthMatrix } from './DatePickerUtils';

import type {
  CellProps,
  DatePickerSubProps,
  ModifierTypes,
} from './DatePickerTypes';

import DatePickerCell from './DatePickerCell';


type Props = {
  month: dayjs.Dayjs;
  modifiers: ModifierTypes;
  onClickMonth(day: dayjs.Dayjs): void;
  onClickDay(day: dayjs.Dayjs): void;
  onFocusDay(day: dayjs.Dayjs): void;
} & Pick<DatePickerSubProps, 'isOutsideRange' | 'pick'>;


const DAY_OF_THE_WEEK_SHORT = [...new Array(7).keys()]
  .map(i => dayjs().day(i).format('ddd'));


const Container = styled(motion.div)`
  display: inline-block;
  width: 310px;
  vertical-align: top;
  user-select: none;

  &:last-of-type {
    margin-right: 0;
  }
`;

const MonthHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const MonthQuickButton = styled.button(({ disabled }) => `
  display: inline-block;
  padding: 2px 6px;
  font-size: 18px;
  color: ${colors.darkGray[700]};
  border: 1px solid transparent;
  border-radius: 3px;

  ${disabled ? `
    cursor: default;
  ` : `
    cursor: pointer;

    &:hover {
      background-color: ${colors.lightGray[200]};
      border-color: ${colors.lightGray[400]};
    }
  `}
`);

const MonthViewTable = styled.table`
  margin: 0 auto;
  border-collapse: collapse;
`;

const HeaderCell = styled.th`
  vertical-align: top;
  width: 40px;
  padding-bottom: 16px;
  text-align: center;
  font-size: 10px;
  font-weight: normal;
  color: ${colors.darkGray[200]};
  pointer-events: none;
`;


const DatePickerMonthView = ({
  month,
  modifiers,
  pick,
  isOutsideRange,
  onClickMonth,
  onClickDay,
  onFocusDay,
}: Props) => {
  const container = useRef<HTMLTableElement>(null);

  const matrix = useMemo(
    () => getMonthMatrix(month),
    [month],
  );

  const isMonthDisabled = useMemo(() => (
    pick !== 'range' ||
    isOutsideRange(month.startOf('month'))
  ), [isOutsideRange, month, pick]);

  const handleClickAllMonth = useCallback(() => {
    onClickMonth(month);
  }, [month, onClickMonth]);


  const Header = useMemo(() => (
    <thead>
      {DAY_OF_THE_WEEK_SHORT.map(day => (
        <HeaderCell key={day}>
          {day}
        </HeaderCell>
      ))}
    </thead>
  ), []);


  return (
    <Container>
      <MonthHeader>
        <MonthQuickButton
          disabled={isMonthDisabled}
          type='button'
          onClick={handleClickAllMonth}
        >
          {month.format('MM. YYYY')}
        </MonthQuickButton>
      </MonthHeader>
      <MonthViewTable ref={container}>
        {Header}
        <tbody>
          {matrix.map((daysOfWeek, week) => (
            <tr key={week}>
              {daysOfWeek.map((day, i) => {
                let currentModifiers: CellProps = {};
                const formattedDate = day?.format('YYYY-MM-DD') ?? '';

                if (day && modifiers[formattedDate]) {
                  currentModifiers = modifiers[formattedDate];
                }

                const ariaSelected = currentModifiers.cursor;
                const ariaLabel = day
                  ? `${day.format('ddd, MMMM D, YYYY')}`
                  : '';

                return (
                  <DatePickerCell
                    {...currentModifiers}
                    key={i}
                    aria-label={ariaLabel}
                    aria-selected={ariaSelected}
                    day={day}
                    disabled={!day || isOutsideRange(day)}
                    tabIndex={ariaSelected ? 1 : -1}
                    onClick={onClickDay}
                    onFocus={onFocusDay}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </MonthViewTable>
    </Container>
  );
};

export default DatePickerMonthView;
