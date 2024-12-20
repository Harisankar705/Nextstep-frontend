import { ImagePlus, Smartphone, X } from "lucide-react";
import { ImageUploadModalProps } from "../../../types/Candidate";

export const ImageUploadModal:React.FC<ImageUploadModalProps>=({
    isOpen,
    onClose,
    onFileSelect

})=>{
    if(!isOpen)return null
    
    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        Add photos/videos
                    </h3>
                    <button
                        className="p-1 hover:bg-gray-100 rounded-full "
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <ImagePlus className="w-6 h-6 text-gray-600" />
                        </div>
                        <p className="text-sm text-gray-600">
                            Add Photos
                        </p>
                        <p className="text-sm text-gray-600">
                            or drag and drop
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-600 ">
                            Add Photos from your mobile phone
                        </span>
                    </div>
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={onFileSelect}
                        />
                        <span className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                            Add
                        </span>
                    </label>
                </div>
            </div>
        </div>
    )
}