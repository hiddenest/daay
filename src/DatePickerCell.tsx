import React, { useCallback } from 'react';

import dayjs from 'dayjs';
import styled from '@emotion/styled';

import { colors } from '@airbridge/component';

import { hexToRGBA } from 'utils';
import type { CellProps } from './DatePickerTypes';


type BaseProps = {
  day?: dayjs.Dayjs,
  onClick(day: dayjs.Dayjs): void;
  onFocus(day: dayjs.Dayjs): void;
} & CellProps;

type Props = BaseProps &
Omit<React.TdHTMLAttributes<HTMLTableDataCellElement>, 'onFocus' | 'onClick' | 'onKeyDown'> &
Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onKeyDown'>;

type CellBaseProps = {
  border: boolean;
} & CellProps;


const DateCellBase = styled.td<CellBaseProps>(({
  border,
  cursor,
  disabled,
  highlighted,
  hovered,
  range,
}) => `
  width: 40px;
  height: 40px;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  color: ${colors.darkGray[700]};
  box-sizing: border-box;
  background-color: ${colors.white};
  transition: .2s all ease;

  ${border ? `
    border: 1px solid ${colors.lightGray[400]};
    cursor: pointer;

    ${!disabled ? `
      &:hover {
        background-color: ${colors.paleBlue[100]};
      }

      ${(hovered || highlighted) ? `
        background-color: ${colors.paleBlue[100]};
      ` : ''}

      ${range ? `
        background-color: ${colors.blue[200]} !important;
        border-color: ${colors.blue[300]};
      ` : ''}

      ${cursor ? `
        background-color: #249cfd !important;
        border-color: #249cfd;
        color: ${colors.white};
      ` : ''}
    ` : `
      color: ${colors.lightGray[700]};
      cursor: default;
    `}
  ` : ''}
`);

// Component for WAI-ARIA
const TransparentButton = styled.button`
  border: none;
  background: none;
  width: 100%;
  height: 100%;
  color: inherit;
  font: inherit;
  line-height: normal;
  cursor: inherit;

  &:focus {
    box-shadow: 0px 0px 1px 2px ${hexToRGBA('#249cfd', 0.2)};
  }
`;


const DatePickerCell = ({
  day,
  onClick,
  onFocus,
  onKeyDown,
  tabIndex,
  'aria-label': ariaLabel,
  'aria-selected': ariaSelected,
  ...props
}: Props) => {
  const handleFocusCell = useCallback(() => {
    if (day) {
      onFocus?.(day);
    }
  }, [day, onFocus]);

  const handleClickCell = useCallback(() => {
    if (day) {
      onClick?.(day);
    }
  }, [day, onClick]);


  return (
    <DateCellBase
      {...props}
      border={!!day}
    >
      <TransparentButton
        aria-label={ariaLabel}
        aria-selected={ariaSelected}
        data-date={day?.format('YYYY-MM-DD')}
        disabled={props.disabled}
        tabIndex={tabIndex}
        type='button'
        onClick={handleClickCell}
        onFocus={handleFocusCell}
        onKeyDown={onKeyDown}
        onMouseEnter={handleFocusCell}
      >
        {day?.date()}
      </TransparentButton>
    </DateCellBase>
  );
};

export default DatePickerCell;
