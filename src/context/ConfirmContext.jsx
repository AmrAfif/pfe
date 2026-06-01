import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { X } from 'lucide-react';

const ConfirmContext = createContext({
  confirm: async () => false,
});

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setState({
        ...options,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback((result) => {
    if (!state) return;
    state.resolve(result);
    setState(null);
  }, [state]);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {state ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => handleClose(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-library-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-ink-900">{state.title || 'Confirm action'}</p>
                {state.description && <p className="mt-2 text-sm text-ink-600">{state.description}</p>}
              </div>
              <button
                onClick={() => handleClose(false)}
                className="rounded-full border border-library-200 p-2 text-ink-500 hover:bg-library-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => handleClose(false)}
                className="w-full rounded-2xl border border-library-200 px-4 py-3 text-sm font-medium text-ink-700 hover:bg-library-50 transition-colors sm:w-auto"
              >
                {state.cancelText || 'Cancel'}
              </button>
              <button
                onClick={() => handleClose(true)}
                className="w-full rounded-2xl bg-library-500 px-4 py-3 text-sm font-semibold text-white hover:bg-library-600 transition-colors sm:w-auto"
              >
                {state.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
};
