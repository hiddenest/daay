import dayjs from 'dayjs';

export type MonthMatrix = Array<undefined | dayjs.Dayjs>[];


export type PickType = 'range' | 'single';

export type DatePickerSubProps = {
  pick: PickType;
  isOutsideRange(day: dayjs.Dayjs): boolean;
};

export type CellProps = {
  cursor?: boolean;
  disabled?: boolean;
  highlighted?: boolean;
  hovered?: boolean;
  range?: boolean;
};

export type IsOutsideRangeType = {
  day: dayjs.Dayjs;
  base: dayjs.Dayjs;
};

export type DatePickerProps = {
  dateFrom?: dayjs.Dayjs;
  dateTo?: dayjs.Dayjs;
  numberOfMonths?: number;
  isOutsideRange(prop: IsOutsideRangeType): boolean;
} & Partial<Omit<DatePickerSubProps, 'isOutsideRange'>>;

export type ModifierTypes = {
  [datetime: string]: CellProps;
};
