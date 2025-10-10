import { utils, writeFile } from 'xlsx-js-style';

// 여러개의 시트로 구성 가능한 엑셀 (Array Data)
export function excelExport({
  dataSet,
  fileName,
  extendWidth,
  reduceWidth,
  adjustLength,
  allColumnsLength,
}: any) {
  const workbook = utils.book_new();

  for (let i = 0; i < dataSet.length; i += 1) {
    const worksheet = utils.aoa_to_sheet(dataSet[i].data);
    // 엑셀 너비 조정
    if (extendWidth) {
      // 조정할 컬럼 길이가 없으면 첫번째 Row의 데이터 길이로
      const columnsLength =
        adjustLength || Object.keys(dataSet[i].data[0]).length;
      const cols = [];
      for (let j = 0; j < allColumnsLength; j += 1) {
        if (j < columnsLength) {
          cols.push({ wch: extendWidth });
        } else {
          cols.push({ wch: reduceWidth });
        }
      }
      // 너비를 width 값으로 조정
      worksheet['!cols'] = cols;
    }
    utils.book_append_sheet(workbook, worksheet, dataSet[i].sheetName);
  }
  writeFile(workbook, `${fileName}.xlsx`);
}

// 셀 스타일 바꿈
function setCellStyle({
  data,
  fill,
  align,
  borderDirection,
  numFormat,
  font,
}: any) {
  const newCell: any = {};
  newCell['v'] = data;
  // 숫자일때 타입 지정
  if (typeof data === 'number') {
    newCell['t'] = 'n';
  }
  // 배경색 설정
  if (fill) {
    switch (fill) {
      // 연한 주황
      case 'lightOrange':
        newCell['s'] = {
          ...newCell['s'],
          fill: { fgColor: { theme: 9, tint: 0.6 } },
        };
        break;
      // 연한 회색
      case 'lightGray':
        newCell['s'] = {
          ...newCell['s'],
          fill: { fgColor: { theme: 1, tint: 0.8 } },
        };
        break;
      // 연한 파랑
      case 'lightBlue':
        newCell['s'] = {
          ...newCell['s'],
          fill: { fgColor: { theme: 4, tint: 0.8 } },
        };
        break;
      // 파랑
      case 'blue':
        newCell['s'] = {
          ...newCell['s'],
          fill: { fgColor: { rgb: '87CEEB' } },
        };
        break;
      // 노랑
      case 'yellow':
        newCell['s'] = {
          ...newCell['s'],
          fill: { fgColor: { rgb: 'FFE033' } },
        };
        break;
      // 빨강
      case 'red':
        newCell['s'] = {
          ...newCell['s'],
          fill: { fgColor: { rgb: 'FA6464' } },
        };
        break;
      // 진한 주황
      case 'orange':
        newCell['s'] = {
          ...newCell['s'],
          fill: { fgColor: { theme: 9, tint: 0.2 } },
        };
        break;
      default:
        break;
    }
  }

  // align 위치
  if (align) {
    if (align === 'allCenter') {
      newCell['s'] = {
        ...newCell['s'],
        alignment: { horizontal: 'center', vertical: 'center' },
      };
    } else if (align === 'verticalCenter') {
      newCell['s'] = { ...newCell['s'], alignment: { vertical: 'center' } };
    } else {
      // align 값이 있으면 align 위치로
      newCell['s'] = { ...newCell['s'], alignment: { horizontal: align } };
    }
    // 숫자면 right, 아니면 center
  } else if (typeof data === 'number' && fill !== 'title') {
    newCell['s'] = { ...newCell['s'], alignment: { horizontal: 'right' } };
  } else {
    newCell['s'] = { ...newCell['s'], alignment: { horizontal: 'center' } };
  }

  // border 설정 (방향 없으면 4방향)
  if (borderDirection) {
    switch (borderDirection) {
      case 'all':
        newCell['s'] = {
          ...newCell['s'],
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          },
        };
        break;
      case 'left':
        newCell['s'] = {
          ...newCell['s'],
          border: {
            left: { style: 'thin' },
          },
        };
        break;
      default:
        break;
    }
  } else {
    newCell['s'] = {
      ...newCell['s'],
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
    };
  }

  // 숫자 포맷 형식
  if (numFormat) {
    switch (numFormat) {
      case 'normal':
        newCell['s'] = { ...newCell['s'], numFmt: 'normal' };
        break;
      default:
        break;
    }
  } else {
    newCell['s'] = { ...newCell['s'], numFmt: '#,##0' };
  }

  return newCell;
}

export function changeCellStyle({
  data,
  fill,
  align,
  borderDirection,
  numFormat,
  font,
}: any) {
  const newDataList: any[] = [];

  data.forEach((el: any) => {
    if (el === '') {
      newDataList.push(el);
    } else {
      const cellData = setCellStyle({
        el,
        fill,
        align,
        borderDirection,
        numFormat,
        font,
      });
      newDataList.push(cellData);
    }
  });
  return newDataList;
}
