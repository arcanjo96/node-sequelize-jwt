import Appointment from "../models/Appointment";
import User from "../models/User";
import * as Yup from "yup";
import { startOfHour, parseISO, isBefore } from "date-fns";

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validação falhou." });
    }

    const { provider_id, date } = req.body;

    //checa se o provider_id passado, realmente é um provider.
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!checkIsProvider) {
      return res.status(401).json({
        error: "Você só pode marcar agendamento com prestadores de serviço."
      });
    }

    //pega a data sem minutos e segundos
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ error: "Data não permitida, pois já passou." });
    }

    const checkAvailability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hourStart }
    });

    if (checkAvailability) {
      return res.status(400).json({ error: "Data não permitida." });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
