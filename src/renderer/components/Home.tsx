import { useState } from 'react';
import { read, utils } from 'xlsx';

function Home() {
  const [uploadedFileData, setUploadedFileData] = useState<any[]>([]);

  const readExcel = async (file: File) => {
    const ab = await file.arrayBuffer();

    /* parse */
    const wb = read(ab);

    const ws = wb.Sheets[wb.SheetNames[0]];
    const data: any[] = utils.sheet_to_json<any>(ws);

    setUploadedFileData(data);
  };

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    readExcel(file);
  };

  return (
    <div>
      <h1 className="text-center text-white bg-red-300">엑셀 업로드 테스트</h1>
      <input type="file" id="excelFile" onChange={handleExcelFileChange} />

      <div className="flex">
        {uploadedFileData.map((el, index) => {
          return (
            <div key={index} className="text-black min-w-20">
              {el.이름}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
