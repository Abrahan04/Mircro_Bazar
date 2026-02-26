const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pool = require('./db'); // Reutilizamos tu conexión existente de db.js

// Creamos el adaptador usando tu pool de PostgreSQL
const adapter = new PrismaPg(pool);

// Solución para que JSON.stringify no falle con BigInt (conteos de SQL)
BigInt.prototype.toJSON = function () { return Number(this) };

// Iniciamos Prisma pasándole el adaptador
const prisma = new PrismaClient({ adapter });

module.exports = prisma;