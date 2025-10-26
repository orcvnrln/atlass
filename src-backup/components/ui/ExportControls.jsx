import React from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

const ExportControls = ({ targetRef, fileName }) => {
  const handleExportPNG = () => {
    if (targetRef.current) {
      html2canvas(targetRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleExportPNG}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold bg-secondary text-text-secondary hover:bg-border-color transition-colors"
      >
        <Download size={16} />
        <span>Export PNG</span>
      </button>
    </div>
  );
};

export default ExportControls;
