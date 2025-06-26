import { pgTable, text } from "drizzle-orm/pg-core";

export const medicamento = pgTable('medicamento', {
    id: text().primaryKey(),
    name: text(),
    numRegistro: text(),
    categoria: text(),
    indicacao: text(),
    contraindicacao: text(),
    reacao_adversa: text(),
    cuidados: text(),
    posologia: text(),
    riscos: text(),
    especiais: text(),
    superdose: text()
});

