export function readFirstFile(data: any[]): Record<string, any> {
  let lastDepartment = '';

  if (data.length === 0) return {};

  const headerRow = data[0];
  const dataRows = data.slice(1);

  const keys = Object.keys(headerRow);
  const numberKey = keys[0];
  const departmentKey = keys[1];
  const nameKey = keys[2];

  const result: Record<string, any> = {};

  dataRows.forEach((row) => {
    const currentDepartment = row[departmentKey];

    if (currentDepartment && currentDepartment.trim() !== '') {
      lastDepartment = currentDepartment;
    }

    const name = row[nameKey];

    result[name] = {
      번호: row[numberKey],
      소속: lastDepartment,
      이름: name,
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

  return result;
}
