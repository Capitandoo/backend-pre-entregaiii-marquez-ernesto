import MongoDao from "../mongo.dao.js";
import { ticketModel } from "../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

export default class TicketManagerDB extends MongoDao {
  constructor() {
    super (ticketModel)
  }
  async addTicket(ticket) {
    try {
      ticket.code = uuidv4();
      let result = await ticketModel.create(ticket);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }
}
