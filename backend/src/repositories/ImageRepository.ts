import knex from '../db';
import Image from '../entities/Image';

export class ImageRepository {
  async getAllImages(): Promise<Image[]> {
    return await knex('images').select('*');
  }

  async getImageById(id: string): Promise<Image | undefined> {
    return await knex('images').where('id', id).first();
  }

  async createImage(data: Image): Promise<number[]> {
    return await knex('images').insert(data);
  }

  async updateImage(id: string, data: Partial<Image>): Promise<number> {
    return await knex('images').where('id', id).update(data);
  }

  async deleteImage(id: string): Promise<number> {
    return await knex('images').where('id', id).del();
  }
}
