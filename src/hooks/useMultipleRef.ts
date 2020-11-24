import { useRef, useCallback } from 'react';
import type { MutableRefObject } from 'react';


type InputRef<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null;


function useMultipleRef<T>(initialValue: T, refs: Array<InputRef<T>>) {
  const innerRef = useRef<T>(initialValue);

  const internalRef = useCallback((value: T) => {
    innerRef.current = value;

    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
        return;
      }

      if (ref) {
        // eslint-disable-next-line no-param-reassign
        (ref as any).current = value;
      }
    });
  }, [refs]);

  if (!(internalRef as any).current) {
    Object.defineProperty(internalRef, 'current', {
      get() {
        return innerRef.current;
      },
    });
  }

  return internalRef as typeof internalRef & { current: T };
}

export default useMultipleRef;
