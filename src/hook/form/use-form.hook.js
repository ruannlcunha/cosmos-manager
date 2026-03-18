import { useState } from "react";

export function useForm(initialFormData) {
  const [formData, setFormData] = useState(initialFormData);

  function handleChange({ target }) {
    const fieldValue = target.value;
    const fieldName = target.name;
    setFormData((pastInfo) => ({
      ...pastInfo,
      [fieldName]: fieldValue,
    }));
  }

  return { formData, handleChange, setFormData };
}
