/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-06-17 11:32:28
 * @modify date 2021-06-17 11:32:31
 * @desc [description]
 */
import { ApiService, HttpResponse, HttpResponseData } from '../api_service';

export interface Work {
  _id: string,
  workName: string,
  workCoverImage?: string,
  workDescription?: string,
  forkedFrom?: Work,
  ownerUserId?: string,
  ownerSessionId?: string,
  blocklyXML?: string,
  levelData?: any,
  createdAt: string,
  $amIOwner?: boolean,
  [propName: string]: any,
}

export interface WorkInfoResponseData extends HttpResponseData {
  workDoc: Work,
}
export interface WorkInfoResponse extends HttpResponse {
  data: WorkInfoResponseData
}

export interface MyWorksResponseData extends HttpResponseData {
  myWorks: Array<Work>,
  currentPageNumber: number,
  nextPageNumber: number,
}
export interface MyWorksResponse extends HttpResponse {
  data: MyWorksResponseData,
}

export interface NewWorkResponseData extends HttpResponseData {
  newWork: Work,
}
export interface NewWorkResponse extends HttpResponse {
  data: NewWorkResponseData,
}

// official works
export interface OfficialWorksResponseData extends HttpResponseData {
  officialWorks: Array<Work>,
  currentPageNumber: number,
  nextPageNumber: number,
}

export interface OfficialWorksResponse extends HttpResponse {
  data: OfficialWorksResponseData,
}

// week-1
export interface Week001ApiLeaderboardItem {
  value: string,
  score: number,
}

export interface Week001LeaderboardResponseData extends HttpResponseData {
  coderLeaderboard: Week001ApiLeaderboardItem[],
  fastestLeaderboard: Week001ApiLeaderboardItem[],
}
export interface Week001LeaderboardResponse extends HttpResponse {
  data: Week001LeaderboardResponseData,
}

export interface Week001LeaderboardUploadParamItem {
  playerSessionPublicId: string,
  codescore?: number,
  timeTaken?: number,
  playerName: string,
  roomCode: string,
}

export interface Week001UnityPlayerScoreDataItem {
  timeTaken: number,
  codescore: number,
  userName: string,
}
export interface Week001UnityPlayerScoreData {
  [playerSessionPublicId: string]: Week001UnityPlayerScoreDataItem
}

// my score
export interface Week001MyScoreResponseData extends HttpResponseData {
  myCoder: {
    score: number,
    value: string,
    ranking: number,
  } | null,
  myFastest: {
    score: number,
    value: string,
    ranking: number,
  } | null,
}
export interface Week001MyScoreResponse extends HttpResponse {
  data: Week001MyScoreResponseData,
}

export class WorkApiClass {
  apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  getWorkInfo(workId: string): Promise<WorkInfoResponse> {
    return this.apiService.clientGet(`/work/${workId}`) as Promise<WorkInfoResponse>;
  }

  deleteWork(workId: string): Promise<HttpResponse> {
    return this.apiService.clientDelete(`/work/${workId}`) as Promise<HttpResponse>;
  }

  patchWorkInfo(workId: string, info: any): Promise<WorkInfoResponse> {
    return this.apiService.clientPatch(`/work/${workId}`, null, info) as Promise<WorkInfoResponse>;
  }

  getRoomClientWork(roomCode: string): Promise<WorkInfoResponse> {
    return this.apiService.clientGet(`/work/roomClientWork/${roomCode}`) as Promise<WorkInfoResponse>;
  }

  patchRoomClientWork(roomCode: string, patchInfo: any): Promise<WorkInfoResponse> {
    return this.apiService.clientPatch(`/work/roomClientWork/${roomCode}`, null, patchInfo) as Promise<WorkInfoResponse>;
  }

  getMyWorks(pageNumber: number|string): Promise<MyWorksResponse> {
    return this.apiService.clientGet(`/work/my_works`, { p: pageNumber }) as Promise<MyWorksResponse>;
  }

  getOfficialWorks(pageNumber: number|string): Promise<OfficialWorksResponse> {
    return this.apiService.clientGet('/work/official_works', { p: pageNumber }) as Promise<OfficialWorksResponse>;
  }

  createNewWork(workName: string): Promise<NewWorkResponse> {
    return new Promise((resolve, reject) => {
      this.apiService.clientPost('/work/new', null, { workName }, {
        responseErrorUse: reject,
      })
        .then(resolve);
    });
  }

  changeRoomClientWork(roomCode: string, workId: string): Promise<WorkInfoResponse> {
    return this.apiService.clientPost(`/work/roomClientWork/${roomCode}/changeWork/${workId}`) as Promise<WorkInfoResponse>;
  }

  patchLevelDataItem(workId: string, levelDataItemKey: string, value: any): Promise<HttpResponse> {
    return this.apiService.clientPatch(`/work/${workId}/levelData/${levelDataItemKey}`, null, value) as Promise<HttpResponse>;
  }

  fork(workId: string, extraWorkProperties?: any): Promise<NewWorkResponse> {
    return this.apiService.clientPost(`/work/fork/${workId}`, null, extraWorkProperties) as Promise<NewWorkResponse>;
  }

  week001LeaderboardNewScore(roomCode: string, params: Week001LeaderboardUploadParamItem | Week001LeaderboardUploadParamItem[]): Promise<Week001LeaderboardResponse> {
    if (!Array.isArray(params)) {
      params = [params];
    }
    return this.apiService.clientPost(`/work/-room/${roomCode}/weekly-challenge/week-001/new-score`, null, {
      newScore: params,
    }) as Promise<Week001LeaderboardResponse>;
  }
  week001LeaderboardGetData(): Promise<Week001LeaderboardResponse> {
    return this.apiService.clientGet(`/work/weekly-challenge/week-001/leaderboard`) as Promise<Week001LeaderboardResponse>;
  }
  week001LeaderboardGetMyScore(roomCode: string): Promise<Week001MyScoreResponse> {
    return this.apiService.clientGet(`/work/-room/${roomCode}/weekly-challenge/week-001/my-score`) as Promise<Week001MyScoreResponse>;
  }
}
