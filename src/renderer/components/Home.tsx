import { ChangeEvent, useState } from 'react';
import { read, utils } from 'xlsx';
import ExcelUploader from './common/ExcelUploader';
import { FILE_NAMES } from '../../constants/fileNames';

function Home() {
  const [uploadedOneFileData, setUploadedOneFileData] = useState<any[]>([]);
  const [uploadedTwoFileData, setUploadedTwoFileData] = useState<any[]>([]);

  const readExcel = async (file: File, type: string) => {
    const ab = await file.arrayBuffer();

    /* parse */
    const wb = read(ab);

    const ws = wb.Sheets[wb.SheetNames[0]];
    const data: any[] = utils.sheet_to_json<any>(ws);
    console.log(data, 'ㅇㅇ');
    switch (type) {
      case FILE_NAMES.ONE:
        setUploadedOneFileData(data);
        break;
      case FILE_NAMES.TWO:
        setUploadedTwoFileData(data);
        break;
      default:
        console.log('노데이터');
    }
  };

  const downloadExcel = () => {
    console.log('엑셀 다운로드');
  };

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
    </div>
  );
}

export default Home;
