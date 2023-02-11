/* eslint-disable */
/**
 * main.js
 * @param {*} canvasid
 * @param {*} msg
 * @param {*} pass
 * @param {*} mode
 * @returns
 */
export function writeMsgToCanvas(canvasid, msg, pass, mode) {
  mode = mode === undefined ? 0 : parseInt(mode);
  var f = writeMsgToCanvas_base;
  switch (mode) {
    case 1:
      return f(canvasid, msg, pass, true, 23, 2, [2, 9, 16], true, false);
    case 2:
      return f(canvasid, msg, pass, true, 17, 3, [1, 8], true, false);
    case 3:
      return f(canvasid, msg, pass, true, 17, 5, [1, 8], true, false);
    case 4:
      return f(canvasid, msg, pass, true, 5, 5, [0], true, false);
    case 5:
      return f(canvasid, msg, pass, true, 5, 6, [0], true, true);
    case 0:
    default:
      return f(canvasid, msg, pass, false, 1);
  }
}

export function readMsgFromCanvas(canvasid, pass, mode) {
  mode = mode === undefined ? 0 : parseInt(mode);
  var f = readMsgFromCanvas_base;
  switch (mode) {
    case 1:
      return f(canvasid, pass, true, 23, 2, [2, 9, 16], true, false)[1];
    case 2:
      return f(canvasid, pass, true, 17, 3, [1, 8], true, false)[1];
    case 3:
      return f(canvasid, pass, true, 17, 5, [1, 8], true, false)[1];
    case 4:
      return f(canvasid, pass, true, 5, 5, [0], true, false)[1];
    case 5:
      return f(canvasid, pass, true, 5, 6, [0], true, true)[1];
    case 0:
    default:
      return f(canvasid, pass, false, 1)[1];
  }
}

export function loadIMGtoCanvas(currentImg, canvasid, callback, maxSize) {
  maxSize = maxSize === undefined ? 0 : maxSize;
  var f = currentImg;
  var image = new Image();
  image.onload = () => {
    var w = image.width;
    var h = image.height;
    if (maxSize > 0) {
      if (w > maxSize) {
        h = h * (maxSize / w);
        w = maxSize;
      }
      if (h > maxSize) {
        w = w * (maxSize / h);
        h = maxSize;
      }
      w = Math.floor(w);
      h = Math.floor(h);
    }
    var canvas = document.createElement('canvas');
    canvas.id = canvasid;
    canvas.width = w;
    canvas.height = h;
    canvas.style.display = 'none';
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);
    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, w, h);
    callback();
    document.body.removeChild(canvas);
  };
  image.src = f;
}

/**
 * readimg.js
 * @param {*} data_bits
 * @param {*} enc_key
 * @returns
 */
function prepare_read_data(data_bits, enc_key) {
  var data_bits_len = data_bits.length;
  var result = Array(data_bits_len);
  var order = get_hashed_order(enc_key, data_bits_len);
  for (var i = 0; i < data_bits_len; i++) result[i] = data_bits[order[i]];
  return result;
}

function get_bits_lsb(imgData) {
  var result = [];
  for (var i = 0; i < imgData.data.length; i += 4) {
    result.push(imgData.data[i] % 2 == 1 ? 1 : 0);
    result.push(imgData.data[i + 1] % 2 == 1 ? 1 : 0);
    result.push(imgData.data[i + 2] % 2 == 1 ? 1 : 0);
  }
  return result;
}

function get_dct_y(channel_data, channel_width, channel_length, multiply, loc) {
  var row_block = Math.floor(channel_length / 8);
  var col_block = Math.floor(channel_width / 8);
  var num_block_bits = loc.length;
  var result = Array();
  var reference_dct_block;
  for (var i = 0; i < row_block; i++)
    for (var j = 0; j < col_block; j++) {
      var block_y = extract_block(channel_data, 8, i * 8, j * 8, channel_width);
      var dct_y = dct(block_y);
      if (i == 0 && j == 0) {
        reference_dct_block = dct_y;
        continue;
      }
      result.push(
        get_bit_from_quantized(
          multiply,
          loc,
          dct_y.map(function (num, idx) {
            return num - reference_dct_block[idx];
          }),
        ),
      );
    }

  return [].concat.apply([], result);
}

function get_dct_CbCr(
  channel_data,
  channel_width,
  channel_length,
  multiply,
  loc,
) {
  var row_block = Math.floor(channel_length / 16);
  var col_block = Math.floor(channel_width / 16);
  var num_block_bits = loc.length;
  var result = Array();
  var reference_dct_block;
  for (var i = 0; i < row_block; i++)
    for (var j = 0; j < col_block; j++) {
      var block_y = extract_block(
        channel_data,
        16,
        i * 16,
        j * 16,
        channel_width,
      );
      block_y = img_16x16_to_8x8(block_y);
      var dct_y = dct(block_y);
      if (i == 0 && j == 0) {
        reference_dct_block = dct_y;
        continue;
      }
      result.push(
        get_bit_from_quantized(
          multiply,
          loc,
          dct_y.map(function (num, idx) {
            return num - reference_dct_block[idx];
          }),
        ),
      );
    }
  return [].concat.apply([], result);
}

function get_bits_dct(
  imgData,
  channel_width,
  channel_length,
  multiply,
  loc,
  use_y,
  use_downsampling,
) {
  var y = [],
    cb = [],
    cr = [],
    result = Array();
  for (var i = 0; i < imgData.data.length; i += 4) {
    var ycbcr = rgb2ycbcr(
      imgData.data[i],
      imgData.data[i + 1],
      imgData.data[i + 2],
    );
    y.push(ycbcr[0]);
    cb.push(ycbcr[1]);
    cr.push(ycbcr[2]);
  }
  if (use_y)
    result.push(get_dct_y(y, channel_width, channel_length, multiply, loc));
  var cbcr_func = use_downsampling ? get_dct_CbCr : get_dct_y;
  result.push(cbcr_func(cb, channel_width, channel_length, multiply, loc));
  result.push(cbcr_func(cr, channel_width, channel_length, multiply, loc));

  return [].concat.apply([], result);
}

export function readMsgFromCanvas_base(
  canvasid,
  enc_key,
  use_dct,
  num_copy,
  multiply,
  loc,
  use_y,
  use_downsampling,
) {
  use_dct = use_dct === undefined ? false : use_dct;
  enc_key = enc_key === undefined ? '' : enc_key;
  num_copy = num_copy === undefined ? 5 : num_copy;
  multiply = multiply === undefined ? 30 : multiply;
  loc = loc === undefined ? [1, 2, 8, 9, 10, 16, 17] : loc;
  use_y = use_y === undefined ? true : use_y;
  use_downsampling = use_downsampling === undefined ? true : use_downsampling;
  var c, ctx, imgData;
  try {
    c = document.getElementById(canvasid);
    ctx = c.getContext('2d');
    imgData = ctx.getImageData(0, 0, c.width, c.height);
  } catch (err) {
    return [false, err];
  }
  try {
    var bits_stream = use_dct
      ? get_bits_dct(
          imgData,
          c.width,
          c.height,
          multiply,
          loc,
          use_y,
          use_downsampling,
        )
      : get_bits_lsb(imgData);
    bits_stream = prepare_read_data(bits_stream, enc_key);
    var msg = bits_to_str(bits_stream, num_copy);
    if (msg == null)
      return [
        false,
        'Message does not decrypt. Maybe due to (1) wrong password / enc method. (2) corrupted file',
      ];
    return [true, msg];
  } catch (err) {
    return [
      false,
      'Message does not decrypt. Maybe due to (1) wrong password / enc method. (2) corrupted file',
    ];
  }
}

/**
 * setimg.js
 * @param {*} data_bits
 * @param {*} enc_key
 * @param {*} encode_len
 * @returns
 */
function prepare_write_data(data_bits, enc_key, encode_len) {
  var data_bits_len = data_bits.length;
  if (data_bits.length > encode_len) throw 'Can not hold this many data!';
  var result = Array(encode_len);
  for (var i = 0; i < encode_len; i++) {
    result[i] = Math.floor(Math.random() * 2); //obfuscation
  }
  var order = get_hashed_order(enc_key, encode_len);
  for (var i = 0; i < data_bits_len; i++) result[order[i]] = data_bits[i];
  return result;
}

function write_dct_y(
  channel_data,
  channel_width,
  channel_length,
  setdata,
  multiply,
  loc,
) {
  var row_block = Math.floor(channel_length / 8);
  var col_block = Math.floor(channel_width / 8);
  var num_block_bits = loc.length;
  if (num_block_bits * (row_block * col_block - 1) != setdata.length)
    throw 'Image size does not match data size (Y channel)';
  var reference_dct_block;
  for (var i = 0; i < row_block; i++)
    for (var j = 0; j < col_block; j++) {
      var block_y = extract_block(channel_data, 8, i * 8, j * 8, channel_width);
      var dct_y = dct(block_y);
      if (i == 0 && j == 0) {
        reference_dct_block = dct_y;
        continue;
      }
      var dct_diff = dct_y.map(function (num, idx) {
        return num - reference_dct_block[idx];
      });
      var qdiff = quantize_diff(
        multiply,
        loc,
        dct_diff,
        setdata.slice(
          num_block_bits * (i * col_block + j - 1),
          num_block_bits * (i * col_block + j),
        ),
      );
      dct_y = dct_y.map(function (num, idx) {
        return num + qdiff[idx];
      });
      block_y = idct(dct_y);
      replace_block(channel_data, 8, i * 8, j * 8, channel_width, block_y);
    }
}

function write_dct_CbCr(
  channel_data,
  channel_width,
  channel_length,
  setdata,
  multiply,
  loc,
) {
  var row_block = Math.floor(channel_length / 16);
  var col_block = Math.floor(channel_width / 16);
  var num_block_bits = loc.length;
  if (num_block_bits * (row_block * col_block - 1) != setdata.length)
    throw 'Image size does not match data size (CbCr channel)';
  var reference_dct_block;

  for (var i = 0; i < row_block; i++)
    for (var j = 0; j < col_block; j++) {
      var block_y = extract_block(
        channel_data,
        16,
        i * 16,
        j * 16,
        channel_width,
      );
      var block_y_8x8 = img_16x16_to_8x8(block_y);
      var dct_y = dct(block_y_8x8);
      if (i == 0 && j == 0) {
        reference_dct_block = dct_y;
        continue;
      }
      var dct_diff = dct_y.map(function (num, idx) {
        return num - reference_dct_block[idx];
      });
      var qdiff = quantize_diff(
        multiply,
        loc,
        dct_diff,
        setdata.slice(
          num_block_bits * (i * col_block + j - 1),
          num_block_bits * (i * col_block + j),
        ),
      );
      dct_y = dct_y.map(function (num, idx) {
        return num + qdiff[idx];
      });
      var block_y_stego = idct(dct_y);
      var stego_diff = block_y_stego.map(function (num, idx) {
        return num - block_y_8x8[idx];
      });
      stego_diff = img_8x8_to_16x16(stego_diff);
      block_y = block_y.map(function (num, idx) {
        return num + stego_diff[idx];
      });
      replace_block(channel_data, 16, i * 16, j * 16, channel_width, block_y);
    }
}

function write_lsb(imgData, setdata) {
  function unsetbit(k) {
    return k % 2 == 1 ? k - 1 : k;
  }
  function setbit(k) {
    return k % 2 == 1 ? k : k + 1;
  }
  var j = 0;
  for (var i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = setdata[j]
      ? setbit(imgData.data[i])
      : unsetbit(imgData.data[i]);
    imgData.data[i + 1] = setdata[j + 1]
      ? setbit(imgData.data[i + 1])
      : unsetbit(imgData.data[i + 1]);
    imgData.data[i + 2] = setdata[j + 2]
      ? setbit(imgData.data[i + 2])
      : unsetbit(imgData.data[i + 2]);
    imgData.data[i + 3] = 255;
    j += 3;
  }
}

function dct_data_capacity(
  channel_width,
  channel_length,
  loc,
  use_y,
  use_downsampling,
) {
  var y_data_len = use_y
    ? (Math.floor(channel_length / 8) * Math.floor(channel_width / 8) - 1) *
      loc.length
    : 0;
  var cblock = use_downsampling ? 16 : 8;
  var cbcr_data_len =
    (Math.floor(channel_length / cblock) * Math.floor(channel_width / cblock) -
      1) *
    loc.length;
  return [y_data_len, cbcr_data_len];
}

function write_dct(
  imgData,
  channel_width,
  channel_length,
  setdata,
  multiply,
  loc,
  use_y,
  use_downsampling,
) {
  var data_capacity = dct_data_capacity(
    channel_width,
    channel_length,
    loc,
    use_y,
    use_downsampling,
  );
  var y_data_len = data_capacity[0];
  var cbcr_data_len = data_capacity[1];
  var y = Array(),
    cb = Array(),
    cr = Array();
  for (var i = 0; i < imgData.data.length; i += 4) {
    var ycbcr = rgb2ycbcr(
      imgData.data[i],
      imgData.data[i + 1],
      imgData.data[i + 2],
    );
    y.push(ycbcr[0]);
    cb.push(ycbcr[1]);
    cr.push(ycbcr[2]);
  }
  if (use_y)
    write_dct_y(
      y,
      channel_width,
      channel_length,
      setdata.slice(0, y_data_len),
      multiply,
      loc,
    );
  var cbcr_func = use_downsampling ? write_dct_CbCr : write_dct_y;

  cbcr_func(
    cb,
    channel_width,
    channel_length,
    setdata.slice(y_data_len, y_data_len + cbcr_data_len),
    multiply,
    loc,
  );
  cbcr_func(
    cr,
    channel_width,
    channel_length,
    setdata.slice(
      y_data_len + cbcr_data_len,
      y_data_len + cbcr_data_len + cbcr_data_len,
    ),
    multiply,
    loc,
  );
  var j = 0;
  for (var i = 0; i < imgData.data.length; i += 4) {
    var rgb = ycbcr2rgb(y[j], cb[j], cr[j]);
    imgData.data[i] = rgbclip(rgb[0]);
    imgData.data[i + 1] = rgbclip(rgb[1]);
    imgData.data[i + 2] = rgbclip(rgb[2]);
    j += 1;
  }
}

export function writeMsgToCanvas_base(
  canvasid,
  msg,
  enc_key,
  use_dct,
  num_copy,
  multiply,
  loc,
  use_y,
  use_downsampling,
) {
  use_dct = use_dct === undefined ? false : use_dct;
  enc_key = enc_key === undefined ? '' : enc_key;
  num_copy = num_copy === undefined ? 5 : num_copy;
  multiply = multiply === undefined ? 30 : multiply;
  loc = loc === undefined ? [1, 2, 8, 9, 10, 16, 17] : loc;
  use_y = use_y === undefined ? true : use_y;
  use_downsampling = use_downsampling === undefined ? true : use_downsampling;
  try {
    var c = document.getElementById(canvasid);
    var ctx = c.getContext('2d');
    var imgData = ctx.getImageData(0, 0, c.width, c.height);
    var encode_len = Math.floor(imgData.data.length / 4) * 3;
    if (use_dct) {
      var cap = dct_data_capacity(
        c.width,
        c.height,
        loc,
        use_y,
        use_downsampling,
      );
      encode_len = cap[0] + 2 * cap[1];
    }
    var bit_stream = str_to_bits(msg, num_copy);
    bit_stream = prepare_write_data(bit_stream, enc_key, encode_len);
    if (use_dct) {
      write_dct(
        imgData,
        c.width,
        c.height,
        bit_stream,
        multiply,
        loc,
        use_y,
        use_downsampling,
      );
    } else write_lsb(imgData, bit_stream);
    ctx.putImageData(imgData, 0, 0);
    return true;
  } catch (err) {
    return err;
  }
}

/**
 * utf_8.js
 * @param {*} bytes
 * @returns
 */
function utf8Decode(bytes) {
  var chars = [],
    offset = 0,
    length = bytes.length,
    c,
    c2,
    c3;
  while (offset < length) {
    c = bytes[offset];
    c2 = bytes[offset + 1];
    c3 = bytes[offset + 2];
    if (128 > c) {
      chars.push(String.fromCharCode(c));
      offset += 1;
    } else if (191 < c && c < 224) {
      chars.push(String.fromCharCode(((c & 31) << 6) | (c2 & 63)));
      offset += 2;
    } else {
      chars.push(
        String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)),
      );
      offset += 3;
    }
  }
  return chars.join('');
}

function utf8Encode(str) {
  var bytes = [],
    offset = 0,
    length,
    char;
  str = encodeURI(str);
  length = str.length;
  while (offset < length) {
    char = str[offset];
    offset += 1;
    if ('%' !== char) {
      bytes.push(char.charCodeAt(0));
    } else {
      char = str[offset] + str[offset + 1];
      bytes.push(parseInt(char, 16));
      offset += 2;
    }
  }
  return bytes;
}

/**
 * utils.js
 * @param {*} r
 * @param {*} g
 * @param {*} b
 * @returns
 */
function rgb2ycbcr(r, g, b) {
  return [
    0.299 * r + 0.587 * g + 0.114 * b,
    128 - 0.168736 * r - 0.331264 * g + 0.5 * b,
    128 + 0.5 * r - 0.418688 * g - 0.081312 * b,
  ];
}

function ycbcr2rgb(y, cb, cr) {
  return [
    y + 1.402 * (cr - 128),
    y - 0.344136 * (cb - 128) - 0.714136 * (cr - 128),
    y + 1.772 * (cb - 128),
  ];
}

function get_hashed_order(password, arr_len) {
  var orders = Array.from(Array(arr_len).keys());
  var result = [];
  var loc;
  var seed = CryptoJS.SHA512(password).words.reduce(function (total, num) {
    return total + Math.abs(num);
  }, 0);
  var rnd = new MersenneTwister(seed);
  for (var i = arr_len; i > 0; i--) {
    loc = rnd.genrand_int32() % i;
    result.push(orders[loc]);
    orders[loc] = orders[i - 1];
  }
  return result;
}

function dct(dataArray) {
  var result = Array(64).fill(0);
  var cu, cv, sum;
  for (var u = 0; u < 8; u++)
    for (var v = 0; v < 8; v++) {
      cu = u == 0 ? 1 / Math.sqrt(2) : 1;
      cv = v == 0 ? 1 / Math.sqrt(2) : 1;
      sum = 0;
      for (var x = 0; x < 8; x++)
        for (var y = 0; y < 8; y++) {
          sum +=
            dataArray[x * 8 + y] *
            Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
            Math.cos(((2 * y + 1) * v * Math.PI) / 16);
        }
      result[u * 8 + v] = (1 / 4) * cu * cv * sum;
    }
  return result;
}

function idct(dataArray) {
  const result = Array(64).fill(0);
  var cu, cv, sum;
  for (var x = 0; x < 8; x++)
    for (var y = 0; y < 8; y++) {
      sum = 0;
      for (var u = 0; u < 8; u++)
        for (var v = 0; v < 8; v++) {
          cu = u == 0 ? 1 / Math.sqrt(2) : 1;
          cv = v == 0 ? 1 / Math.sqrt(2) : 1;
          sum +=
            cu *
            cv *
            dataArray[u * 8 + v] *
            Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
            Math.cos(((2 * y + 1) * v * Math.PI) / 16);
        }
      result[x * 8 + y] = (1 / 4) * sum;
    }

  return result;
}

function quantization_matrix(multiply) {
  var Q = [
    16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16,
    24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109,
    103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120,
    101, 72, 92, 95, 98, 112, 100, 103, 99,
  ];
  for (var i = 0; i < 64; i++) {
    Q[i] *= multiply;
  }
  return Q;
}

function quantize_diff(multiply, loc, mat, encode_bits) {
  if (loc.length != encode_bits.length)
    throw 'LOC and ENCODE_BITS have different sizes! This is a bug in code!';
  var Q = quantization_matrix(multiply);
  var result = Array(64).fill(0);
  var div_Q, low, high;
  for (var i = 0; i < loc.length; i++) {
    div_Q = mat[loc[i]] / Q[loc[i]];
    low = Math.floor(div_Q);
    if (Math.abs(low % 2) != encode_bits[i]) low -= 1;
    high = Math.ceil(div_Q);
    if (Math.abs(high % 2) != encode_bits[i]) high += 1;
    if (div_Q - low > high - div_Q) low = high;
    result[loc[i]] = low * Q[loc[i]] - mat[loc[i]];
  }
  return result;
}

function get_bit_from_quantized(multiply, loc, quantized_mat) {
  var Q = quantization_matrix(multiply);
  var result = [];
  for (var i = 0; i < loc.length; i++) {
    result.push(Math.abs(Math.round(quantized_mat[loc[i]] / Q[loc[i]]) % 2));
  }
  return result;
}

function img_16x16_to_8x8(mat) {
  var result = Array(64);
  for (var i = 0; i < 8; i++)
    for (var j = 0; j < 8; j++) {
      result[i * 8 + j] =
        (mat[i * 2 * 8 + j * 2] +
          mat[(i * 2 + 1) * 8 + j * 2] +
          mat[i * 2 * 8 + j * 2 + 1] +
          mat[(i * 2 + 1) * 8 + j * 2 + 1]) /
        4;
    }
  return result;
}

function img_8x8_to_16x16(mat) {
  var result = Array(256);
  for (var i = 0; i < 16; i++)
    for (var j = 0; j < 16; j++) {
      result[i * 16 + j] = mat[Math.floor(i / 2) * 8 + Math.floor(j / 2)];
    }
  return result;
}

function rgbclip(a) {
  a = Math.round(a);
  a = a > 255 ? 255 : a;
  return a < 0 ? 0 : a;
}

function str_to_bits(str, num_copy) {
  var utf8array = utf8Encode(str);
  var result = Array();
  var utf8strlen = utf8array.length;
  for (var i = 0; i < utf8strlen; i++) {
    for (var j = 128; j > 0; j = Math.floor(j / 2)) {
      if (Math.floor(utf8array[i] / j)) {
        for (var cp = 0; cp < num_copy; cp++) result.push(1);
        utf8array[i] -= j;
      } else for (var cp = 0; cp < num_copy; cp++) result.push(0);
    }
  }
  for (var j = 0; j < 24; j++)
    for (var i = 0; i < num_copy; i++) {
      result.push(1);
    }
  return result;
}

function bits_to_str(bitarray, num_copy) {
  function merge_bits(bits) {
    var bits_len = bits.length;
    var bits_sum = 0;
    for (var i = 0; i < bits_len; i++) bits_sum += bits[i];
    return Math.round(bits_sum / bits_len);
  }
  var msg_array = Array();
  var data, tmp;
  var msg_array_len = Math.floor(Math.floor(bitarray.length / num_copy) / 8);
  for (var i = 0; i < msg_array_len; i++) {
    data = 0;
    tmp = 128;
    for (var j = 0; j < 8; j++) {
      data +=
        merge_bits(
          bitarray.slice((i * 8 + j) * num_copy, (i * 8 + j + 1) * num_copy),
        ) * tmp;
      tmp = Math.floor(tmp / 2);
    }
    if (data == 255) break; 
    msg_array.push(data);
  }
  return utf8Decode(msg_array);
}
function extract_block(mat, block_size, x_min, y_min, img_num_col) {
  var result = Array(block_size * block_size);
  for (var i = 0; i < block_size; i++)
    for (var j = 0; j < block_size; j++) {
      result[i * block_size + j] = mat[(x_min + i) * img_num_col + y_min + j];
    }
  return result;
}
function replace_block(mat, block_size, x_min, y_min, img_num_col, new_data) {
  for (var i = 0; i < block_size; i++)
    for (var j = 0; j < block_size; j++) {
      mat[(x_min + i) * img_num_col + y_min + j] = new_data[i * block_size + j];
    }
}

/**
 * sha512.js
 */
var CryptoJS =
  CryptoJS ||
  (function (a, m) {
    var r = {},
      f = (r.lib = {}),
      g = function () {},
      l = (f.Base = {
        extend: function (a) {
          g.prototype = this;
          var b = new g();
          a && b.mixIn(a);
          b.hasOwnProperty('init') ||
            (b.init = function () {
              b.$super.init.apply(this, arguments);
            });
          b.init.prototype = b;
          b.$super = this;
          return b;
        },
        create: function () {
          var a = this.extend();
          a.init.apply(a, arguments);
          return a;
        },
        init: function () {},
        mixIn: function (a) {
          for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
          a.hasOwnProperty('toString') && (this.toString = a.toString);
        },
        clone: function () {
          return this.init.prototype.extend(this);
        },
      }),
      p = (f.WordArray = l.extend({
        init: function (a, b) {
          a = this.words = a || [];
          this.sigBytes = b != m ? b : 4 * a.length;
        },
        toString: function (a) {
          return (a || q).stringify(this);
        },
        concat: function (a) {
          var b = this.words,
            d = a.words,
            c = this.sigBytes;
          a = a.sigBytes;
          this.clamp();
          if (c % 4)
            for (var j = 0; j < a; j++)
              b[(c + j) >>> 2] |=
                ((d[j >>> 2] >>> (24 - 8 * (j % 4))) & 255) <<
                (24 - 8 * ((c + j) % 4));
          else if (65535 < d.length)
            for (j = 0; j < a; j += 4) b[(c + j) >>> 2] = d[j >>> 2];
          else b.push.apply(b, d);
          this.sigBytes += a;
          return this;
        },
        clamp: function () {
          var n = this.words,
            b = this.sigBytes;
          n[b >>> 2] &= 4294967295 << (32 - 8 * (b % 4));
          n.length = a.ceil(b / 4);
        },
        clone: function () {
          var a = l.clone.call(this);
          a.words = this.words.slice(0);
          return a;
        },
        random: function (n) {
          for (var b = [], d = 0; d < n; d += 4)
            b.push((4294967296 * a.random()) | 0);
          return new p.init(b, n);
        },
      })),
      y = (r.enc = {}),
      q = (y.Hex = {
        stringify: function (a) {
          var b = a.words;
          a = a.sigBytes;
          for (var d = [], c = 0; c < a; c++) {
            var j = (b[c >>> 2] >>> (24 - 8 * (c % 4))) & 255;
            d.push((j >>> 4).toString(16));
            d.push((j & 15).toString(16));
          }
          return d.join('');
        },
        parse: function (a) {
          for (var b = a.length, d = [], c = 0; c < b; c += 2)
            d[c >>> 3] |= parseInt(a.substr(c, 2), 16) << (24 - 4 * (c % 8));
          return new p.init(d, b / 2);
        },
      }),
      G = (y.Latin1 = {
        stringify: function (a) {
          var b = a.words;
          a = a.sigBytes;
          for (var d = [], c = 0; c < a; c++)
            d.push(
              String.fromCharCode((b[c >>> 2] >>> (24 - 8 * (c % 4))) & 255),
            );
          return d.join('');
        },
        parse: function (a) {
          for (var b = a.length, d = [], c = 0; c < b; c++)
            d[c >>> 2] |= (a.charCodeAt(c) & 255) << (24 - 8 * (c % 4));
          return new p.init(d, b);
        },
      }),
      fa = (y.Utf8 = {
        stringify: function (a) {
          try {
            return decodeURIComponent(escape(G.stringify(a)));
          } catch (b) {
            throw Error('Malformed UTF-8 data');
          }
        },
        parse: function (a) {
          return G.parse(unescape(encodeURIComponent(a)));
        },
      }),
      h = (f.BufferedBlockAlgorithm = l.extend({
        reset: function () {
          this._data = new p.init();
          this._nDataBytes = 0;
        },
        _append: function (a) {
          'string' == typeof a && (a = fa.parse(a));
          this._data.concat(a);
          this._nDataBytes += a.sigBytes;
        },
        _process: function (n) {
          var b = this._data,
            d = b.words,
            c = b.sigBytes,
            j = this.blockSize,
            l = c / (4 * j),
            l = n ? a.ceil(l) : a.max((l | 0) - this._minBufferSize, 0);
          n = l * j;
          c = a.min(4 * n, c);
          if (n) {
            for (var h = 0; h < n; h += j) this._doProcessBlock(d, h);
            h = d.splice(0, n);
            b.sigBytes -= c;
          }
          return new p.init(h, c);
        },
        clone: function () {
          var a = l.clone.call(this);
          a._data = this._data.clone();
          return a;
        },
        _minBufferSize: 0,
      }));
    f.Hasher = h.extend({
      cfg: l.extend(),
      init: function (a) {
        this.cfg = this.cfg.extend(a);
        this.reset();
      },
      reset: function () {
        h.reset.call(this);
        this._doReset();
      },
      update: function (a) {
        this._append(a);
        this._process();
        return this;
      },
      finalize: function (a) {
        a && this._append(a);
        return this._doFinalize();
      },
      blockSize: 16,
      _createHelper: function (a) {
        return function (b, d) {
          return new a.init(d).finalize(b);
        };
      },
      _createHmacHelper: function (a) {
        return function (b, d) {
          return new ga.HMAC.init(a, d).finalize(b);
        };
      },
    });
    var ga = (r.algo = {});
    return r;
  })(Math);
(function (a) {
  var m = CryptoJS,
    r = m.lib,
    f = r.Base,
    g = r.WordArray,
    m = (m.x64 = {});
  m.Word = f.extend({
    init: function (a, p) {
      this.high = a;
      this.low = p;
    },
  });
  m.WordArray = f.extend({
    init: function (l, p) {
      l = this.words = l || [];
      this.sigBytes = p != a ? p : 8 * l.length;
    },
    toX32: function () {
      for (var a = this.words, p = a.length, f = [], q = 0; q < p; q++) {
        var G = a[q];
        f.push(G.high);
        f.push(G.low);
      }
      return g.create(f, this.sigBytes);
    },
    clone: function () {
      for (
        var a = f.clone.call(this),
          p = (a.words = this.words.slice(0)),
          g = p.length,
          q = 0;
        q < g;
        q++
      )
        p[q] = p[q].clone();
      return a;
    },
  });
})();
(function () {
  function a() {
    return g.create.apply(g, arguments);
  }
  for (
    var m = CryptoJS,
      r = m.lib.Hasher,
      f = m.x64,
      g = f.Word,
      l = f.WordArray,
      f = m.algo,
      p = [
        a(1116352408, 3609767458),
        a(1899447441, 602891725),
        a(3049323471, 3964484399),
        a(3921009573, 2173295548),
        a(961987163, 4081628472),
        a(1508970993, 3053834265),
        a(2453635748, 2937671579),
        a(2870763221, 3664609560),
        a(3624381080, 2734883394),
        a(310598401, 1164996542),
        a(607225278, 1323610764),
        a(1426881987, 3590304994),
        a(1925078388, 4068182383),
        a(2162078206, 991336113),
        a(2614888103, 633803317),
        a(3248222580, 3479774868),
        a(3835390401, 2666613458),
        a(4022224774, 944711139),
        a(264347078, 2341262773),
        a(604807628, 2007800933),
        a(770255983, 1495990901),
        a(1249150122, 1856431235),
        a(1555081692, 3175218132),
        a(1996064986, 2198950837),
        a(2554220882, 3999719339),
        a(2821834349, 766784016),
        a(2952996808, 2566594879),
        a(3210313671, 3203337956),
        a(3336571891, 1034457026),
        a(3584528711, 2466948901),
        a(113926993, 3758326383),
        a(338241895, 168717936),
        a(666307205, 1188179964),
        a(773529912, 1546045734),
        a(1294757372, 1522805485),
        a(1396182291, 2643833823),
        a(1695183700, 2343527390),
        a(1986661051, 1014477480),
        a(2177026350, 1206759142),
        a(2456956037, 344077627),
        a(2730485921, 1290863460),
        a(2820302411, 3158454273),
        a(3259730800, 3505952657),
        a(3345764771, 106217008),
        a(3516065817, 3606008344),
        a(3600352804, 1432725776),
        a(4094571909, 1467031594),
        a(275423344, 851169720),
        a(430227734, 3100823752),
        a(506948616, 1363258195),
        a(659060556, 3750685593),
        a(883997877, 3785050280),
        a(958139571, 3318307427),
        a(1322822218, 3812723403),
        a(1537002063, 2003034995),
        a(1747873779, 3602036899),
        a(1955562222, 1575990012),
        a(2024104815, 1125592928),
        a(2227730452, 2716904306),
        a(2361852424, 442776044),
        a(2428436474, 593698344),
        a(2756734187, 3733110249),
        a(3204031479, 2999351573),
        a(3329325298, 3815920427),
        a(3391569614, 3928383900),
        a(3515267271, 566280711),
        a(3940187606, 3454069534),
        a(4118630271, 4000239992),
        a(116418474, 1914138554),
        a(174292421, 2731055270),
        a(289380356, 3203993006),
        a(460393269, 320620315),
        a(685471733, 587496836),
        a(852142971, 1086792851),
        a(1017036298, 365543100),
        a(1126000580, 2618297676),
        a(1288033470, 3409855158),
        a(1501505948, 4234509866),
        a(1607167915, 987167468),
        a(1816402316, 1246189591),
      ],
      y = [],
      q = 0;
    80 > q;
    q++
  )
    y[q] = a();
  f = f.SHA512 = r.extend({
    _doReset: function () {
      this._hash = new l.init([
        new g.init(1779033703, 4089235720),
        new g.init(3144134277, 2227873595),
        new g.init(1013904242, 4271175723),
        new g.init(2773480762, 1595750129),
        new g.init(1359893119, 2917565137),
        new g.init(2600822924, 725511199),
        new g.init(528734635, 4215389547),
        new g.init(1541459225, 327033209),
      ]);
    },
    _doProcessBlock: function (a, f) {
      for (
        var h = this._hash.words,
          g = h[0],
          n = h[1],
          b = h[2],
          d = h[3],
          c = h[4],
          j = h[5],
          l = h[6],
          h = h[7],
          q = g.high,
          m = g.low,
          r = n.high,
          N = n.low,
          Z = b.high,
          O = b.low,
          $ = d.high,
          P = d.low,
          aa = c.high,
          Q = c.low,
          ba = j.high,
          R = j.low,
          ca = l.high,
          S = l.low,
          da = h.high,
          T = h.low,
          v = q,
          s = m,
          H = r,
          E = N,
          I = Z,
          F = O,
          W = $,
          J = P,
          w = aa,
          t = Q,
          U = ba,
          K = R,
          V = ca,
          L = S,
          X = da,
          M = T,
          x = 0;
        80 > x;
        x++
      ) {
        var B = y[x];
        if (16 > x)
          var u = (B.high = a[f + 2 * x] | 0),
            e = (B.low = a[f + 2 * x + 1] | 0);
        else {
          var u = y[x - 15],
            e = u.high,
            z = u.low,
            u = ((e >>> 1) | (z << 31)) ^ ((e >>> 8) | (z << 24)) ^ (e >>> 7),
            z =
              ((z >>> 1) | (e << 31)) ^
              ((z >>> 8) | (e << 24)) ^
              ((z >>> 7) | (e << 25)),
            D = y[x - 2],
            e = D.high,
            k = D.low,
            D = ((e >>> 19) | (k << 13)) ^ ((e << 3) | (k >>> 29)) ^ (e >>> 6),
            k =
              ((k >>> 19) | (e << 13)) ^
              ((k << 3) | (e >>> 29)) ^
              ((k >>> 6) | (e << 26)),
            e = y[x - 7],
            Y = e.high,
            C = y[x - 16],
            A = C.high,
            C = C.low,
            e = z + e.low,
            u = u + Y + (e >>> 0 < z >>> 0 ? 1 : 0),
            e = e + k,
            u = u + D + (e >>> 0 < k >>> 0 ? 1 : 0),
            e = e + C,
            u = u + A + (e >>> 0 < C >>> 0 ? 1 : 0);
          B.high = u;
          B.low = e;
        }
        var Y = (w & U) ^ (~w & V),
          C = (t & K) ^ (~t & L),
          B = (v & H) ^ (v & I) ^ (H & I),
          ha = (s & E) ^ (s & F) ^ (E & F),
          z =
            ((v >>> 28) | (s << 4)) ^
            ((v << 30) | (s >>> 2)) ^
            ((v << 25) | (s >>> 7)),
          D =
            ((s >>> 28) | (v << 4)) ^
            ((s << 30) | (v >>> 2)) ^
            ((s << 25) | (v >>> 7)),
          k = p[x],
          ia = k.high,
          ea = k.low,
          k =
            M +
            (((t >>> 14) | (w << 18)) ^
              ((t >>> 18) | (w << 14)) ^
              ((t << 23) | (w >>> 9))),
          A =
            X +
            (((w >>> 14) | (t << 18)) ^
              ((w >>> 18) | (t << 14)) ^
              ((w << 23) | (t >>> 9))) +
            (k >>> 0 < M >>> 0 ? 1 : 0),
          k = k + C,
          A = A + Y + (k >>> 0 < C >>> 0 ? 1 : 0),
          k = k + ea,
          A = A + ia + (k >>> 0 < ea >>> 0 ? 1 : 0),
          k = k + e,
          A = A + u + (k >>> 0 < e >>> 0 ? 1 : 0),
          e = D + ha,
          B = z + B + (e >>> 0 < D >>> 0 ? 1 : 0),
          X = V,
          M = L,
          V = U,
          L = K,
          U = w,
          K = t,
          t = (J + k) | 0,
          w = (W + A + (t >>> 0 < J >>> 0 ? 1 : 0)) | 0,
          W = I,
          J = F,
          I = H,
          F = E,
          H = v,
          E = s,
          s = (k + e) | 0,
          v = (A + B + (s >>> 0 < k >>> 0 ? 1 : 0)) | 0;
      }
      m = g.low = m + s;
      g.high = q + v + (m >>> 0 < s >>> 0 ? 1 : 0);
      N = n.low = N + E;
      n.high = r + H + (N >>> 0 < E >>> 0 ? 1 : 0);
      O = b.low = O + F;
      b.high = Z + I + (O >>> 0 < F >>> 0 ? 1 : 0);
      P = d.low = P + J;
      d.high = $ + W + (P >>> 0 < J >>> 0 ? 1 : 0);
      Q = c.low = Q + t;
      c.high = aa + w + (Q >>> 0 < t >>> 0 ? 1 : 0);
      R = j.low = R + K;
      j.high = ba + U + (R >>> 0 < K >>> 0 ? 1 : 0);
      S = l.low = S + L;
      l.high = ca + V + (S >>> 0 < L >>> 0 ? 1 : 0);
      T = h.low = T + M;
      h.high = da + X + (T >>> 0 < M >>> 0 ? 1 : 0);
    },
    _doFinalize: function () {
      var a = this._data,
        f = a.words,
        h = 8 * this._nDataBytes,
        g = 8 * a.sigBytes;
      f[g >>> 5] |= 128 << (24 - (g % 32));
      f[(((g + 128) >>> 10) << 5) + 30] = Math.floor(h / 4294967296);
      f[(((g + 128) >>> 10) << 5) + 31] = h;
      a.sigBytes = 4 * f.length;
      this._process();
      return this._hash.toX32();
    },
    clone: function () {
      var a = r.clone.call(this);
      a._hash = this._hash.clone();
      return a;
    },
    blockSize: 32,
  });
  m.SHA512 = r._createHelper(f);
  m.HmacSHA512 = r._createHmacHelper(f);
})();

/**
 * mersenne-
 * @param {*} seed
 */
var MersenneTwister = function (seed) {
  if (seed == undefined) {
    seed = new Date().getTime();
  }
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 0x9908b0df; 
  this.UPPER_MASK = 0x80000000; 
  this.LOWER_MASK = 0x7fffffff; 
  this.mt = new Array(this.N); 
  this.mti = this.N + 1; 
  this.init_genrand(seed);
};

MersenneTwister.prototype.init_genrand = function (s) {
  this.mt[0] = s >>> 0;
  for (this.mti = 1; this.mti < this.N; this.mti++) {
    var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
    this.mt[this.mti] =
      ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
      (s & 0x0000ffff) * 1812433253 +
      this.mti;
    this.mt[this.mti] >>>= 0;
  }
};
MersenneTwister.prototype.init_by_array = function (init_key, key_length) {
  var i, j, k;
  this.init_genrand(19650218);
  i = 1;
  j = 0;
  k = this.N > key_length ? this.N : key_length;
  for (; k; k--) {
    var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
    this.mt[i] =
      (this.mt[i] ^
        (((((s & 0xffff0000) >>> 16) * 1664525) << 16) +
          (s & 0x0000ffff) * 1664525)) +
      init_key[j] +
      j; 
    this.mt[i] >>>= 0; 
    i++;
    j++;
    if (i >= this.N) {
      this.mt[0] = this.mt[this.N - 1];
      i = 1;
    }
    if (j >= key_length) j = 0;
  }
  for (k = this.N - 1; k; k--) {
    var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
    this.mt[i] =
      (this.mt[i] ^
        (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) +
          (s & 0x0000ffff) * 1566083941)) -
      i; 
    this.mt[i] >>>= 0; 
    i++;
    if (i >= this.N) {
      this.mt[0] = this.mt[this.N - 1];
      i = 1;
    }
  }

  this.mt[0] = 0x80000000; 
};
MersenneTwister.prototype.genrand_int32 = function () {
  var y;
  var mag01 = new Array(0x0, this.MATRIX_A);
  if (this.mti >= this.N) {
    var kk;
    if (this.mti == this.N + 1)
      this.init_genrand(5489); 
    for (kk = 0; kk < this.N - this.M; kk++) {
      y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
      this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (; kk < this.N - 1; kk++) {
      y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
      this.mt[kk] =
        this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y =
      (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
    this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
    this.mti = 0;
  }
  y = this.mt[this.mti++];
  y ^= y >>> 11;
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= y >>> 18;

  return y >>> 0;
};