import { readFileInput } from '@/lib/fileUtils';
import { useRef, useState, useCallback } from 'react';

function FileUploadSvg(props: React.HTMLAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {' '}
        <path d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z"></path>{' '}
        <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"></path>{' '}
      </g>
    </svg>
  );
}

function MouseSvg(props: React.HTMLAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {' '}
        <g id="System / Mouse">
          {' '}
          <path
            id="Vector"
            d="M12 10V7M18 9V15C18 18.3137 15.3137 21 12 21C8.68629 21 6 18.3137 6 15V9C6 5.68629 8.68629 3 12 3C15.3137 3 18 5.68629 18 9Z"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{' '}
        </g>{' '}
      </g>
    </svg>
  );
}

const uploadFile = async (file: File) => {
  const form = new FormData();
  const blob = await readFileInput(file);
  if (!blob) return;

  form.append('file', blob);
  form.append('filename', file.name);

  //TODO: make better progress
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/upload');
  xhr.send(form);

  xhr.onload = () => console.log('file uploaded', xhr.status);
  xhr.onerror = () => console.log('something went wrong');
  xhr.onprogress = (event) => {
    console.log('uploaded', event.loaded, 'of', event.total);
  };
};

function FileDrop() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const onClick = useCallback(() => {
    if (!fileInputRef.current) return;

    fileInputRef.current.click();
  }, []);

  const onDragEnter = useCallback(() => {
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  }, []);

  const onDragLeave = useCallback(() => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDropCapture = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;

      if (files.length > 0) {
        uploadFile(files[0]);
      }

      dragCounter.current = 0;
      setIsDragging(false);
    },
    [],
  );

  const onInputChange = useCallback(() => {
    const files = fileInputRef.current?.files;
    if (!fileInputRef.current || !files || files.length === 0) {
      return;
    }

    const file = files[0];

    uploadFile(file);
  }, []);

  return (
    <div
      ref={parentRef}
      className="relative h-fit max-w-md cursor-pointer rounded-xl border border-border px-7 py-3 md:px-10 md:py-6"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDropCapture={onDropCapture}
      onClick={onClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="relative hidden"
        id="file"
        onChange={onInputChange}
      />

      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center opacity-0 transition-all duration-500 data-[is-dragging=true]:opacity-100"
        data-is-dragging={isDragging}
      >
        <MouseSvg className="size-10 stroke-foreground/70 md:size-10" />
        <p className="text-foreground/80">Release to upload file</p>
      </div>
      <div
        className="flex flex-col-reverse items-center gap-4 text-center transition-all duration-500 data-[is-dragging=true]:opacity-0 md:flex-row md:text-left"
        data-is-dragging={isDragging}
      >
        <FileUploadSvg className="size-8 fill-foreground/70 stroke-foreground/70 md:size-10" />

        <div>
          <h3 className="text-lg font-medium md:text-2xl">Drop Your File</h3>
          <p className="text-sm text-neutral-400">
            Drag and Drop or click to start uploading
          </p>
        </div>
      </div>
    </div>
  );
}

export default FileDrop;
