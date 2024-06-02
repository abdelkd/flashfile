export const readFileInput = async (file: File): Promise<Blob | null> => {
  return new Promise((res, rej) => {
    try {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (result !== null) {
          const blob = new Blob([result], { type: 'application/octet-stream' });
          res(blob);
        }
      };
      reader.readAsArrayBuffer(file);

      reader.onerror = () => {
        res(null);
      };
    } catch (err) {
      rej(err);
    }
  });
};
