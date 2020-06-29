import {controller, httpGet, httpPost, interfaces, queryParam, requestParam, response} from 'inversify-express-utils';
import {inject} from 'inversify';
import {TYPES} from '../constants/types';
import {ConsultationsService} from '../services/consultations.service';
import * as express from 'express';
import {InvoicesService} from '../services/invoices.service';
import {ReadStream} from 'fs';
import {logger} from '../logger/logger';
import {UserResponse} from '../../../common/user-response.model';
import {Consultation} from '../../../common/consultation.model';

@controller('/api/patients/:patientId/consultations')
export class ConsultationController implements interfaces.Controller {

    constructor(@inject(TYPES.ConsultationsService) private consultationsService: ConsultationsService,
                @inject(TYPES.InvoicesService) private invoicesService: InvoicesService) {

    }

    @httpGet("/")
    private async list(@requestParam("patientId") patientId: string): Promise<Consultation[]> {
        return this.consultationsService.getConsultations(patientId);
    }

    @httpGet("/:id")
    private async getById(@requestParam("patientId") patientId: string,
                        @requestParam("id") id: number,
                          next: express.NextFunction): Promise<Consultation> {
        return this.consultationsService.getConsultation(patientId, id);
    }

    @httpGet("/:id/invoice")
    private downloadConsulationInvoice(@requestParam("patientId") patientId: string,
                          @requestParam("id") id: number,
                                             @response() res: express.Response) {
        return this.invoicesService.downloadInvoice(patientId, id)
            .then((s: ReadStream) => {
                const filename = `invoice-${patientId}-${id}.pdf`;
                const mimetype = "application/pdf";

                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                res.setHeader('Content-type', mimetype);

                logger.info(JSON.stringify(s))
                return () => s.pipe(res);
            })
    }

    @httpPost("/:id/invoice")
    private sendConsulationInvoice(@requestParam("patientId") patientId: string,
                                       @requestParam("id") id: number,
                                       @response() res: express.Response): Promise<UserResponse> {
        return this.invoicesService.sendInvoice(patientId, id);
    }

}