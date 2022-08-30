import { CACHE_MANAGER, Controller, Get, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  //Dummy database
  Benef = [
    {
      nome: 'joao',
      idade: '4',
      cpf: '123421',
    },
    {
      nome: 'antony',
      idade: '4',
      cpf: '542152',
    },
    {
      nome: 'ana',
      idade: '4',
      cpf: '521216',
    },
    {
      nome: 'maria',
      idade: '4',
      cpf: '754345',
    },
  ];
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get('get-benef-cache')
  async getBenef(): Promise<any> {
    const { cpf } = this.Benef.find((e) => e.cpf === '123421');
    const val = await this.cacheManager.get(cpf);
    if (val) {
      return {
        data: val,
        FromRedis: 'this is loaded from redis cache',
      };
    }

    if (!val) {
      for (const benef of this.Benef) {
        await this.cacheManager.set(benef.cpf, benef, {
          ttl: 1000,
        });
      }
      return {
        data: this.Benef,
        FromBenef: 'this is loaded from Benef',
      };
    }
  }
}
