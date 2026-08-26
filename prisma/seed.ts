import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cliente = await prisma.cliente.create({
    data: {
      nome: "Construtora Alfa",
      email: "contato@alfa.com",
      telefone: "11999999999",
      documento: "12345678901",
    },
  });

  const obra1 = await prisma.obra.create({
    data: {
      clienteId: cliente.id,
      endereco: "Av Paulista, 1000",
      cidade: "São Paulo",
      estado: "SP",
      responsavel: "Eng. Roberto",
    },
  });

  const obra2 = await prisma.obra.create({
    data: {
      clienteId: cliente.id,
      endereco: "Rua Augusta, 500",
      cidade: "São Paulo",
      estado: "SP",
      responsavel: "Arq. Carla",
    },
  });

  const cacamba1 = await prisma.cacamba.create({
    data: { numero: "101", capacidade: 5.0, status: "LOCADA" },
  });

  const cacamba2 = await prisma.cacamba.create({
    data: { numero: "102", capacidade: 5.0, status: "LOCADA" },
  });

  await prisma.cacamba.create({
    data: { numero: "103", capacidade: 5.0, status: "DISPONIVEL" },
  });

  const hoje = new Date();

  await prisma.operacao.create({
    data: {
      tipo: "ENTREGA",
      obraId: obra1.id,
      cacambaId: cacamba1.id,
      dataAgendada: new Date(hoje.getTime() - 2 * 24 * 60 * 60 * 1000), // há 2 dias
      dataRealizada: new Date(hoje.getTime() - 2 * 24 * 60 * 60 * 1000),
      status: "CONCLUIDO",
    },
  });

  await prisma.operacao.create({
    data: {
      tipo: "RETIRADA",
      obraId: obra1.id,
      cacambaId: cacamba1.id,
      dataAgendada: new Date(hoje.getTime() + 1 * 24 * 60 * 60 * 1000), // amanhã
      status: "PENDENTE",
    },
  });

  await prisma.operacao.create({
    data: {
      tipo: "ENTREGA",
      obraId: obra2.id,
      cacambaId: cacamba2.id,
      dataAgendada: new Date(hoje.getTime() - 5 * 24 * 60 * 60 * 1000), // há 5 dias
      dataRealizada: new Date(hoje.getTime() - 5 * 24 * 60 * 60 * 1000),
      status: "CONCLUIDO",
    },
  });

  await prisma.operacao.create({
    data: {
      tipo: "RETIRADA",
      obraId: obra2.id,
      cacambaId: cacamba2.id,
      dataAgendada: new Date(hoje.getTime() - 1 * 24 * 60 * 60 * 1000), // ontem (atrasada)
      status: "PENDENTE",
    },
  });

  console.log("Seed executado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
