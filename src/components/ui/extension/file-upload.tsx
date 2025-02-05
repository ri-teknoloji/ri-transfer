"use client";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Trash2 as RemoveIcon } from "lucide-react";
import React, {
  createContext,
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DropzoneOptions,
  DropzoneState,
  FileRejection,
  useDropzone,
} from "react-dropzone";
import { toast } from "sonner";

type DirectionOptions = "ltr" | "rtl" | undefined;

interface FileUploaderContextType {
  activeIndex: number;
  direction: DirectionOptions;
  dropzoneState: DropzoneState;
  isFileTooBig: boolean;
  isLOF: boolean;
  orientation: "horizontal" | "vertical";
  // eslint-disable-next-line no-unused-vars
  removeFileFromSet: (index: number) => void;
  setActiveIndex: Dispatch<SetStateAction<number>>;
}

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploaderProvider");
  }
  return context;
};

interface FileUploaderProps {
  dropzoneOptions: DropzoneOptions;
  // eslint-disable-next-line no-unused-vars
  onValueChange: (value: File[] | null) => void;
  orientation?: "horizontal" | "vertical";
  reSelect?: boolean;
  value: File[] | null;
}

/**
 * File upload Docs: {@link: https://localhost:3000/docs/file-upload}
 */

export const FileUploader = forwardRef<
  HTMLDivElement,
  FileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      children,
      className,
      dir,
      dropzoneOptions,
      onValueChange,
      orientation = "vertical",
      reSelect,
      value,
      ...props
    },
    ref,
  ) => {
    const [isFileTooBig, setIsFileTooBig] = useState(false);
    const [isLOF, setIsLOF] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const {
      accept = {
        "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      },
      maxFiles = 1,
      maxSize = 4 * 1024 * 1024,
      multiple = true,
    } = dropzoneOptions;

    const reSelectAll = maxFiles === 1 ? true : reSelect;
    const direction: DirectionOptions = dir === "rtl" ? "rtl" : "ltr";

    const removeFileFromSet = useCallback(
      (i: number) => {
        if (!value) return;
        const newFiles = value.filter((_, index) => index !== i);
        onValueChange(newFiles);
      },
      [value, onValueChange],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!value) return;

        const moveNext = () => {
          const nextIndex = activeIndex + 1;
          setActiveIndex(nextIndex > value.length - 1 ? 0 : nextIndex);
        };

        const movePrev = () => {
          const nextIndex = activeIndex - 1;
          setActiveIndex(nextIndex < 0 ? value.length - 1 : nextIndex);
        };

        const prevKey =
          orientation === "horizontal"
            ? direction === "ltr"
              ? "ArrowLeft"
              : "ArrowRight"
            : "ArrowUp";

        const nextKey =
          orientation === "horizontal"
            ? direction === "ltr"
              ? "ArrowRight"
              : "ArrowLeft"
            : "ArrowDown";

        if (e.key === nextKey) {
          moveNext();
        } else if (e.key === prevKey) {
          movePrev();
        } else if (e.key === "Enter" || e.key === "Space") {
          if (activeIndex === -1) {
            dropzoneState.inputRef.current?.click();
          }
        } else if (e.key === "Delete" || e.key === "Backspace") {
          if (activeIndex !== -1) {
            removeFileFromSet(activeIndex);
            if (value.length - 1 === 0) {
              setActiveIndex(-1);
              return;
            }
            movePrev();
          }
        } else if (e.key === "Escape") {
          setActiveIndex(-1);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [value, activeIndex, removeFileFromSet],
    );

    const onDrop = useCallback(
      (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        const files = acceptedFiles;

        if (!files) {
          toast.error("file error , probably too big");
          return;
        }

        const newValues: File[] = value ? [...value] : [];

        if (reSelectAll) {
          newValues.splice(0, newValues.length);
        }

        files.forEach((file) => {
          if (newValues.length < maxFiles) {
            newValues.push(file);
          }
        });

        onValueChange(newValues);

        if (rejectedFiles.length > 0) {
          for (const rejectedFile of rejectedFiles) {
            if (rejectedFile.errors[0]?.code === "file-too-large") {
              toast.error(
                `File is too large. Max size is ${maxSize / 1024 / 1024}MB`,
              );
              break;
            }
            if (rejectedFile.errors[0]?.message) {
              toast.error(rejectedFile.errors[0].message);
              break;
            }
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [reSelectAll, value],
    );

    useEffect(() => {
      if (!value) return;
      if (value.length === maxFiles) {
        setIsLOF(true);
        return;
      }
      setIsLOF(false);
    }, [value, maxFiles]);

    const opts = dropzoneOptions
      ? dropzoneOptions
      : { accept, maxFiles, maxSize, multiple };

    const dropzoneState = useDropzone({
      ...opts,
      onDrop,
      onDropAccepted: () => setIsFileTooBig(false),
      onDropRejected: () => setIsFileTooBig(true),
    });

    return (
      <FileUploaderContext.Provider
        value={{
          activeIndex,
          direction,
          dropzoneState,
          isFileTooBig,
          isLOF,
          orientation,
          removeFileFromSet,
          setActiveIndex,
        }}
      >
        <div
          className={cn(
            "grid w-full overflow-hidden focus:outline-none",
            className,
            {
              "gap-2": value && value.length > 0,
            },
          )}
          dir={dir}
          onKeyDownCapture={handleKeyDown}
          ref={ref}
          tabIndex={0}
          {...props}
        >
          {children}
        </div>
      </FileUploaderContext.Provider>
    );
  },
);

FileUploader.displayName = "FileUploader";

export const FileUploaderContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { orientation } = useFileUpload();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      aria-description="content file holder"
      className={cn("w-full px-1")}
      ref={containerRef}
    >
      <div
        {...props}
        className={cn(
          "flex gap-1 rounded-xl",
          orientation === "horizontal" ? "flex-raw flex-wrap" : "flex-col",
          className,
        )}
        ref={ref}
      >
        {children}
      </div>
    </div>
  );
});

FileUploaderContent.displayName = "FileUploaderContent";

export const FileUploaderItem = forwardRef<
  HTMLDivElement,
  { index: number } & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, index, ...props }, ref) => {
  const { activeIndex, direction, removeFileFromSet } = useFileUpload();
  const isSelected = index === activeIndex;
  return (
    <div
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "relative h-6 cursor-pointer justify-between p-1",
        className,
        isSelected ? "bg-muted" : "",
      )}
      ref={ref}
      {...props}
    >
      <div className="flex h-full w-full items-center gap-1.5 font-medium leading-none tracking-tight">
        {children}
      </div>
      <button
        className={cn(
          "absolute",
          direction === "rtl" ? "left-1 top-1" : "right-1 top-1",
        )}
        onClick={() => removeFileFromSet(index)}
        type="button"
      >
        <span className="sr-only">remove item {index}</span>
        <RemoveIcon className="h-4 w-4 duration-200 ease-in-out hover:stroke-destructive" />
      </button>
    </div>
  );
});

FileUploaderItem.displayName = "FileUploaderItem";

export const FileInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { dropzoneState, isFileTooBig, isLOF } = useFileUpload();
  const rootProps = isLOF ? {} : dropzoneState.getRootProps();
  return (
    <div
      ref={ref}
      {...props}
      className={`relative w-full ${
        isLOF ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <div
        className={cn(
          `w-full rounded-lg duration-300 ease-in-out ${
            dropzoneState.isDragAccept
              ? "border-green-500"
              : dropzoneState.isDragReject || isFileTooBig
                ? "border-red-500"
                : "border-gray-300"
          }`,
          className,
        )}
        {...rootProps}
      >
        {children}
      </div>
      <Input
        disabled={isLOF}
        ref={dropzoneState.inputRef}
        {...dropzoneState.getInputProps()}
        className={`${isLOF ? "cursor-not-allowed" : ""}`}
      />
    </div>
  );
});

FileInput.displayName = "FileInput";
