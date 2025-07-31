import { OverlayData } from 'night-vision/dist/types';

function checkhl(data_back, data_forward, hl) {
  if (hl === 'high' || hl === 'High') {
    const ref = data_back[data_back.length - 1];
    for (let i = 0; i < data_back.length - 1; i++) {
      if (ref < data_back[i]) {
        return 0;
      }
    }
    for (let i = 0; i < data_forward.length; i++) {
      if (ref <= data_forward[i]) {
        return 0;
      }
    }
    return 1;
  }
  if (hl === 'low' || hl === 'Low') {
    const ref = data_back[data_back.length - 1];
    for (let i = 0; i < data_back.length - 1; i++) {
      if (ref > data_back[i]) {
        return 0;
      }
    }
    for (let i = 0; i < data_forward.length; i++) {
      if (ref >= data_forward[i]) {
        return 0;
      }
    }
    return 1;
  }
  return 1;
}

function pivot(osc, LBL, LBR, highlow) {
  const left = [];
  const right = [];
  const pivots = Array(osc.length).fill(0.0);

  for (let i = 0; i < osc.length; i++) {
    if (i < LBL + 1) {
      left.push(osc[i]);
    }
    if (i > LBL) {
      right.push(osc[i]);
    }
    if (i > LBL + LBR) {
      left.push(right[0]);
      left.shift();
      right.shift();
      if (checkhl(left, right, highlow)) {
        pivots[i - LBR] = osc[i - LBR];
      }
    }
  }

  return pivots;
}

export const calculateTrendLines = (data: number[][]): OverlayData => {
  const prd = 20;
  const PPnum = 3;

  const tval = new Array(PPnum).fill(0);
  const tpos = new Array(PPnum).fill(0);
  const bval = new Array(PPnum).fill(0);
  const bpos = new Array(PPnum).fill(0);

  const result = [];

  const low = data.map((value) => value[3]);
  const high = data.map((value) => value[2]);

  const ph = pivot(high, prd, prd, 'high');
  const pl = pivot(low, prd, prd, 'low');

  let prevupv1 = 0;
  let prevupv2 = 0;
  let prevdpv1 = 0;
  let prevdpv2 = 0;

  for (let bar_index = 0; bar_index < data.length; bar_index++) {
    if (ph[bar_index] === 0 && pl[bar_index] === 0) {
      continue;
    }

    let countLineLo = 0;
    let countLineHi = 0;

    let low = 0;
    let lowPos = 0;
    for (let i = bar_index - prd; i <= bar_index + prd; i++) {
      if (pl[i] > 0) {
        low = pl[i];
        lowPos = i;
      }
    }

    let high = 0;
    let highPos = 0;
    for (let i = bar_index - prd; i <= bar_index + prd; i++) {
      if (ph[i] > 0) {
        high = ph[i];
        highPos = i;
      }
    }

    if (low && lowPos !== bpos[0]) {
      bval.unshift(low);
      bpos.unshift(lowPos);
      bpos.pop();
      bval.pop();
    }

    if (highPos !== tpos[0]) {
      tval.unshift(high);
      tpos.unshift(highPos);
      tpos.pop();
      tval.pop();
    }

    if (bpos.some((val) => val === 0)) {
      continue;
    }

    if (tpos.some((val) => val === 0)) {
      continue;
    }

    for (let p1 = 0; p1 < PPnum - 2; p1++) {
      let uv1 = 0.0;
      let uv2 = 0.0;
      let up1 = 0;
      let up2 = 0;

      if (countLineLo < 3) {
        for (let p2 = PPnum - 1; p2 > p1; p2--) {
          const val1 = bval[p1];
          const val2 = bval[p2];
          const pos1 = bpos[p1];
          const pos2 = bpos[p2];

          if (pos2 === 0) {
            continue;
          }

          if (pos1 === 0) {
            continue;
          }

          if (val1 > val2) {
            const diff = (val1 - val2) / (pos1 - pos2);
            let hline = val2 + diff;
            let lloc = bar_index;
            let lval = data[bar_index][3];
            let valid = true;

            for (let x = pos2 + 1; x <= data.length - 1; x++) {
              if (data[x][4] < hline) {
                valid = false;
                break;
              }

              lloc = x;
              lval = hline;
              hline += diff;
            }

            if (valid) {
              uv1 = hline - diff;
              uv2 = val2;
              up1 = lloc;
              up2 = pos2;
              break;
            }
          }
        }
      }

      let dv1 = 0;
      let dv2 = 0;
      let dp1 = 0;
      let dp2 = 0;

      if (countLineHi < 3) {
        for (let p2 = PPnum - 1; p2 > p1; p2--) {
          const val1 = tval[p1];
          const val2 = tval[p2];
          const pos1 = tpos[p1];
          const pos2 = tpos[p2];

          if (pos2 === 0) {
            continue;
          }

          if (pos1 === 0) {
            continue;
          }

          if (val1 < val2) {
            const diff = (val2 - val1) / (pos1 - pos2);
            let hline = val2 - diff;
            let lloc = bar_index;
            let lval = data[bar_index][2];
            let valid = true;

            for (let x = pos2 + 1; x <= data.length - 1; x++) {
              if (data[x][4] > hline) {
                valid = false;
                break;
              }

              lloc = x;
              lval = hline;
              hline -= diff;
            }

            if (valid) {
              dv1 = hline + diff;
              dv2 = val2;
              dp1 = lloc;
              dp2 = pos2;
              break;
            }
          }
        }
      }

      // Draw uptrend line
      if (
        up1 !== 0 &&
        up2 !== 0 &&
        countLineLo < 3 &&
        prevupv1 !== uv1 &&
        prevupv2 !== uv2
      ) {
        countLineLo++;
        result.push([
          [data[up2][0], uv2],
          [data[up1][0], uv1],
        ]);
        prevupv1 = uv1;
        prevupv2 = uv2;
      }

      // Draw downtrend line
      if (
        dp1 !== 0 &&
        dp2 !== 0 &&
        countLineHi < 3 &&
        prevdpv1 !== dv1 &&
        prevdpv2 !== dv2
      ) {
        countLineHi++;
        result.push([
          [data[dp2][0], dv2],
          [data[dp1][0], dv1],
        ]);
        prevdpv1 = dv1;
        prevdpv2 = dv2;
      }
    }
  }
  return result;
};
