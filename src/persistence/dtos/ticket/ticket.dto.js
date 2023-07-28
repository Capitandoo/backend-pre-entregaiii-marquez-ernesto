export default class TicketDTO {
  async ticket(ticket) {
    let ticketParams = {
      amount: ticket.amount,
      purchaser: ticket.purchaser,
    };
    return ticketParams;
  }
}

