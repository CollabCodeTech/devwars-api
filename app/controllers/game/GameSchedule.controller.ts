import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import { ICreateGameScheduleRequest, IUpdateGameScheduleRequest } from "../../request/IGameScheduleRequest";

import GameSchedule from '../../models/GameSchedule';
import { GameStatus } from '../../models/GameSchedule';
import GameScheduleRepository from '../../repository/GameSchedule.repository';
import GameService from '../../services/Game.service';

const { validationResult } = require('express-validator/check');

function flattenSchedule(schedule: GameSchedule) {
    return {
        ...schedule.setup,
        id: schedule.id,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
        status: schedule.status,
    };
}

export async function show(request: Request, response: Response) {
    const scheduleId = request.params.id;
    const schedule = await GameSchedule.findOne(scheduleId);
    if (!schedule) return response.sendStatus(404);

    response.json(flattenSchedule(schedule));
}

export async function all(request: Request, response: Response) {
    const schedules = await GameSchedule.find();

    response.json(schedules.map((schedule) => flattenSchedule(schedule)));
}

export async function update(request: Request, response: Response) {
    const scheduleId = request.params.id;
    const params = { ...request.body as IUpdateGameScheduleRequest };

    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).json({ errors: errors.array() });

    const schedule = await GameSchedule.findOne(scheduleId);
    if (!schedule) return response.sendStatus(404);

    schedule.setup.title = params.title || schedule.setup.title;
    schedule.startTime = params.startTime || schedule.startTime;
    schedule.setup.objectives = params.objectives || schedule.setup.objectives;

    try {
        await schedule.save();
    } catch(e) {
        return response.status(500).json({"error": e.message})
    }

    response.json(flattenSchedule(schedule));
}

export async function latest(request: Request, response: Response) {
    const gameScheduleRepository = await getCustomRepository(GameScheduleRepository);
    const latestSchedule = await gameScheduleRepository.latest();
    if (!latestSchedule) return response.sendStatus(404);

    response.json(flattenSchedule(latestSchedule));
}

export async function byStatus(request: Request, response: Response) {
    const toEnum: string = (request.params.status || '').toUpperCase();
    const status: GameStatus = (GameStatus as any)[toEnum];

    const gameScheduleRepository = await getCustomRepository(GameScheduleRepository);
    const schedules = await gameScheduleRepository.findAllByStatus(status);
    response.json(schedules.map((schedule) => flattenSchedule(schedule)));
}

export async function create(request: Request, response: Response) {

    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).json({ errors: errors.array() });

    const params = { ...request.body as ICreateGameScheduleRequest };

    const schedule = new GameSchedule();

    schedule.startTime = new Date(params.startTime);
    schedule.setup = {
        mode: params.mode,
        title: params.title,
        objectives: params.objectives,
    };

    try {
        await schedule.save();
    } catch(e) {
        return response.status(500).json({"error": e.message})
    }

    response.json(flattenSchedule(schedule));
}
