import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { Unit } from './entities/unit.entity';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectRepository(Track) private trackRepo: Repository<Track>,
    @InjectRepository(Unit) private unitRepo: Repository<Unit>,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
  ) {}

  async findPublishedTracks() {
    return this.trackRepo.find({
      where: { isPublished: true },
      order: { sortOrder: 'ASC' },
      relations: ['units', 'units.lessons'],
    });
  }

  async findTrackBySlug(slug: string) {
    const track = await this.trackRepo.findOne({
      where: { slug },
      relations: ['units', 'units.lessons'],
    });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async findLesson(id: string) {
    const lesson = await this.lessonRepo.findOne({
      where: { id },
      relations: ['unit', 'unit.track'],
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async createTrack(data: Partial<Track>) {
    return this.trackRepo.save(data);
  }

  async createUnit(data: Partial<Unit>) {
    return this.unitRepo.save(data);
  }

  async createLesson(data: Partial<Lesson>) {
    return this.lessonRepo.save(data);
  }

  async updateTrack(id: string, data: Partial<Track>) {
    await this.trackRepo.update(id, data);
    return this.trackRepo.findOne({ where: { id } });
  }

  async findAllTracks() {
    return this.trackRepo.find({ relations: ['units', 'units.lessons'], order: { sortOrder: 'ASC' } });
  }
}
