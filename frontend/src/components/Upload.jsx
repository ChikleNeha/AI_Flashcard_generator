import { UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => inputRef.current.click();

  return (
    <div className="mx-auto mt-4 p-6 rounded-lg ">
      <h2 className="text-2xl font-semibold mb-6">Upload Material</h2>
      <form className="grid gap-6">
        <div className="grid gap-2">
          <label className="font-medium" htmlFor="description">
            Description <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            id="description"
            name="description"
            className="border rounded px-30 py-2"
            placeholder="Enter description (optional)"
          />
        </div>
        <div className="grid gap-2">
          <label className="font-medium" htmlFor="flashcardSetName">
            Flashcard Set Name
          </label>
          <input
            type="text"
            id="flashcardSetName"
            name="flashcardSetName"
            className="border rounded px-3 py-2"
            placeholder="Enter set name"
          />
        </div>

        {/* Drag & Drop File Upload */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center h-32 border-2 border-dashed ${
            dragActive ? "border-indigo-600 bg-indigo-50" : "border-gray-300"
          } rounded-md transition cursor-pointer`}
          onClick={triggerFileInput}
        >
          <input
            ref={inputRef}
            type="file"
            id="material"
            name="material"
            className="hidden"
            onChange={handleChange}
          />
          <UploadIcon className="text-gray-800"/>
          <span className="text-gray-600 text-center">
            {file ? (
              <>
                File selected: <span className="font-medium">{file.name}</span>
              </>
            ) : (
              <>
                Drag & drop or{" "}
                <span className="text-indigo-600 underline">browse</span> to upload
              </>
            )}
          </span>
        </div>

        {/* Optional Text Data Entry */}
        <div className="grid gap-2">
          <label className="font-medium" htmlFor="textData">
            Or enter data as text (optional)
          </label>
          <textarea
            id="textData"
            name="textData"
            rows={5}
            className="border rounded px-3 py-2 resize-none"
            placeholder="Paste or type text data here"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded shadow hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
