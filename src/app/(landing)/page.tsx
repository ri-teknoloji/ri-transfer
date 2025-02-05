"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileInput, FileUploader } from "@/components/ui/extension/file-upload";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Folder } from "@prisma/client";
import axios, { type AxiosProgressEvent } from "axios";
import { LucideFile, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";
import prettyBytes from "pretty-bytes";
import React from "react";
import { DropzoneOptions } from "react-dropzone";
import { toast } from "sonner";

export default function Page() {
  return <UploadForm />;
}

const UploadForm = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploadProgress, setUploadProgress] =
    React.useState<AxiosProgressEvent | null>(null);
  const router = useRouter();

  const totalSize = React.useMemo(() => {
    if (!files) return 0;

    const bytes = Array.from(files).reduce((acc, file) => acc + file.size, 0);
    return bytes;
  }, [files]);

  const percentage = React.useMemo(() => {
    if (!uploadProgress) return 0;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return Math.round((uploadProgress.loaded / uploadProgress.total!) * 100);
  }, [uploadProgress]);

  const handleSubmit = async () => {
    const formData = new FormData();

    files.forEach((file) => formData.append("files", file));

    try {
      const { data: folder } = await axios.post<Folder>(
        "/api/files",
        formData,
        {
          onUploadProgress: (event) => setUploadProgress(event),
        },
      );
      toast.success("Dosyalar başarıyla yüklendi.");
      setFiles([]);
      router.push(`/${folder.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Dosya yüklenirken bir hata oluştu.");
    }

    setUploadProgress(null);
  };

  const handleDelete = (index: number) => {
    setFiles((prevFiles) => [...prevFiles.filter((_, i) => i !== index)]);
  };

  if (uploadProgress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yükleniyor</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>
            Yükleniyor... <span>{percentage}%</span>
          </Label>
          <Progress value={percentage} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dosyalar</CardTitle>
        <CardDescription>
          Toplam Boyut: {totalSize === 0 ? "0" : prettyBytes(totalSize)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {files && (
          <ul className="grid gap-3">
            {files.map((file, i) => (
              <li
                className="flex items-center justify-between rounded border p-3"
                key={i}
              >
                <span className="flex items-end gap-1">
                  <strong>{file.name}</strong>
                  <small>({prettyBytes(file.size)})</small>
                </span>
                <Button
                  onClick={handleDelete.bind(null, i)}
                  size="icon"
                  variant="destructive"
                >
                  <LucideTrash />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardContent>
        <Dropzone files={files} setFiles={setFiles} />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={files.length === 0}
          onClick={handleSubmit}
        >
          Paylaş
        </Button>
      </CardFooter>
    </Card>
  );
};

interface DropzoneProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}
const Dropzone = ({ files, setFiles }: DropzoneProps) => {
  const dropZoneConfig = {
    maxFiles: 5,
    multiple: true,
  } satisfies DropzoneOptions;

  return (
    <div>
      <FileUploader
        className="relative rounded-lg p-1"
        dropzoneOptions={dropZoneConfig}
        onValueChange={(value) => setFiles(value || [])}
        value={files}
      >
        <FileInput className="p-5 outline-dashed outline-1 outline-foreground">
          <div className="flex flex-col items-center gap-5">
            <LucideFile />
            <p>Dosyalarınızı sürükleyip bırakarak yükleyebilirsiniz.</p>
          </div>
        </FileInput>
      </FileUploader>
    </div>
  );
};
