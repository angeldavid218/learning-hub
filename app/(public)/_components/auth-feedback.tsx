import { type AuthFormState } from "@/src/auth/actions";

interface AuthFeedbackProps {
  state: AuthFormState;
}

export const AuthFeedback = ({ state }: AuthFeedbackProps) => {
  if (state.error) {
    return (
      <div role="alert" className="alert alert-error">
        <span>{state.error}</span>
      </div>
    );
  }

  if (state.message) {
    return (
      <div role="alert" className="alert alert-success">
        <span>{state.message}</span>
      </div>
    );
  }

  return null;
};
