import React from 'react';
import { HelloModelClass } from './hello.model';

export const HelloView = (prop: any) => {
  const modelAwext: HelloModelClass = HelloModelClass.useAwext(prop, React);
  return (
    <div>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => {
          modelAwext.count += 1;
        }}
      >
        {modelAwext.helloWorldText}
        &nbsp;
        {modelAwext.count}
      </button>
    </div>
  );
};
