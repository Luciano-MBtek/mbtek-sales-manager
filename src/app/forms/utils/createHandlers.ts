export const createHandleSelectChange =
  (updateFunction: (data: any) => void) =>
  (fieldId: string) =>
  (value: string) => {
    updateFunction({ [fieldId]: value });
  };
export const createHandleInputChange = (
  updateFunction: (data: Record<string, any>) => void
) => {
  return (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    updateFunction({ [e.target.name]: e.target.value });
  };
};

export const createHandleCheckboxChange =
  (updateFunction: (data: Record<string, any>) => void) =>
  (fieldId: string) =>
  (value: string | string[]) => {
    updateFunction({ [fieldId]: value });
  };

export const createHandleRadioChange =
  (updateFunction: (data: Record<string, any>) => void) =>
  (fieldId: string) =>
  (value: string) => {
    updateFunction({ [fieldId]: value });
  };

export const createHandleDateChange =
  (updateFunction: (data: Record<string, any>) => void) =>
  (fieldId: string) =>
  (date: Date | undefined) => {
    updateFunction({ [fieldId]: date ? date.toISOString() : "" });
  };

export const getDateValue = (
  data: Record<string, any>,
  fieldId: string
): Date | undefined => {
  const dateString = data[fieldId];
  if (dateString) {
    const parsedDate = new Date(dateString as string);
    return !isNaN(parsedDate.getTime()) ? parsedDate : undefined;
  }
  return undefined;
};
