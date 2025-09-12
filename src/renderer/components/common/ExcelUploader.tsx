import { ChangeEvent } from 'react';

interface IExcelUploaderProps {
  readExcel: (file: File, type: string) => void;
  fileName: string;
}

function ExcelUploader({ readExcel, fileName }: IExcelUploaderProps) {
  // 엑셀 파일 변경
  const handleExcelFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    readExcel(file, fileName);
  };

  return (
    <div>
      <h1 className="text-left text-white bg-sky-500">{fileName}</h1>
      <input
        type="file"
        id="excelFile"
        onChange={(event) => {
          handleExcelFileChange(event);
        }}
      />
    </div>
  );
}

export default ExcelUploader;
