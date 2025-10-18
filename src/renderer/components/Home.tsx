import { ChangeEvent, useEffect, useState } from 'react';
import { read, utils } from 'xlsx';
import ExcelUploader from './common/ExcelUploader';
import { FILE_NAMES } from '../../constants/fileNames';
import { readFirstFile } from '../utils/readFiles';
import { calcData } from '../utils/calcData';

function Home() {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [uploadedOneFileData, setUploadedOneFileData] = useState<any>({});
  const [uploadedTwoFileData, setUploadedTwoFileData] = useState<any[]>([]);
  const [uploadedThreeFileData, setUploadedThreeFileData] = useState<any[]>([]);
  const [uploadedFourFileData, setUploadedFourFileData] = useState<any[]>([]);

  const readExcel = async (file: File, type: string) => {
    if (!file) return;
    const ab = await file.arrayBuffer();

    /* parse */
    const wb = read(ab);

    const ws = wb.Sheets[wb.SheetNames[0]];
    const data: any[] = utils.sheet_to_json<any>(ws);
    console.log(data, '원본데이터');
    switch (type) {
      case FILE_NAMES.ONE: {
        const processedData = readFirstFile(data);
        console.log(processedData, '가공된 첫번째 데이터');
        setUploadedOneFileData(processedData); // data 대신 processedData 사용
        break;
      }
      case FILE_NAMES.TWO:
        setUploadedTwoFileData(data);
        break;
      case FILE_NAMES.THREE:
        setUploadedThreeFileData(data);
        break;
      case FILE_NAMES.FOUR:
        setUploadedFourFileData(data);
        break;
      default:
        console.log('노데이터');
    }
  };

  const downloadExcel = () => {
    const messages = calcData({
      workTimes: uploadedOneFileData,
      workHistory: uploadedTwoFileData,
      approveOvertime: uploadedThreeFileData,
      overtimeInfo: uploadedFourFileData,
    });
    setErrorMessages(messages);
    console.log('엑셀 다운로드');
  };

  // useEffect(() => {
  //   const processedData = ReadFirstFile(uploadedOneFileData);
  //   console.log(processedData, '가공된데이터');
  // }, [uploadedOneFileData]);

  return (
    <div className="flex flex-col gap-2 w-full md:w-1/2">
      <ExcelUploader readExcel={readExcel} fileName={FILE_NAMES.ONE} />
      <ExcelUploader readExcel={readExcel} fileName={FILE_NAMES.TWO} />
      <ExcelUploader readExcel={readExcel} fileName={FILE_NAMES.THREE} />
      <ExcelUploader readExcel={readExcel} fileName={FILE_NAMES.FOUR} />
      <button
        type="button"
        className="px-2 py-1 mx-auto mt-4 w-40 text-white bg-green-500 rounded-md hover:bg-green-600"
        onClick={downloadExcel}
      >
        Excel Download
      </button>
      {errorMessages.map((message) => (
        <div key={message} className="text-red-500">
          {message}
        </div>
      ))}
    </div>
  );
}

export default Home;
