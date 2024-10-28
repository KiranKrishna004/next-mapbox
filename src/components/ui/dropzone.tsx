"use client"

import { uploadfile } from "@/app/actions/uploadfile"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useDropzone } from "react-dropzone"

export default function Dropzone({ setMapData }: { setMapData: any }) {
  const [files, setFiles] = useState<File[] | []>([])

  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/tiff": [".tiff"],
      "application/geo+json": [".geojson"],
      "application/vnd.google-earth.kml+xml": [".kml"],
    },
  })

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    uploadfile(files).then((res) => setMapData(res))
  }

  return (
    <Card className="w-1/2 p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">File Upload</h3>
        <p className="text-muted-foreground">
          Drag and drop files or click to select from your local machine.
        </p>
      </div>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed rounded-lg bg-muted ${
          isDragActive ? "bg-muted/80" : "hover:bg-muted/80"
        } transition-colors`}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">
          {isDragActive
            ? "Drop the files here..."
            : "Drag and drop files here or click to select"}
        </p>
      </div>
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-muted p-3 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <FileIcon className="w-6 h-6 text-muted-foreground" />
                  <p className="truncate">{file.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={handleUpload}>Upload Files</Button>
        </div>
      )}
    </Card>
  )
}

function CloudUploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  )
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
