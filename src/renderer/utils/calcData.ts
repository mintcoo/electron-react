import { changeCellStyle, singleExcelExport } from './makeExcel';

interface ICalcDataProps {
  workTimes: any[];
  workHistory?: any[];
  approveOvertime: any[];
  overtimeInfo: any[];
}

// 요일 가져오기
function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  const weekdays = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  return weekdays[date.getDay()];
}

// 시간을 분으로 변환
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// 시간 차이 계산
function calcTimeDiff(startTime: string, endTime: string): number {
  let startMinutes = timeToMinutes(startTime);
  let endMinutes = timeToMinutes(endTime);
  console.log(startMinutes, endMinutes, 'startMinuteㅋㅋㅋㅋs, endMinutes');

  // 종료시간이 시작시간보다 작으면 자정을 넘긴 것
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60; // 24시간 추가
  }

  // 시간 차이가 60분 미만이면 0을 반환
  if (endMinutes - startMinutes < 60) {
    return 0;
  }
  return endMinutes - startMinutes;
}

// 데이터 시간 외 근무 계산
export function calcData({
  workTimes,
  workHistory,
  approveOvertime,
  overtimeInfo,
}: ICalcDataProps) {
  const errorMessages: string[] = [];
  // // 데이터 들어갈 충분한 컬럼의 길이 상수
  // const COLUMNS_LENGTH = 50;
  // let START_INDEX = 0;
  // // 빈 Row
  // const emptyRow = Array(COLUMNS_LENGTH).fill('');
  // 엑셀 만들 데이터
  const excelData = [];

  overtimeInfo.forEach((overtime, index) => {
    const workSchedule = workTimes[overtime.이름];
    // 요일
    const dayOfWeek = getDayOfWeek(overtime.근무일자);
    let approveTime = 0;
    // overtime.이름이 key로 존재하고, 그 안의 소속이 overtime.부서와 같은지 확인
    if (index === 13 && workSchedule?.소속 === overtime.부서) {
      console.log(workSchedule, 'target');
      console.log(overtime, 'overtime');
      console.log(workSchedule[dayOfWeek], '요일');

      const scheduleTime = workSchedule[dayOfWeek];
      const startTime = scheduleTime.split('~')[0]; // 유연 근무 출근 시간
      const endTime = scheduleTime.split('~')[1]; // 유연 근무 퇴근 시간
      overtime.유연근무출근시간 = startTime;
      overtime.유연근무퇴근시간 = endTime;

      switch (overtime.근무구분) {
        case '연장': {
          // 퇴근 시간 없으면 넘어가기
          if (overtime.퇴근시간 === '') {
            break;
          }
          // 신청종료시간이 22:00을 넘어가면 안됨
          if (overtime.신청종료시간 > '22:00') {
            errorMessages.push(
              `❌ [연장] 신청종료시간이 22:00을 넘어감: ${overtime.이름} ${overtime.근무일자}`,
            );
            break;
          }

          // 스케줄상 근무 종료시간 이후 1시간동안은 신청 시작시간이 불가능함
          const timeDiff = calcTimeDiff(endTime, overtime.신청시작시간);

          if (timeDiff < 60) {
            errorMessages.push(
              `❌ [연장] 퇴근 후 1시간 위반: ${overtime.이름} ${overtime.근무일자}`,
            );
            // 규칙 위반 시 인정 안 함
            overtime.인정시작시간 = '';
            overtime.인정종료시간 = '';
            overtime.인정시간 = '';
          } else {
            console.log(`✅ [연장] 규칙 통과: 근무 종료 후 ${timeDiff}분 경과`);

            const requestedTime = calcTimeDiff(
              overtime.신청시작시간,
              overtime.신청종료시간,
            );
            const actualTime = calcTimeDiff(
              overtime.신청시작시간,
              overtime.퇴근시간,
            );
            overtime.추가근무시간 = actualTime;

            // 인정시작시간은 항상 신청시작시간
            overtime.인정시작시간 = overtime.신청시작시간;

            if (actualTime >= requestedTime) {
              console.log('신청한 시간만큼(그 이상) 근무함');
              approveTime = requestedTime;
              // 신청한 시간만큼 근무했으므로 신청종료시간 그대로
              overtime.인정종료시간 = overtime.신청종료시간;
            } else {
              console.log('조기 퇴근');
              approveTime = actualTime;
              // 조기 퇴근했으므로 실제 퇴근시간으로 설정
              overtime.인정종료시간 = overtime.퇴근시간;
            }
          }
          console.log(approveTime, 'approveTime');
          break;
        }
        case '조기': {
          // 출근시간 없으면 넘어가기
          if (overtime.출근시간 === '') {
            break;
          }

          // 신청종료시간이 유연근무출근시간을 넘어가면 안됨
          if (overtime.신청종료시간 > overtime.유연근무출근시간) {
            errorMessages.push(
              `❌ [조기] 신청종료시간이 시간표를 넘어감: ${overtime.이름} ${overtime.근무일자}`,
            );
            break;
          }
          // 조기 출근 규칙 적용
          const requestedTime = calcTimeDiff(
            overtime.신청시작시간,
            overtime.신청종료시간,
          );
          const actualTime = calcTimeDiff(
            overtime.출근시간,
            overtime.신청종료시간,
          );
          overtime.추가근무시간 = actualTime;

          // 인정종료시간은 항상 신청종료시간 (유연근무 출근시간)
          overtime.인정종료시간 = overtime.신청종료시간;

          if (actualTime >= requestedTime) {
            console.log('[조기] 신청한 시간만큼 근무함');
            approveTime = requestedTime;
            // 신청시작시간 그대로
            overtime.인정시작시간 = overtime.신청시작시간;
          } else {
            console.log('[조기] 늦게 출근');
            approveTime = actualTime;
            // 실제 출근시간으로 설정
            overtime.인정시작시간 = overtime.출근시간;
          }

          break;
        }
        case '휴일': {
          overtime.유연근무출근시간 = '23:59';
          overtime.유연근무퇴근시간 = '00:00';

          // 출퇴근 시간 둘다 없으면 패스
          if (!overtime.출근시간 && !overtime.퇴근시간) {
            break;
          }

          if (!overtime.출근시간 || !overtime.퇴근시간) {
            // 둘 중 하나만 있으면 에러
            errorMessages.push(
              `❌ [휴일] 출퇴근 시간 불완전: ${overtime.이름} ${overtime.근무일자} `,
            );
            approveTime = 0;
            break;
          }

          // 실제 근무시간 계산
          const actualTime = calcTimeDiff(overtime.출근시간, overtime.퇴근시간);
          overtime.추가근무시간 = actualTime;

          let deduction = 0; // 공제 시간

          // 공제 규칙
          if (actualTime < 240) {
            // 4시간 미만: 공제 없음
            deduction = 0;
            approveTime = actualTime;
          } else if (actualTime < 480) {
            // 4시간 이상 8시간 미만: 30분 공제
            deduction = 30;
            approveTime = actualTime - deduction;
          } else {
            // 8시간 이상: 1시간 공제
            deduction = 60;
            approveTime = actualTime - deduction;
          }

          overtime.인정시작시간 = overtime.출근시간;
          overtime.인정종료시간 = overtime.퇴근시간;

          break;
        }
        case '연장추가': {
          // 퇴근 시간 없으면 넘어가기
          if (overtime.퇴근시간 === '') {
            break;
          }
          // 신청시작시간이 22:00보다 빠르면 안됨
          if (overtime.신청시작시간 < '22:00') {
            errorMessages.push(
              `❌ [연장추가] 신청시작시간이 22:00보다 빠름: ${overtime.이름} ${overtime.근무일자}`,
            );
            overtime.인정시작시간 = '';
            overtime.인정종료시간 = '';
            approveTime = 0;
            break;
          }
          const requestedTime = calcTimeDiff(
            overtime.신청시작시간,
            overtime.신청종료시간,
          );
          const actualTime = calcTimeDiff(
            overtime.신청시작시간,
            overtime.퇴근시간,
          );
          overtime.추가근무시간 = actualTime;

          // 1시간 미만이면 인정 안 함
          if (actualTime < 60) {
            console.log(`❌ [연장추가] 1시간 미만: ${actualTime}분`);
            overtime.인정시작시간 = '';
            overtime.인정종료시간 = '';
            overtime.공제사유 = '1시간 미만 근무';
            approveTime = 0;
          } else {
            // 1시간 이상이면 인정
            overtime.인정시작시간 = overtime.신청시작시간;

            if (actualTime >= requestedTime) {
              console.log('[연장추가] 신청한 시간만큼(그 이상) 근무함');
              approveTime = requestedTime;
              overtime.인정종료시간 = overtime.신청종료시간;
            } else {
              console.log('[연장추가] 조기 퇴근');
              approveTime = actualTime;
              overtime.인정종료시간 = overtime.퇴근시간;
            }
          }
        }
      }
      console.log(approveTime % 60, 'approveTime % 60', approveTime);
      // overtime.인정시간 =
      //   `${
      //     Math.floor(approveTime / 60) > 4 ? 4 : Math.floor(approveTime / 60)
      //   }시간` + (approveTime % 60 > 0 ? ` ${approveTime % 60}분` : '');
      overtime.인정시간 = approveTime;
      if (overtime.근무구분 === '조기' || overtime.근무구분 === '연장') {
        overtime['인정시간(조기, 연장)'] = overtime.인정시간;
      } else {
        overtime['인정시간(조기, 연장)'] = '';
      }
      console.log(overtime, '인정시zz간');
    }
  });

  // excelData.push([...emptyRow]);

  // const STAFF_INFO_TITLE = [
  //   '번호',
  //   '소속',
  //   '이름',
  //   '직책',
  //   '월요일',
  //   '화요일',
  //   '수요일',
  //   '목요일',
  //   '금요일',
  //   '기간',
  //   '직급',
  //   '직급2',
  // ];
  // excelData.push(
  //   changeCellStyle({ data: STAFF_INFO_TITLE, fill: 'lightGray' }),
  // );
  // 첫 번째 시트 데이터

  // excelData.push(
  //   changeCellStyle({
  //     data: ['배수', '분환산', '시간환산', '인정시간', '특근매식'],
  //     fill: 'lightBlue',
  //   }),
  // );

  // singleExcelExport({
  //   data: excelData,
  //   fileName: '임직원_유연근무_현황',
  //   extendWidth: 10,
  //   reduceWidth: 10,
  //   adjustLength: 10,
  //   allColumnsLength: 10,
  // });

  return errorMessages;
}

// PT 수당 내역 엑셀
// export const exportToPtSalaryExcel = (data, fileName, baseDate, type) => {
//   // 데이터 들어갈 충분한 컬럼의 길이 상수
//   const COLUMNS_LENGTH = 50;
//   let START_INDEX = 0;
//   // 빈 Row
//   const emptyRow = Array(COLUMNS_LENGTH).fill("");
//   // 엑셀 만들 데이터
//   const ptSalaryData = [];

//   ptSalaryData.push(_.cloneDeep(emptyRow));
//   // 직원 정보
//   const staffInfo = data.staff_salary_info.personal_info;
//   const PT_STAFF_INFO_TITLE = ["직원명", "트레이너 지점 순이익"];

//   ptSalaryData.push(changeCellStyle(PT_STAFF_INFO_TITLE, "lightGray"));

//   let flag = true;
//   for (let i = START_INDEX; i < ptSalaryData.length; i++) {
//     const el = ptSalaryData[i];
//     // 다음 줄에 데이터가 없으면 빈 Row 생성
//     if (flag && !ptSalaryData[i + 1]) {
//       ptSalaryData.push(_.cloneDeep(emptyRow));
//       flag = false;
//     }
//     for (const key in el) {
//       switch (el[key]["v"]) {
//         // 직원 명
//         case PT_STAFF_INFO_TITLE[0]:
//           ptSalaryData[i + 1][key] = changeCellStyle(staffInfo.staff_name);
//           break;
//         // 트레이너 지점 순 이익
//         case PT_STAFF_INFO_TITLE[1]:
//           ptSalaryData[i + 1][key] = changeCellStyle(
//             data.pt_salary_data.sales_info.sales_incentive -
//               data.pt_salary_data.salary_info.final_salary,
//           );
//           break;
//         default:
//           break;
//       }
//     }
//     START_INDEX += 1;
//   }

//   ptSalaryData.push(_.cloneDeep(emptyRow));
//   // PT 수당 현황
//   const salaryData = data.pt_salary_data;
//   ptSalaryData.push(changeCellStyle(["PT 수당 현황"], "lightOrange"));
//   const PT_SALARY_TITLE = [
//     "매출",
//     "PT 매출 커미션율",
//     "총 수업 진행횟수",
//     "수업 커미션율",
//     "매출 커미션",
//     "수업 커미션",
//     "총급여",
//   ];
//   ptSalaryData.push(changeCellStyle(PT_SALARY_TITLE, "lightGray"));

//   flag = true;
//   for (let i = START_INDEX; i < ptSalaryData.length; i++) {
//     const el = ptSalaryData[i];

//     if (flag && !ptSalaryData[i + 1]) {
//       ptSalaryData.push(_.cloneDeep(emptyRow));
//       flag = false;
//     }
//     for (const key in el) {
//       switch (el[key]["v"]) {
//         // 매출
//         case PT_SALARY_TITLE[0]:
//           ptSalaryData[i + 1][key] = changeCellStyle(salaryData.sales_info.sales_incentive);
//           break;
//         // PT 매출 커미션율
//         case PT_SALARY_TITLE[1]:
//           ptSalaryData[i + 1][key] = changeCellStyle(salaryData.sales_info.sales_commission + "%");
//           break;
//         // 총 수업 진행횟수
//         case PT_SALARY_TITLE[2]:
//           ptSalaryData[i + 1][key] = changeCellStyle(salaryData.class_info.class_cnt);
//           break;
//         // 수업 커미션율
//         case PT_SALARY_TITLE[3]:
//           ptSalaryData[i + 1][key] = changeCellStyle(salaryData.class_info.class_commission + "%");
//           break;
//         // 매출 커미션
//         case PT_SALARY_TITLE[4]:
//           ptSalaryData[i + 1][key] = changeCellStyle(salaryData.sales_info.sales_allowance);
//           break;
//         // 수업 커미션
//         case PT_SALARY_TITLE[5]:
//           ptSalaryData[i + 1][key] = changeCellStyle(salaryData.class_info.class_allowance);
//           break;
//         // 총급여
//         case PT_SALARY_TITLE[6]:
//           ptSalaryData[i + 1][key] = changeCellStyle(salaryData.salary_info.final_salary);
//           break;
//         default:
//           break;
//       }
//     }
//     START_INDEX += 1;
//   }
//   ptSalaryData.push(_.cloneDeep(emptyRow));
//   // PT 매출 커미션
//   ptSalaryData.push(changeCellStyle(["PT 매출 커미션", "", "", "", "PT 수업료"], "lightOrange"));
//   const PT_COMMISSION_TITLE = [
//     "매출 구간 시작 금액",
//     "매출 구간 종료 금액",
//     "매출 커미션율",
//     "",
//     "매출 구간 시작 금액",
//     "매출 구간 종료 금액",
//     "수업 커미션율",
//   ];
//   ptSalaryData.push(changeCellStyle(PT_COMMISSION_TITLE, "lightGray"));
//   const commissionInfoList = data.staff_salary_info.pt_commission;

//   for (let i = START_INDEX; i < ptSalaryData.length; i++) {
//     const el = ptSalaryData[i];

//     for (const key in el) {
//       switch (el[key]["v"]) {
//         // PT 커미션 매출 구간 시작 금액
//         case PT_COMMISSION_TITLE[0]:
//           for (let j = 0; j < commissionInfoList.pt_commission.length; j++) {
//             if (!ptSalaryData[i + j + 1]) {
//               ptSalaryData.push(_.cloneDeep(emptyRow));
//             }
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               commissionInfoList.pt_commission[j].from_section,
//             );
//           }
//           break;
//         // PT 커미션 매출 구간 종료 금액
//         case PT_COMMISSION_TITLE[1]:
//           for (let j = 0; j < commissionInfoList.pt_commission.length; j++) {
//             if (!ptSalaryData[i + j + 1]) {
//               ptSalaryData.push(_.cloneDeep(emptyRow));
//             }
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               commissionInfoList.pt_commission[j].to_section,
//             );
//           }
//           break;
//         // 매출 커미션율
//         case PT_COMMISSION_TITLE[2]:
//           for (let j = 0; j < commissionInfoList.pt_commission.length; j++) {
//             if (!ptSalaryData[i + j + 1]) {
//               ptSalaryData.push(_.cloneDeep(emptyRow));
//             }
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               commissionInfoList.pt_commission[j].rate + "%",
//             );
//           }
//           break;
//         // PT 수업료 매출 구간 시작 금액
//         case PT_COMMISSION_TITLE[4]:
//           for (let j = 0; j < commissionInfoList.pt_fee.length; j++) {
//             if (!ptSalaryData[i + j + 1]) {
//               ptSalaryData.push(_.cloneDeep(emptyRow));
//             }
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               commissionInfoList.pt_fee[j].from_section,
//             );
//           }
//           break;
//         // PT 수업료 매출 구간 종료 금액
//         case PT_COMMISSION_TITLE[5]:
//           for (let j = 0; j < commissionInfoList.pt_fee.length; j++) {
//             if (!ptSalaryData[i + j + 1]) {
//               ptSalaryData.push(_.cloneDeep(emptyRow));
//             }
//             ptSalaryData[i + j + 1][key] = changeCellStyle(commissionInfoList.pt_fee[j].to_section);
//           }
//           break;
//         // 수업 커미션율
//         case PT_COMMISSION_TITLE[6]:
//           for (let j = 0; j < commissionInfoList.pt_fee.length; j++) {
//             if (!ptSalaryData[i + j + 1]) {
//               ptSalaryData.push(_.cloneDeep(emptyRow));
//             }
//             ptSalaryData[i + j + 1][key] = changeCellStyle(commissionInfoList.pt_fee[j].rate + "%");
//           }
//           break;
//         default:
//           break;
//       }
//     }
//     START_INDEX += 1;
//   }

//   ptSalaryData.push(_.cloneDeep(emptyRow));
//   // 당월 매출 내역
//   ptSalaryData.push(changeCellStyle(["당월 매출 내역"], "lightOrange"));
//   const PT_SALES_RECORD_TITLE = [
//     "계약일",
//     "회원번호",
//     "회원명",
//     "기본 세션",
//     "서비스 세션",
//     "세션가",
//     "매출액",
//     "매출구분",
//   ];
//   ptSalaryData.push(changeCellStyle(PT_SALES_RECORD_TITLE, "lightGray"));
//   const ptSalesRecordList = data.pt_salary_data.sales_info.sales_record_list;

//   for (let i = START_INDEX; i < ptSalaryData.length; i++) {
//     const el = ptSalaryData[i];

//     for (const key in el) {
//       switch (el[key]["v"]) {
//         // 계약일
//         case PT_SALES_RECORD_TITLE[0]:
//           for (let j = 0; j < ptSalesRecordList.length; j++) {
//             if (!ptSalaryData[i + j + 1]) {
//               ptSalaryData.push(_.cloneDeep(emptyRow));
//             }
//             ptSalaryData[i + j + 1][key] = changeCellStyle(ptSalesRecordList[j].reg_date);
//           }
//           break;
//         // 회원번호
//         case PT_SALES_RECORD_TITLE[1]:
//           for (let j = 0; j < ptSalesRecordList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptSalesRecordList[j].member_info.member_no,
//             );
//           }
//           break;
//         // 회원명
//         case PT_SALES_RECORD_TITLE[2]:
//           for (let j = 0; j < ptSalesRecordList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptSalesRecordList[j].member_info.member_name,
//             );
//           }
//           break;
//         // 기본 세션
//         case PT_SALES_RECORD_TITLE[3]:
//           for (let j = 0; j < ptSalesRecordList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptSalesRecordList[j].pt_info.base_session_cnt,
//             );
//           }
//           break;
//         // 서비스 세션
//         case PT_SALES_RECORD_TITLE[4]:
//           for (let j = 0; j < ptSalesRecordList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptSalesRecordList[j].pt_info.service_session_cnt,
//             );
//           }
//           break;
//         // 세션가
//         case PT_SALES_RECORD_TITLE[5]:
//           for (let j = 0; j < ptSalesRecordList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptSalesRecordList[j].pt_info.pt_price.per_price,
//             );
//           }
//           break;
//         // 매출액
//         case PT_SALES_RECORD_TITLE[6]:
//           for (let j = 0; j < ptSalesRecordList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptSalesRecordList[j].incentive.incentive,
//             );
//           }
//           break;
//         // 매출구분
//         case PT_SALES_RECORD_TITLE[7]:
//           for (let j = 0; j < ptSalesRecordList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(makeSalesType(ptSalesRecordList[j]));
//           }
//           break;
//         default:
//           break;
//       }
//     }
//     START_INDEX += 1;
//   }
//   ptSalaryData.push(_.cloneDeep(emptyRow));
//   // 당월 수업 진행 내역
//   ptSalaryData.push(changeCellStyle(["당월 수업 진행 내역"], "lightOrange"));
//   // 1 ~ 31일 까지 Array
//   const daysArray = [];
//   for (let i = 1; i <= 31; i++) {
//     daysArray.push(i);
//   }
//   const PT_CLASS_HISTORY_TITLE = [
//     "회원번호",
//     "회원명",
//     "계약상품명",
//     "계약 기본 세션",
//     "계약 서비스 세션",
//     "계약 세션가",
//     "당월 진행 기본 세션",
//     "당월 진행 서비스 세션",
//     "진행 세션가 합계",
//     "지급 금액",
//     "당월 출입여부",
//     "비고",
//     ...daysArray,
//   ];
//   ptSalaryData.push(changeCellStyle(PT_CLASS_HISTORY_TITLE, "lightGray"));
//   const ptClassHistoryList = data.pt_salary_data.class_info.class_record_list;
//   const ptClassesDataList = data.pt_classes_data;

//   flag = true;
//   let day = 1;

//   for (let i = START_INDEX; i < ptSalaryData.length; i++) {
//     const el = ptSalaryData[i];
//     // flag 가 false면 불필요한 for문 종료
//     if (!flag) {
//       break;
//     }
//     if (flag && !ptSalaryData[i + 1]) {
//       ptSalaryData.push(_.cloneDeep(emptyRow));
//       flag = false;
//     }

//     // 당월 수업 진행 내역
//     for (const key in el) {
//       // 모든 계약 세션가 합계

//       let sumContractPtPrice = 0;
//       switch (el[key]["v"]) {
//         // 회원번호
//         case PT_CLASS_HISTORY_TITLE[0]:
//           for (let j = 0; j < ptClassHistoryList.length; j++) {
//             if (!ptSalaryData[i + j + 1]) {
//               ptSalaryData.push(_.cloneDeep(emptyRow));
//             }
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptClassHistoryList[j].member_info.member_no,
//             );
//             // 회원수
//             if (j === ptClassHistoryList.length - 1) {
//               if (!ptSalaryData[i + j + 2]) {
//                 ptSalaryData.push(_.cloneDeep(emptyRow));
//               }
//               ptSalaryData[i + j + 2][key] = changeCellStyle("회원수", "lightBlue");
//             }
//           }

//           break;
//         // 회원명
//         case PT_CLASS_HISTORY_TITLE[1]:
//           for (let j = 0; j < ptClassHistoryList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptClassHistoryList[j].member_info.member_name,
//             );
//             // 회원수 값
//             if (j === ptClassHistoryList.length - 1) {
//               ptSalaryData[i + j + 2][key] = changeCellStyle(
//                 ptClassHistoryList.length,
//                 "lightBlue",
//               );
//             }
//           }
//           break;
//         // 계약상품명
//         case PT_CLASS_HISTORY_TITLE[2]:
//           for (let j = 0; j < ptClassHistoryList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptClassHistoryList[j].pt_info.item_name,
//               "none",
//               "left",
//             );

//             if (j === ptClassHistoryList.length - 1) {
//               ptSalaryData[i + j + 2][key] = changeCellStyle("", "lightBlue");
//             }
//           }
//           break;
//         // 계약 기본 세션
//         case PT_CLASS_HISTORY_TITLE[3]:
//           for (let j = 0; j < ptClassesDataList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptClassesDataList[j].pt_info.base_session_cnt,
//             );
//             if (j === ptClassHistoryList.length - 1) {
//               ptSalaryData[i + j + 2][key] = changeCellStyle("", "lightBlue");
//             }
//           }
//           break;
//         // 계약 서비스 세션
//         case PT_CLASS_HISTORY_TITLE[4]:
//           for (let j = 0; j < ptClassesDataList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptClassesDataList[j].pt_info.service_session_cnt,
//             );
//             // 평균 계약 세션가
//             if (j === ptClassHistoryList.length - 1) {
//               ptSalaryData[i + j + 2][key] = changeCellStyle("평균 계약 세션가", "lightBlue");
//             }
//           }
//           break;
//         // 계약 세션가
//         case PT_CLASS_HISTORY_TITLE[5]:
//           for (let j = 0; j < ptClassHistoryList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptClassHistoryList[j].pt_info.pt_price.per_price,
//             );
//             // 평균 세션가 계산
//             sumContractPtPrice += ptClassHistoryList[j].pt_info.pt_price.per_price;
//             if (j === ptClassHistoryList.length - 1) {
//               ptSalaryData[i + j + 2][key] = changeCellStyle(
//                 Math.round(sumContractPtPrice / ptClassHistoryList.length),
//                 "lightBlue",
//               );
//             }
//           }
//           break;
//         // 당월 진행 기본 세션
//         case PT_CLASS_HISTORY_TITLE[6]:
//           for (let j = 0; j < ptClassHistoryList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptClassHistoryList[j].pt_info.base_session_cnt,
//             );
//             if (j === ptClassHistoryList.length - 1) {
//               ptSalaryData[i + j + 2][key] = changeCellStyle("", "lightBlue");
//             }
//           }
//           break;
//         // 당월 진행 서비스 세션
//         case PT_CLASS_HISTORY_TITLE[7]:
//           for (let j = 0; j < ptClassHistoryList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptClassHistoryList[j].pt_info.service_session_cnt,
//             );
//             if (j === ptClassHistoryList.length - 1) {
//               ptSalaryData[i + j + 2][key] = changeCellStyle("", "lightBlue");
//             }
//           }
//           break;
//         // 진행 세션가 합계
//         case PT_CLASS_HISTORY_TITLE[8]:
//           for (let j = 0; j < ptClassHistoryList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptClassHistoryList[j].pt_info.total_session_price,
//             );
//             if (j === ptClassHistoryList.length - 1) {
//               ptSalaryData[i + j + 2][key] = changeCellStyle("", "lightBlue");
//             }
//           }
//           break;
//         // 지급 금액
//         case PT_CLASS_HISTORY_TITLE[9]:
//           for (let j = 0; j < ptClassHistoryList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(
//               ptClassHistoryList[j].class_info.pt_pay_out.total_payout_price,
//             );
//             if (j === ptClassHistoryList.length - 1) {
//               ptSalaryData[i + j + 2][key] = changeCellStyle("", "lightBlue");
//             }
//           }
//           break;
//         // 당월 출입여부
//         case PT_CLASS_HISTORY_TITLE[10]:
//           for (let j = 0; j < ptClassHistoryList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(ptClassHistoryList[j].enter_cnt);
//             if (j === ptClassHistoryList.length - 1) {
//               ptSalaryData[i + j + 2][key] = changeCellStyle("", "lightBlue");
//             }
//           }
//           break;
//         // 비고
//         case PT_CLASS_HISTORY_TITLE[11]:
//           for (let j = 0; j < ptClassHistoryList.length; j++) {
//             ptSalaryData[i + j + 1][key] = changeCellStyle(ptClassHistoryList[j].class_info.memo);
//             if (j === ptClassHistoryList.length - 1) {
//               ptSalaryData[i + j + 2][key] = changeCellStyle("", "lightBlue");
//             }
//           }
//           break;
//         default:
//           // 1~ 31일 날짜에 맞는 수업 진행 체크
//           if (el[key]["v"] === day && day <= 31) {
//             for (let j = 0; j < ptClassesDataList.length; j++) {
//               // 세션 정보 담을 Array
//               const sessionArray = [];
//               // 회원별 계약 Pt 세션 (기본 + 서비스)
//               let contractPtSession =
//                 ptClassesDataList[j].pt_info.base_session_cnt +
//                 ptClassesDataList[j].pt_info.service_session_cnt;

//               // 세션 상태 (서비스, 노쇼)
//               let classStatus = "";
//               for (let k = 0; k < ptClassesDataList[j].pt_class.length; k++) {
//                 // 선택 날짜와 수업 진행 날짜 같은지 체크
//                 if (getIsSameDate(ptClassesDataList[j].pt_class[k], baseDate, day)) {
//                   if (ptClassesDataList[j].pt_class[k].session_type === "서비스 세션") {
//                     classStatus = "blue";
//                   }
//                   if (ptClassesDataList[j].pt_class[k].proceed_class.class_status === "노쇼") {
//                     classStatus = "yellow";
//                   }
//                   if (contractPtSession === ptClassesDataList[j].pt_class[k].no) {
//                     classStatus = "red";
//                   }
//                   sessionArray.push(ptClassesDataList[j].pt_class[k].no);
//                 }
//               }
//               // 중복 수업 여부 체크
//               if (sessionArray.length >= 2) {
//                 ptSalaryData[i + j + 1][key] = changeCellStyle(
//                   sessionArray.join(", "),
//                   "orange",
//                   "left",
//                 );
//               } else {
//                 ptSalaryData[i + j + 1][key] = changeCellStyle(
//                   sessionArray.join(", "),
//                   classStatus,
//                 );
//               }

//               // 마지막 Row에 Day값 한번 더 추가
//               ptSalaryData[i + j + 2][key] = changeCellStyle(day, "lightGray");

//               // 세션 안내 문구
//               if (day === 1 && j === ptClassHistoryList.length - 1) {
//                 ptSalaryData.push(_.cloneDeep(emptyRow));
//                 ptSalaryData.push(_.cloneDeep(emptyRow));
//                 ptSalaryData.push(_.cloneDeep(emptyRow));
//                 ptSalaryData.push(_.cloneDeep(emptyRow));
//                 ptSalaryData.push(_.cloneDeep(emptyRow));
//                 ptSalaryData[i + j + 4][key] = changeCellStyle(
//                   "서비스 세션(파란색)",
//                   "blue",
//                   "left",
//                   "none",
//                 );
//                 ptSalaryData[i + j + 5][key] = changeCellStyle(
//                   "노쇼 세션(노란색)",
//                   "yellow",
//                   "left",
//                   "none",
//                 );
//                 ptSalaryData[i + j + 6][key] = changeCellStyle(
//                   "마지막 세션(빨간색)",
//                   "red",
//                   "left",
//                   "none",
//                 );
//                 ptSalaryData[i + j + 7][key] = changeCellStyle(
//                   "중복 수업(주황색)",
//                   "orange",
//                   "left",
//                   "none",
//                 );
//               }
//             }
//             day += 1;
//           }
//           break;
//       }
//     }
//   }

//   // 전체 빈 칸 Null 값으로 변경
//   for (let i = 0; i < ptSalaryData.length; i++) {
//     const el = ptSalaryData[i];
//     for (const key in el) {
//       if (el[key] === "") {
//         el[key] = null;
//       }
//     }
//   }

//   // 엑셀 Data Width 조절 용 상수
//   const EXTEND_DATA_WIDTH = 20;
//   const REDUCE_DATA_WIDTH = 3;
//   const ADJUST_COLUMN_LENGTH = 12;

//   if (type === "전체") {
//     return ptSalaryData;
//   } else {
//     arrayExcelExport(
//       ptSalaryData,
//       fileName,
//       EXTEND_DATA_WIDTH,
//       REDUCE_DATA_WIDTH,
//       ADJUST_COLUMN_LENGTH,
//       COLUMNS_LENGTH,
//     );
//   }
// };
