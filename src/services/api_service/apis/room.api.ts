import { ApiService, HttpResponse, HttpResponseData } from '../api_service';

export interface RoomDoc {
  roomCode: string,
  ownerUserId?: string,
  ownerSessionId: string,
  levelData?: any,
  currentWorkId?: string,
  photonRegion?: string,
  createdAt: string,
  updatedAt: string,
  deletedAt?: string,
  [propName: string]: any,
}

export interface RoomInfoResponseData extends HttpResponseData {
  roomDoc: RoomDoc,
  roomEntranceDoc: any,
  userRole: string,
}
export interface RoomInfoResponse extends HttpResponse {
  data: RoomInfoResponseData,
}

// room leaderboard
export interface RoomLeaderboardApiLeaderboardItem {
  value: string,
  score: number,
}

export interface RoomLeaderboardResponseData extends HttpResponseData {
  coderLeaderboard: RoomLeaderboardApiLeaderboardItem[],
  fastestLeaderboard: RoomLeaderboardApiLeaderboardItem[],
}
export interface RoomLeaderboardResponse extends HttpResponse {
  data: RoomLeaderboardResponseData,
}

export interface RoomLeaderboardUploadParamItem {
  playerSessionPublicId: string,
  codescore?: number,
  timeTaken?: number,
  playerName: string,
  roomCode: string,
}

// my score
export interface RoomLeaderboardMyScoreResponseData extends HttpResponseData {
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
export interface RoomLeaderboardMyScoreResponse extends HttpResponse {
  data: RoomLeaderboardMyScoreResponseData,
}

export class RoomApiClass {
  apiService: ApiService = null;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  roomInfo(roomCode: string, params?: any): Promise<RoomInfoResponse> {
    return this.apiService.clientGet(`/room/${roomCode}/info`, params) as Promise<RoomInfoResponse>;
  }

  createRoom(): any {
    return this.apiService.clientGet(`/room/create`);
  }

  getEntranceCodeInfo(args: any): any {
    return this.apiService.clientGet(`/room/entrance`, args);
  }

  getLevelData(roomCode: string): any {
    return this.apiService.clientGet(`/room/${roomCode}/level_data`);
  }

  setLevelData(roomCode: string, args?: any): any {
    return this.apiService.clientPost(`/room/${roomCode}/level_data`, null, args);
  }

  modifyRoomInfo(roomCode: string, info: { [propName: string]: any }): any {
    return this.apiService.clientPut(`/room/${roomCode}/info`, null, info);
  }

  // room leaderboard
  roomLeaderboardNewScore(roomCode: string, params: RoomLeaderboardUploadParamItem[]): Promise<RoomLeaderboardResponse> {
    return this.apiService.clientPost(`/room/${roomCode}/room-leaderboard/new-score`, null, {
      newScore: params,
    }) as Promise<RoomLeaderboardResponse>;
  }
  roomLeaderboardGetData(roomCode: string): Promise<RoomLeaderboardResponse> {
    return this.apiService.clientGet(`/room/${roomCode}/room-leaderboard`) as Promise<RoomLeaderboardResponse>;
  }
  roomLeaderboardErase(roomCode: string): Promise<any> {
    return this.apiService.clientDelete(`/room/${roomCode}/room-leaderboard`) as Promise<any>;
  }
  roomLeaderboardGetMyScore(roomCode: string): Promise<RoomLeaderboardMyScoreResponse> {
    return this.apiService.clientGet(`/room/${roomCode}/room-leaderboard/my-score`) as Promise<RoomLeaderboardMyScoreResponse>;
  }
}
