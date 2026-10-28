import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

// Loads JSON from the backend. Returns { data, error, loading, reload, setData }.
export function useApi(path) {
  const [state, setState] = useState({ data: null, error: "", loading: true });

  const load = useCallback(
    () =>
      api(path)
        .then((data) => setState({ data, error: "", loading: false }))
        .catch((e) =>
          setState((s) => ({
            ...s,
            loading: false,
            error: e.status === 401 ? "Your session has expired. Please log out and log in again." : e.message,
          }))
        ),
    [path]
  );

  useEffect(() => {
    load();
  }, [load]);

  const setData = useCallback((data) => setState((s) => ({ ...s, data })), []);
  return { ...state, reload: load, setData };
}
