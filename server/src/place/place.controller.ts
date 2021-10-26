import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { Event } from 'src/event/event';
import { MyLogger } from 'src/logger/logger.service';
import { PlaceService } from './place.service';

@Controller('api/place')
export class PlaceController {
    constructor(
        private readonly placeService: PlaceService,
        private readonly logger: MyLogger,
        private readonly eventEmitter: EventEmitter2
    ) {}

    @Get('/:placeId')
    async readPlace(@Param('placeId') placeId: string) {
        this.logger.debug('placeId : ', placeId);
        return await this.placeService.readPlace(placeId);
    }

    @Get('/search/:regionId')
    async searchPlace(@Param('regionId') regionId: string, @Query('query') query: string, @Query('page') page: number = 1, @Query('perPage') perPage: number = 10) {
        this.logger.debug('regionId : ', regionId, ' query : ', query, ' page : ', page, ' perPage : ', perPage);
        if (page < 1 || perPage < 1) throw new BadRequestException();
        return await this.placeService.searchPlace(query, regionId, page, perPage);
    }

    @Get('/region/:regionId')
    async readRegionPlaces(@Param('regionId') regionId: string, @Query('paginator') paginator: string, @Query('page') page: number = 1, @Query('perPage') perPage: number = 10) {
        this.logger.debug('regionId : ', regionId, 'paginator : ', paginator, 'page', page, ' perPage : ', perPage);
        if (!regionId && !paginator) throw new BadRequestException();
        if (page < 1 || perPage < 1) throw new BadRequestException();
        if (!paginator) paginator = await this.placeService.getPaginator(regionId, perPage);
        this.eventEmitter.emit('place.listed', new Event(null, regionId));
        return await this.placeService.readRegionPlaces(paginator, page);
    }
}
