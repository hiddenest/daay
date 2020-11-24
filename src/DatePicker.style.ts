import styled from '@emotion/styled';
import { colors } from '@airbridge/component';


export const Container = styled.div`
  position: relative;
  display: inline-flex;
  overflow: hidden;
  white-space: nowrap;
`;

export const MonthViewWrapper = styled.div<{
  direction?: string;
  numberOfMonths: number;
}>(({
  direction,
  numberOfMonths,
}) => {
  let transform = 310 * -1;

  if (direction === 'prev') {
    transform = 0;
  }
  if (direction === 'next') {
    transform = 310 * -2;
  }

  return `
    width: ${310 * numberOfMonths}px;
    transform: translateX(${transform}px);

    ${direction ? `
      transition: .25s all ease;
    ` : ''}
  `;
});

export const MonthViewList = styled.div`
  width: 100%;
  white-space: nowrap;
`;

export const Navigator = styled.button<{
  position: 'left' | 'right';
  disabled?: boolean;
}>(({
  position,
  disabled,
}) => `
  position: absolute;
  top: 0;
  ${position}: 0;

  width: 32px;
  height: 28px;
  background-color: ${colors.white};
  border: 1px solid ${colors.lightGray[400]};
  border-radius: 3px;
  line-height: 1;
  z-index: 2;

  ${disabled ? `
    color: ${colors.lightGray[800]};
    cursor: not-allowed;
  ` : `
    color: ${colors.darkGray[400]};
    cursor: pointer;

    &:hover {
      border-color: ${colors.lightGray[800]};
      color: ${colors.darkGray[700]};
    }
  `}
`);

