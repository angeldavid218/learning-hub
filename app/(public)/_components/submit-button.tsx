"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
  pendingLabel: string;
}

export const SubmitButton = ({ label, pendingLabel }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
};
