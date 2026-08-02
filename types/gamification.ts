/**
 * Gamification model. The rule engines (level curve, badge conditions) live in
 * features/gamification/ and are consumed by the dashboard UI.
 */

export interface LevelDef {
  level: number;
  /** Total XP required to REACH this level (from level 1). */
  xpRequired: number;
  title: string;
  /** Lucide icon name for the level badge. */
  icon: string;
}

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  /** Lucide icon name. */
  icon: string;
  /** XP bonus granted when the badge is earned. */
  xp: number;
  /** Stable id used to reference the badge from badge rules. */
  rule: string;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  rule: string;
}

/** Evaluated badge/achievement outcome produced by the badge service. */
export interface AwardResult {
  earned: Array<BadgeDef | AchievementDef>;
  xpBonus: number;
}
