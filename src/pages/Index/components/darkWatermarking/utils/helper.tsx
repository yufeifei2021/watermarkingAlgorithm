const WATERMARK_POS_HEAD = 1;
const WATERMARK_POS_TAIL = 2;

/**
 * 将字符串转换成二进制字符串，以空格相隔
 */
const strToBinary = (input: string) => {
  const strChar: number[] = [];
  for (let i = 0; i < input.length; i++) {
    strChar.push(input.charCodeAt(i));
  }
  let result = '';
  let tmp = '';
  for (let i = 0; i < strChar.length; i++) {
    // eslint-disable-next-line no-magic-numbers
    tmp = strChar[i].toString(2);
    // eslint-disable-next-line no-magic-numbers
    while (tmp.length < 16) {
      tmp = '0' + tmp;
    }
    result += tmp;
    result += ' ';
  }
  return result.trim();
};

const binstrToIntArray = (binStr: string) => {
  const temp: number[] = [];
  for (let i = 0; i < binStr.length; i++) {
    temp.push(binStr.charCodeAt(i));
  }
  const result = [];
  for (let i = 0; i < temp.length; i++) {
    // eslint-disable-next-line no-magic-numbers
    result.push(temp[i] - 48);
  }
  return result;
};

const binstrToChar = (binStr: string) => {
  const temp = binstrToIntArray(binStr);
  let sum = 0;
  for (let i = 0; i < temp.length; i++) {
    sum += temp[temp.length - 1 - i] << i;
  }
  return String.fromCharCode(sum);
};

const binaryToStr = (input: string) => {
  const tempStr = input.split(' ');
  const tempChar = [];
  for (let i = 0; i < tempStr.length; i++) {
    tempChar[i] = binstrToChar(tempStr[i]);
  }
  return tempChar.join('');
};

const binaryToZeroWidth = (input: string) => {
  const stringArray = input.split(' ');
  let result = '';
  for (let i = 0; i < stringArray.length; i++) {
    for (let j = 0; j < stringArray[i].length; j++) {
      const num = +stringArray[i].charAt(j);
      if (num === 1) {
        result += '\u200b'; // \u200b 零宽度字符（zero-width space)
        // eslint-disable-next-line no-magic-numbers
      } else if (num === 0) {
        result += '\u200c'; // \u200c 零宽度断字符（zero-width non-joiner）
      } else {
        result += '\u200d'; // \u200d 零宽度连字符 (zero-width joiner)
      }
      result += '\ufeff'; // \ufeff 零宽度非断空格符 (zero width no-break space)
    }
  }
  return result;
};

const zeroWidthToBinary = (input: string) => {
  let result = '';
  const binaryStr = input.split('\ufeff');
  for (let i = 0; i < binaryStr.length; i++) {
    if (binaryStr[i] === '\u200b') {
      result += '1';
    } else if (binaryStr[i] === '\u200c') {
      result += '0';
    }
    // eslint-disable-next-line no-magic-numbers
    if ((i + 1) % 16 === 0) {
      result += ' ';
    }
  }
  return result;
};

export const encode = (input: string) => {
  const binary = strToBinary(input);
  const result = binaryToZeroWidth(binary);
  return result;
};

export const decode = (input: string) => {
  const binary = zeroWidthToBinary(input);
  const result = binaryToStr(binary);
  return result;
};

export const addExtractWatermark = (
  src: string,
  waterMark: string,
  pos: number,
) => {
  if (pos === WATERMARK_POS_HEAD) {
    return waterMark + src;
  } else if (pos === WATERMARK_POS_TAIL) {
    return src + waterMark;
  }
  return src;
};

export const extractWaterMark = (input: string, pos: number) => {
  let waterMark = '';
  if (pos === WATERMARK_POS_HEAD) {
    for (let i = 0; i < input.length; i++) {
      if (
        input.charAt(i) !== '\u200b' &&
        input.charAt(i) !== '\u200c' &&
        input.charAt(i) !== '\u200d' &&
        input.charAt(i) !== '\ufeff'
      ) {
        // eslint-disable-next-line no-magic-numbers
        waterMark = input.substring(0, i);
        break;
      }
    }
  } else if (pos === WATERMARK_POS_TAIL) {
    // eslint-disable-next-line no-magic-numbers
    for (let i = input.length - 1; i > 0; i--) {
      if (
        input.charAt(i) !== '\u200b' &&
        input.charAt(i) !== '\u200c' &&
        input.charAt(i) !== '\u200d' &&
        input.charAt(i) !== '\ufeff'
      ) {
        // eslint-disable-next-line no-magic-numbers
        waterMark = input.substring(i + 1);
        break;
      }
    }
  }
  return waterMark;
};
