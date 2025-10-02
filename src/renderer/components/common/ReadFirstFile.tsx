import { read, utils } from 'xlsx';

function ReadFirstFile(data: any[]): any[] {
  let lastDepartment = '';

  if (data.length === 0) return [];

  // 첫 번째 행을 헤더로 사용
  const headerRow = data[0];
  const dataRows = data.slice(1); // 두 번째 행부터가 실제 데이터

  // 헤더 매핑 객체 생성
  const headerMapping: { [key: string]: string } = {};
  Object.keys(headerRow).forEach((key) => {
    headerMapping[key] = headerRow[key];
  });

  // 데이터 변환
  const processedData = dataRows.map((row) => {
    const currentDepartment = row['__EMPTY'];

    // 소속이 있으면 업데이트, 없으면 이전 소속 사용
    if (currentDepartment && currentDepartment.trim() !== '') {
      lastDepartment = currentDepartment;
    }

    return {
      번호: row['임직원 유연근무 현황 (2025. 9. 5. 기준)'],
      소속: lastDepartment, // 현재 또는 이전 소속 사용
      이름: row['__EMPTY_1'],
      직책: row['__EMPTY_2'],
      월요일: row['__EMPTY_3'],
      화요일: row['__EMPTY_4'],
      수요일: row['__EMPTY_5'],
      목요일: row['__EMPTY_6'],
      금요일: row['__EMPTY_7'],
      기간: row['__EMPTY_8'],
      직급: row['__EMPTY_9'],
      직급2: row['__EMPTY_10'],
    };
  });

  return processedData;
}

export default ReadFirstFile;
