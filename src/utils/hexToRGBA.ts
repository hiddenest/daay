import Color from 'color';

/**
 * #HEXCODE의 색상을 rgba() 포맷으로 변환하는 함수
 * @param hexcode rgba() 포맷으로 변환하고자 하는 Hexcode
 * @param alpha 지정하고자 하는 투명도 (alpha 채널, 최대 1)
 */
const hexToRGBA = (
  hexcode: string,
  alpha = 1,
) => {
  const [r, g, b] = Color(hexcode).rgb().array();

  return `rgba(${r},${g},${b},${alpha})`;
};

export default hexToRGBA;
