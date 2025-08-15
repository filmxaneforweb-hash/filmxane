import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  // TODO: Implement payment logic
  async processPayment() {
    return { success: true };
  }
}
