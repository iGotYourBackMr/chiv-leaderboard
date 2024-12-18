import { PlayFab, PlayFabClient } from 'playfab-sdk';

// Initialize PlayFab
const titleId = process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID;
if (!titleId) {
  throw new Error('PlayFab Title ID is not configured');
}

PlayFab.settings.titleId = titleId;

export interface PlayFabLeaderboardEntry {
  PlayFabId: string;
  DisplayName: string;
  StatValue: number;
  Position: number;
}

export class PlayFabService {
  static async login(customId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      PlayFabClient.LoginWithCustomID({
        CustomId: customId,
        CreateAccount: true
      }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  static async getLeaderboard(
    statName: string = "ELO",
    startPosition: number = 0,
    maxResults: number = 20
  ): Promise<PlayFabLeaderboardEntry[]> {
    return new Promise((resolve, reject) => {
      PlayFabClient.GetLeaderboard({
        StatisticName: statName,
        StartPosition: startPosition,
        MaxResultsCount: maxResults
      }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result.data.Leaderboard);
      });
    });
  }

  static async updatePlayerStatistic(
    statName: string,
    value: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      PlayFabClient.UpdatePlayerStatistics({
        Statistics: [{
          StatisticName: statName,
          Value: value
        }]
      }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  static async getPlayerProfile(playFabId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      PlayFabClient.GetPlayerProfile({
        PlayFabId: playFabId,
        ProfileConstraints: {
          ShowDisplayName: true,
          ShowStatistics: true,
          ShowAvatarUrl: true
        }
      }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result.data.PlayerProfile);
      });
    });
  }
} 