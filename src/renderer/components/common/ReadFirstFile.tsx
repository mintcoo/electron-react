import { read, utils } from 'xlsx';

function ReadFirstFile(data: any[]): any[] {
  let lastDepartment = '';

  if (data.length === 0) return [];

  // 첫 번째 행을 헤더로 사용
  const headerRow = data[0];
  const dataRows = data.slice(1);

  // 헤더 키 찾기
  const keys = Object.keys(headerRow);
  const numberKey = keys[0]; // 첫 번째 컬럼 (번호)
  const departmentKey = keys[1]; // 두 번째 컬럼 (소속)
  const nameKey = keys[2]; // 세 번째 컬럼 (이름)

  const processedData = dataRows.map((row) => {
    const currentDepartment = row[departmentKey];

    if (currentDepartment && currentDepartment.trim() !== '') {
      lastDepartment = currentDepartment;
    }

    return {
      번호: row[numberKey],
      소속: lastDepartment,
      이름: row[nameKey],
      직책: row[keys[3]],
      월요일: row[keys[4]],
      화요일: row[keys[5]],
      수요일: row[keys[6]],
      목요일: row[keys[7]],
      금요일: row[keys[8]],
      기간: row[keys[9]],
      직급: row[keys[10]],
      직급2: row[keys[11]],
    };
  });

  return processedData;
}

export default ReadFirstFile;
