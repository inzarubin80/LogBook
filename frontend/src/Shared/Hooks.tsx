import { useState, useCallback, ChangeEvent, useRef, useEffect, SyntheticEvent, FormEvent } from 'react';
var _ = require('lodash');

//import { CheckboxProps, DropdownProps, InputOnChangeData, TextAreaProps } from 'semantic-ui-react';

export type RunFunc<T> = (promise: Promise<any>, onSuccess?: (data: T) => void, onFailure?: Function) => void

export const useRequest = <T extends Object>(initData: T): [boolean, string, RunFunc<T>, T] => {
  const [data, setData] = useState(initData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // prevent setters if component is unmounted
  // this can happen if e.g. onSuccess callback causes page navigation
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);

  // we could just return the promise from run(), but using onSuccess and onFailure callbacks 
  // allows us to react before the loading/errors states change - this is mostly useful if 
  // we want to redirect before the not-loading layout can show itself
  const run = useCallback((promise: Promise<any>, onSuccess?: (data: T) => void, onFailure?: Function) => {
    setLoading(true);
    setError('');

    return promise
      .then(data => {
        if (onSuccess) {
          onSuccess(data);
        }
        if (isMountedRef.current) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(error => {
        if (onFailure) {
          onFailure(error);
        }
        if (isMountedRef.current) {
          setError(error);
          setLoading(false);
        }
      });
  }, [])

  return [loading, error, run, data];
}

