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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Folder } from "@prisma/client";
import axios, { type AxiosProgressEvent } from "axios";
import { LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";
import prettyBytes from "pretty-bytes";
import React from "react";
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files: newFiles } = event.target;
    if (!newFiles) return;

    setFiles((prevFiles) => [...prevFiles, ...Array.from(newFiles)]);

    event.target.value = "";
  };

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

  return (
    <div className="grid grid-cols-12 gap-3">
      {uploadProgress && (
        <div className="col-span-12">
          <Label className="flex gap-1">
            Yükleme Durumu
            <span>{percentage}%</span>
          </Label>
          <Progress value={percentage} />
        </div>
      )}
      <div className="col-span-12 md:col-span-12">
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
            <div>
              <Label>Dosya Ekle</Label>
              <Input multiple onChange={handleChange} type="file" />
            </div>
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
      </div>
      <div className="col-span-12 hidden md:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Ayarlar</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div>
                <Label>Geçerlilik Süresi</Label>
                <Select name="expiresAt" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Geçerlilik Süresi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1">1 Saat</SelectItem>
                      <SelectItem value="6">6 Saat</SelectItem>
                      <SelectItem value="12">12 Saat</SelectItem>
                      <SelectItem value="24">1 Gün</SelectItem>
                      <SelectItem value="48">2 Gün</SelectItem>
                      <SelectItem value="168">1 Hafta</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                disabled={files.length === 0}
                type="submit"
              >
                Paylaş
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
