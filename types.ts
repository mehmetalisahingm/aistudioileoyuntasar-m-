import React from 'react';

export enum GameStage {
  INTRO = 'INTRO',
  CHARACTER_SELECT = 'CHARACTER_SELECT',
  SHADOW_MATCH = 'SHADOW_MATCH',
  ADVENTURE = 'ADVENTURE',
  SIZE_SORT = 'SIZE_SORT',
  CIPHER = 'CIPHER',
  LOGIC_PUZZLE = 'LOGIC_PUZZLE',
  REWARD_SELECT = 'REWARD_SELECT', // New stage for selecting the image
  REWARD_PAINT = 'REWARD_PAINT',   // Actual painting stage
  PARENTS_INFO = 'PARENTS_INFO'
}

export enum CharacterType {
  BEAR = 'BEAR',
  RABBIT = 'RABBIT',
  CAT = 'CAT'
}

export enum ColoringPageType {
  BEAR = 'BEAR',
  ROCKET = 'ROCKET',
  FLOWER = 'FLOWER'
}

export interface Character {
  id: CharacterType;
  name: string;
  color: string;
  secondaryColor: string;
  description: string;
  icon: React.ReactNode;
}

export interface CipherSymbol {
  id: string;
  icon: React.ReactNode;
  color: string;
  sound: string;
}

export interface GameState {
  stage: GameStage;
  selectedCharacter: CharacterType | null;
  score: number;
  adventureCompleted: boolean;
  cipherCompleted: boolean;
}