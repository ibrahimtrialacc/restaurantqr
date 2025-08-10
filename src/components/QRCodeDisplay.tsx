import React from "react";

const QRCodeDisplay: React.FC<{ value: string }> = ({ value }) => {
  // In a real app, use a QR code generator. For now, use a placeholder.
  return (
    <div className="flex flex-col items-center">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
          value
        )}`}
        alt="QR Code"
        className="rounded-lg border border-gray-300"
        width={180}
        height={180}
      />
      <p className="mt-2 text-xs text-gray-500 break-all">{value}</p>
    </div>
  );
};

export default QRCodeDisplay;