import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useReducer, useMemo } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

// Define types
type RequestType = {
  id: Id<"members">;
  role: "admin" | "member";
};
type ResponseType = Id<"members"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

// Define state structure
type State = {
  data: ResponseType;
  error: Error | null;
  status: "success" | "error" | "settled" | "pending" | null;
};

// Define actions for the reducer
type Action =
  | { type: "pending" }
  | { type: "success"; payload: ResponseType }
  | { type: "error"; payload: Error }
  | { type: "settled" };

// Reducer function to manage state transitions
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "pending":
      return { ...state, status: "pending", error: null, data: null };
    case "success":
      return { ...state, status: "success", data: action.payload, error: null };
    case "error":
      return { ...state, status: "error", error: action.payload };
    case "settled":
      return { ...state, status: "settled" };
    default:
      return state;
  }
};

export const useUpdateMember = () => {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    error: null,
    status: null,
  });

  const mutation = useMutation(api.members.update);

  const mutate = useCallback(
    async (values: RequestType, options: Options = {}) => {
      dispatch({ type: "pending" });

      try {
        const response = await mutation(values);
        dispatch({ type: "success", payload: response });
        options.onSuccess?.(response);
        return response;
      } catch (error) {
        dispatch({ type: "error", payload: error as Error });
        options.onError?.(error as Error);
        if (options.throwError) {
          throw error;
        }
      } finally {
        dispatch({ type: "settled" });
        options.onSettled?.();
      }
    },
    [mutation],
  );

  const isPending = useMemo(() => state.status === "pending", [state.status]);
  const isSuccess = useMemo(() => state.status === "success", [state.status]);
  const isError = useMemo(() => state.status === "error", [state.status]);
  const isSettled = useMemo(() => state.status === "settled", [state.status]);

  return { mutate, ...state, isPending, isSuccess, isError, isSettled };
};
