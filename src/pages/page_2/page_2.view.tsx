/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2022-06-02 23:00:15
 * @modify date 2022-06-02 23:00:15
 * @desc [description]
 */

import React from 'react';
import { historyAwext } from '$/components/embeder/history_awext';

export const Page2View = (props: any) => {
  return (
    <div>
      Hi there, this is page 2
      <br />
      <button
        onClick={() => {
          historyAwext.gotoHash({ hello: 'world' }, null, '../../page_1?a=1&b=2');
        }}
        type="button"
      >
        jump to page 1
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
