import {
  AwextClass,
  AwextEventCallback,
  AwextName,
  AwextWatchCallback,
  parsePath,
} from '$/awext/core/typescript';

export interface PlaylistItemData {
  videoPreviewImageUrl?: string,
  _id: string,
  videoVid: string,
  videoLink: string,
  videoTitle: string,
  videoKeyword: string,
  videoEmbed: string,
}

export class PlaylistServiceClass extends AwextClass {
  static override grabOne(playlistId: AwextName) {
    return super.grabOne([].concat(['PlaylistServiceClass'], parsePath(playlistId, '/')));
  }
  sessionService: any
  playlist: PlaylistItemData[] = []
  _onInit(sessionService: any) {
    this.sessionService = sessionService;
  }
  addItemAfterCurrentPlaying(newItem: PlaylistItemData) {
    // check if current equals new
    if (this.currentPlayingItemId === newItem._id) return this.playlist; 
    // check if newItem exists in the playlist. if so, remove it
    const existingIndex = this.playlist.findIndex((item) => item._id === newItem._id);
    if (existingIndex > -1) {
      this.playlist.splice(existingIndex, 1);
    }
    // find current
    const currentIndex = this.playlist.findIndex((item) => item._id === this.currentPlayingItemId);
    if (currentIndex !== -1) {
      this.playlist.splice(currentIndex + 1, 0, newItem);
    } else {
      this.addItemToEnd(newItem);
    }
    this.awextEmit('onPlaylistChange', this.playlist);
    return this.playlist;
  }
  addItemToBeginning(newItem: PlaylistItemData) {
    // check if current equals new
    if (this.currentPlayingItemId === newItem._id) return this.playlist;
    // check if newItem exists in the playlist. if so, remove it
    const existingIndex = this.playlist.findIndex((item) => item._id === newItem._id);
    if (existingIndex > -1) {
      this.playlist.splice(existingIndex, 1);
    }
    this.playlist.unshift(newItem);
    this.awextEmit('onPlaylistChange', this.playlist);
    return this.playlist;
  }
  addItemToEnd(newItem: PlaylistItemData) {
    // check if current equals new
    if (this.currentPlayingItemId === newItem._id) return this.playlist;
    // check if newItem exists in the playlist. if so, remove it
    const existingIndex = this.playlist.findIndex((item) => item._id === newItem._id);
    if (existingIndex > -1) {
      this.playlist.splice(existingIndex, 1);
    }
    this.playlist.push(newItem);
    this.awextEmit('onPlaylistChange', this.playlist);
    return this.playlist;
  }
  isItemIdInTheList(itemId: string): boolean {
    return this.playlist.findIndex((item) => {
      return item._id === itemId;
    }) > -1;
  }
  play(id?: string): string {
    if (!id && this.playlist[0]) id = this.playlist[0]._id;
    if (id) {
      const video = this.playlist.find((videoItem) => videoItem._id === id);
      if (video) {
        this.currentPlayingItemId = video._id;
        this.sessionService.communityTalkPod.sendTalk('playlistService', 'videoPlayer', 'playVideoData', {
          videoData: this.currentPlayingItemData,
        });
        return this.currentPlayingItemId;
      } else {
        return null;
      }
    }
    return null;
  }
  onPlay(cb: AwextEventCallback) {
    return this.sessionService.communityTalkPod.receiveTalk('playlistService', 'videoPlayer', 'playVideoData', (_: any, communityData: any) => {
      const videoData: PlaylistItemData = communityData.payload.videoData;
      cb(_, videoData);
    });
  }
  onPlaylistChange(cb: AwextEventCallback) {
    return this.awextOn('onPlaylistChange', cb);
  }
  get currentPlayingItemId(): string {
    return this.awextGetPath('currentPlayingItemId') as string;
  }
  set currentPlayingItemId(newValue: String) {
    this.awextSetPath('currentPlayingItemId', newValue);
  }
  watchCurrentPlayingItem(cb: AwextWatchCallback) {
    return this.awextWatchPath('currentPlayingItemId', () => {
      cb(null, this.currentPlayingItemData);
    });
  }
  get currentPlayingItemData(): PlaylistItemData {
    const { currentPlayingItemId } = this;
    let itemData = this.playlist.find((item) => {
      return item._id === currentPlayingItemId;
    });
    if (itemData) {
      itemData = Object.assign({}, itemData);
    }
    return itemData;
  }
}
