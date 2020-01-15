import * as discord from 'discord.js';
import * as SQLite from 'better-sqlite3';

export interface ExecuteFunction {
    (message: discord.Message, args: string[]): void;
    (message: discord.Message, args: string[], client: discord.Client): void;
    (
        message: discord.Message,
        args: string[],
        client: discord.Client,
        db: SQLite.Database
    ): void;
    (
        message: discord.Message,
        args: string[],
        client: discord.Client,
        db: SQLite.Database,
        score?: ScoreObject
    ): void;
    (
        message: discord.Message,
        args: string[],
        client: discord.Client,
        db: SQLite.Database,
        scoreDB: SQLite.Database
    ): void;
    (
        message: discord.Message,
        args: string[],
        client: SQLite.Database,
        db: discord.Client
    ): void;
    (message: discord.Message, args: string[], score?: ScoreObject): void;
}

export interface CommandModule {
    name: string;
    execute: ExecuteFunction;
}

export interface Helper {
    getBadge: SQLite.Statement;
    setBadge: SQLite.Statement;
    getScore: SQLite.Statement;
    setScore: SQLite.Statement;
}

export interface ScoreObject {
    id: string;
    user: string;
    guild: string;
    points: number;
    level: number;
    last_msg: number;
    streak: number;
    prev_points: number;
}
