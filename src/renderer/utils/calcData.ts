interface ICalcDataProps {
  workTimes: any[];
  workHistory?: any[];
  approveOvertime: any[];
  overtimeDetail: any[];
}

export function calcData({
  workTimes,
  workHistory,
  approveOvertime,
  overtimeDetail,
}: ICalcDataProps) {
  console.log(workTimes, 'workTimes');
  console.log(overtimeDetail, 'overtimeDetail');

  return null;
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
