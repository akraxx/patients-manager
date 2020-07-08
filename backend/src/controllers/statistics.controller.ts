import {controller, httpGet, interfaces, queryParam, requestParam} from 'inversify-express-utils';
import {inject} from 'inversify';
import {TYPES} from '../constants/types';
import {ConsultationsService} from '../services/consultations.service';
import {InvoicesService} from '../services/invoices.service';
import {Consultation} from '../../../common/consultation.model';
import {Statistic} from '../../../common/statistic.model';
import {PatientsService} from '../services/patients.service';
import {StatisticsService} from '../services/statistics.service';

@controller('/api/statistics')
export class StatisticsController implements interfaces.Controller {

    constructor(@inject(TYPES.StatisticsService) private statisticsService: StatisticsService) {

    }

    @httpGet("/")
    private async list(@queryParam("year") year: string,
                       @queryParam("officeId") officeId?: string): Promise<Statistic> {
        return this.statisticsService.computeStatistics(year, officeId);
    }

}