import { useState } from 'react';
import { read, utils } from 'xlsx';

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
      case 'one':
        setUploadedOneFileData(data);
        break;
      case 'two':
        setUploadedTwoFileData(data);
        break;
      default:
        console.log('노데이터');
    }
  };

  const handleExcelFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    readExcel(file, type);
  };

  return (
    <div>
      <h1 className="text-center text-white bg-red-300">엑셀 업로드 테스트</h1>
      <input
        type="file"
        id="excelFile"
        onChange={(event) => {
          handleExcelFileChange(event, 'one');
        }}
      />
      <div className="flex">
        {uploadedOneFileData.map((el, index) => {
          return (
            <div key={index} className="text-black min-w-20">
              {el.이름}
            </div>
          );
        })}
      </div>
      <input
        type="file"
        id="excelFile"
        onChange={(event) => {
          handleExcelFileChange(event, 'two');
        }}
      />
      <div className="flex">
        {uploadedTwoFileData.map((el, index) => {
          return (
            <div key={index} className="text-black min-w-20">
              {el.직급}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
