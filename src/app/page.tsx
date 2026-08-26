import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Map, AlertTriangle, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  // Fetch real data using Prisma
  const totalCacambasLocadas = await prisma.cacamba.count({
    where: { status: "LOCADA" },
  });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const entregasPendentesHj = await prisma.operacao.count({
    where: {
      tipo: "ENTREGA",
      status: "PENDENTE",
      dataAgendada: {
        gte: hoje,
        lt: new Date(hoje.getTime() + 24 * 60 * 60 * 1000),
      }
    },
  });

  const entregasPendentesGeral = await prisma.operacao.count({
    where: {
      tipo: "ENTREGA",
      status: "PENDENTE",
    },
  });

  const retiradasAtraso = await prisma.operacao.count({
    where: {
      tipo: "RETIRADA",
      status: "PENDENTE",
      dataAgendada: {
        lt: hoje,
      }
    },
  });

  const operationsDoneThisMonth = await prisma.operacao.count({
    where: {
      status: "CONCLUIDO",
      dataRealizada: {
        gte: new Date(hoje.getFullYear(), hoje.getMonth(), 1),
      }
    },
  });

  const proximasOperacoes = await prisma.operacao.findMany({
    where: {
      status: "PENDENTE",
    },
    include: {
      obra: {
        include: {
          cliente: true
        }
      },
      cacamba: true,
    },
    orderBy: {
      dataAgendada: "asc",
    },
    take: 5,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo(a) à visão geral da sua operação.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Caçambas Locadas</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCacambasLocadas}</div>
            <p className="text-xs text-muted-foreground">Atualmente no local</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Entregas Pendentes</CardTitle>
            <Map className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entregasPendentesGeral}</div>
            <p className="text-xs text-muted-foreground">{entregasPendentesHj} para hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Retiradas em Atraso</CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{retiradasAtraso}</div>
            <p className="text-xs text-muted-foreground">Requer atenção imediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Operações Concluídas</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationsDoneThisMonth}</div>
            <p className="text-xs text-muted-foreground">Realizadas neste mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>Operações diárias (em breve Gráficos Reais)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 border-dashed border-2 rounded-md m-4">
            <span className="text-muted-foreground">Integração com Recharts planejada</span>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Próximas Operações</CardTitle>
            <CardDescription>Entregas e retiradas agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximasOperacoes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma operação pendente.</p>
              ) : (
                proximasOperacoes.map((op) => (
                  <div key={op.id} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${op.tipo === 'ENTREGA' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{op.tipo} - {op.obra.endereco}</p>
                      <p className="text-sm text-muted-foreground">{op.obra.cliente.nome} - Caçamba #{op.cacamba.numero}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(op.dataAgendada).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
