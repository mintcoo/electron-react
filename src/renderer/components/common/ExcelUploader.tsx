import { ChangeEvent, useRef, useState } from 'react';

interface IExcelUploaderProps {
  readExcel: (file: File, type: string) => void;
  fileName: string;
}

function ExcelUploader({ readExcel, fileName }: IExcelUploaderProps) {
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExcelFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFileName(file.name); // 선택된 파일명 저장
    readExcel(file, fileName);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // 숨겨진 input 클릭
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="p-2 text-left text-white bg-sky-500">{fileName}</h1>

      {/* 숨겨진 실제 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleExcelFileChange}
        style={{ display: 'none' }}
      />
      <div className="flex gap-2 items-center">
        {/* 커스텀 버튼 */}
        <button
          type="button"
          onClick={handleButtonClick}
          className="px-4 py-1 w-28 rounded border border-blue-500 hover:bg-blue-100"
        >
          파일 선택
        </button>

        {/* 선택된 파일명 표시 */}
        {selectedFileName && (
          <div className="text-sm text-gray-600">
            선택된 파일: {selectedFileName}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExcelUploader;
