import React, { useState, useEffect } from "react";
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Image as ImageIcon 
} from "lucide-react";

const TransactionProcessModal = ({
  isOpen,
  onClose,
  transactionImage,
  onConfirm,
  onReject,
}) => {
  const [billFile, setBillFile] = useState(null);
  const [billPreview, setBillPreview] = useState(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setBillFile(null);
      setBillPreview(null);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = Array.from(e.target.files)[0];
    if (file) {
      setBillFile(file);
      setBillPreview(URL.createObjectURL(file));
    }
  };

  const handleConfirm = () => {
    // Only proceed if billFile exists
    if (billFile) {
      // Pass the file back to the parent component
      onConfirm(billFile); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Xử lý giao dịch</h2>
            <p className="text-sm text-gray-500">Kiểm tra bằng chứng thanh toán và tải lên hóa đơn</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            
            {/* LEFT: Buyer's Proof */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <ImageIcon size={16} className="text-blue-500"/>
                Ảnh giao dịch từ người mua
              </div>
              <div className="relative group bg-gray-100 rounded-xl border border-gray-200 overflow-hidden aspect-4/3] flex items-center justify-center">
                {transactionImage ? (
                  <img src={transactionImage} alt="Proof" className="w-full h-full object-contain"/>
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon size={48} className="mb-2 opacity-50"/>
                    <span>Chưa có ảnh</span>
                  </div>
                )}
                {transactionImage && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <a href={transactionImage} target="_blank" rel="noreferrer" className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                      <ExternalLink size={14} /> Xem ảnh gốc
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Seller Actions */}
            <div className="flex flex-col gap-6">
              
              {/* Bill Upload Section */}
              <div className="flex-1">
                 <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  <FileText size={16} className="text-green-500"/>
                  Gửi hóa đơn <span className="text-red-500 ml-1">(Bắt buộc)</span>
                </div>
                
                <label className={`
                    flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all group relative overflow-hidden
                    ${billFile ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-400'}
                `}>
                  {billPreview ? (
                    <img src={billPreview} alt="Bill Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-blue-500 transition-colors">
                      <Upload size={32} className="mb-3" />
                      <p className="mb-1 text-sm font-medium"><span className="font-bold">Nhấn để tải lên</span> hoặc kéo thả</p>
                      <p className="text-xs">PNG, JPG (Tối đa 5MB)</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  
                  {billPreview && (
                    <div className="absolute top-2 right-2 bg-white/90 p-1 rounded-full shadow-sm hover:text-red-500 hover:bg-red-50 transition-colors z-10" 
                         onClick={(e) => { e.preventDefault(); setBillPreview(null); setBillFile(null); }}>
                      <X size={16} />
                    </div>
                  )}
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <button
                  onClick={handleConfirm}
                  disabled={!billFile} // DISABLE LOGIC
                  className={`
                    w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold shadow-md transition-all
                    ${billFile 
                        ? 'bg-linear-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white transform active:scale-[0.98] hover:shadow-lg' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    }
                  `}
                >
                  <CheckCircle size={20} />
                  {billFile ? "Xác nhận & Gửi hóa đơn" : "Vui lòng tải ảnh hóa đơn"}
                </button>
                
                <button
                  onClick={onReject}
                  className="w-full flex items-center justify-center gap-2 bg-white text-red-500 border-2 border-red-100 hover:bg-red-50 hover:border-red-200 py-2.5 rounded-xl font-semibold transition-all"
                >
                  <AlertCircle size={20} />
                  Ảnh không hợp lệ / Từ chối
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionProcessModal;