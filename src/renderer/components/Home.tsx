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

  const handleExcelFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    readExcel(file, type);
  };

  return (
    <div className="flex flex-col gap-2">
      <ExcelUploader readExcel={readExcel} fileName={FILE_NAMES.ONE} />

      <ExcelUploader readExcel={readExcel} fileName={FILE_NAMES.TWO} />
    </div>
  );
}

export default Home;
