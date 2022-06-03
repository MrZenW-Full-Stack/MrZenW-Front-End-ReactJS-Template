/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2022-06-02 14:28:04
 * @modify date 2022-06-02 14:28:04
 * @desc [description]
 */

import React from 'react';
import { historyAwext } from '$/components/embeder/history_awext';

export const Page1View = (props: any) => {
  return (
    <div>
      Hi there, this is page 1
      <br />
      <button
        onClick={() => {
          historyAwext.gotoHash({ hello: 'page_2' }, null, '/page_2');
        }}
        type="button"
      >
        jump to page 2
      </button>
      <hr />
      currentState
      <br />
      {historyAwext.currentState && JSON.stringify(historyAwext.currentState)}
      <hr />
      hashPathname
      <br />
      {historyAwext.hashPathname && historyAwext.hashPathname}
      <hr />
      hashSearch
      <br />
      {historyAwext.hashSearch && historyAwext.hashSearch}
      <hr />
    </div>
  );
};
