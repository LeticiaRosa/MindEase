import { Link } from "react-router-dom";
import {
  Button,
  Logo,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui";
import {
  Brain,
  CheckCircle2,
  Clock,
  Focus,
  Kanban,
  Palette,
  Sparkles,
  Bell,
  CalendarRange,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { AppearanceMenuPanel } from "@/presentation/components/AppearanceMenuPanel";

// ── Feature card ──────────────────────────────────────────────────────────────

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

// ── Benefit row ───────────────────────────────────────────────────────────────

type BenefitRowProps = {
  text: string;
};

function BenefitRow({ text }: BenefitRowProps) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
      <span>{text}</span>
    </li>
  );
}

// ── Differential card ─────────────────────────────────────────────────────────

type DifferentialCardProps = {
  title: string;
  description: string;
};

function DifferentialCard({ title, description }: DifferentialCardProps) {
  return (
    <div className="space-y-2 border-l-2 border-primary/40 pl-5">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
          <Logo size="sm" />
          <div className="flex items-center gap-1.5 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Aparência"
                >
                  <Palette className="size-4" />
                  <span className="hidden sm:inline">Aparência</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-72 p-4"
              >
                <AppearanceMenuPanel alwaysOpen />
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden sm:block">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
            </div>
            <div className="sm:hidden">
              <Button size="sm" asChild>
                <Link to="/login">Acessar grátis</Link>
              </Button>
            </div>
            <div className="hidden sm:block">
              <Button size="sm" asChild>
                <Link to="/register">Criar conta grátis</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-24 text-center">
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          Projetado para mentes que funcionam diferente
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Organize sua vida acadêmica
            <br />
            <span className="text-primary">sem sobrecarga cognitiva</span>
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            MindEase ajuda pessoas com TDAH, TEA, dislexia e sobrecarga
            cognitiva a estudar, trabalhar e avançar — uma etapa de cada vez.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" className="gap-2 px-8" asChild>
            <Link to="/register">
              Começar agora
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/login">Já tenho conta</Link>
          </Button>
        </div>

        <a
          href="#features"
          className="mt-4 flex flex-col items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          aria-label="Ver funcionalidades"
        >
          <span>Veja como funciona</span>
          <ChevronDown className="size-4 animate-bounce" />
        </a>
      </section>

      {/* ── What it does ─────────────────────────────────────────────────── */}
      <section
        id="features"
        className="border-t border-border/50 bg-muted/30 px-6 py-20"
      >
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="mx-auto max-w-xl space-y-3 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Tudo que você precisa, sem complexidade desnecessária
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Cada funcionalidade foi pensada para reduzir a fricção e manter
              seu foco no próximo passo.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Kanban className="size-5" />}
              title="Organizador de tarefas"
              description="Kanban visual simplificado. Divida grandes desafios em etapas pequenas e movimente tarefas conforme avança."
            />
            <FeatureCard
              icon={<Clock className="size-5" />}
              title="Temporizador Pomodoro"
              description="Sessões de foco adaptáveis ao seu perfil. Pausas automáticas para evitar a sobrecarga e manter a produtividade."
            />
            <FeatureCard
              icon={<Bell className="size-5" />}
              title="Alertas cognitivos"
              description="Lembretes gentis baseados na sua atividade. Nunca interruptivos — apenas um suave toque quando você precisa."
            />
            <FeatureCard
              icon={<CalendarRange className="size-5" />}
              title="Rotinas inteligentes"
              description={
                'Estruture seu dia em blocos previsíveis. Rotinas visuais reduzem a ansiedade de "o que fazer agora?".'
              }
            />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="mx-auto max-w-xl space-y-3 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Simples de usar desde o primeiro dia
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Crie sua conta",
                description:
                  "Cadastro rápido. Nenhuma configuração complicada necessária para começar.",
              },
              {
                step: "2",
                title: "Adicione suas tarefas",
                description:
                  "Coloque tudo que precisa fazer. O MindEase ajuda a dividir em etapas menores.",
              },
              {
                step: "3",
                title: "Foque no próximo passo",
                description:
                  "O app guia sua atenção para o que importa agora, sem sobrecarregar sua memória de trabalho.",
              },
            ].map(({ step, title, description }) => (
              <div
                key={step}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="flex size-10 items-center justify-center rounded-full border-2 border-primary/40 text-sm font-semibold text-primary">
                  {step}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="border-t border-border/50 bg-muted/30 px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 sm:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Brain className="size-5 text-primary" />
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Feito para o seu cérebro
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                O MindEase foi projetado com neurodivergência em mente. Cada
                detalhe reduz a barreira entre a intenção e a ação.
              </p>
            </div>
            <ul className="space-y-3.5">
              <BenefitRow text="Interface limpa e espaçada — sem poluição visual que dispersa o foco" />
              <BenefitRow text="Complexidade ajustável: ative mais recursos conforme sua necessidade" />
              <BenefitRow text="Preferências de fonte, espaçamento e contraste persistem entre sessões" />
              <BenefitRow text="Notificações gentis, sem interrupções bruscas ou pop-ups invasivos" />
              <BenefitRow text="Indicadores de foco visíveis em todo elemento interativo (acessibilidade)" />
              <BenefitRow text="Divulgação progressiva: mostra menos, foca no próximo passo" />
            </ul>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Focus className="size-5 text-primary" />
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Para quem é o MindEase?
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Qualquer pessoa que sente que o cérebro funciona em modo difícil
                — especialmente em ambientes acadêmicos e profissionais.
              </p>
            </div>
            <ul className="space-y-3.5">
              <BenefitRow text="Estudantes e profissionais com TDAH que lutam contra procrastinação e desorganização" />
              <BenefitRow text="Pessoas no espectro autista que se beneficiam de rotinas estruturadas e previsíveis" />
              <BenefitRow text="Quem tem dislexia e precisa de textos curtos, diretos e sem ambiguidade" />
              <BenefitRow text="Qualquer pessoa em sobrecarga cognitiva que quer simplicidade e clareza" />
            </ul>
          </div>
        </div>
      </section>

      {/* ── Differentials ────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="mx-auto max-w-xl space-y-3 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Por que o MindEase é diferente?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Não é mais um app de produtividade genérico. É uma plataforma
              construída do zero para mentes que processam o mundo de forma
              diferente.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <DifferentialCard
              title="Acessibilidade cognitiva no design"
              description="Cada componente segue princípios de baixa estimulação visual, espaçamento generoso e previsibilidade — não como acessório, mas como base do design."
            />
            <DifferentialCard
              title="Complexidade que cresce com você"
              description='Comece simples, ative mais recursos conforme precisar. O modo "simples" e o modo "complexo" coexistem — você decide o quanto quer ver.'
            />
            <DifferentialCard
              title="Sem distração de outros usuários"
              description="Sem feed social, sem comparações, sem pressão de performance. O foco é inteiramente seu, no seu ritmo."
            />
            <DifferentialCard
              title="Preferências que persistem"
              description="Tamanho de fonte, espaçamento, tema e modo de foco são salvos automaticamente — sem precisar reconfigurar a cada visita."
            />
            <DifferentialCard
              title="Alertas baseados em comportamento"
              description="O sistema detecta padrões de atividade e sugere pausas ou atenção antes que a sobrecarga aconteça — de forma não invasiva."
            />
            <DifferentialCard
              title="Decomposição visual de tarefas"
              description="Transforme qualquer objetivo grande em etapas visuais menores. Cada clique concluído é um sinal claro de progresso."
            />
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-border/50 bg-muted/30 px-6 py-20">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Pronto para começar com clareza?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Crie sua conta gratuita e descubra como é organizar sua vida de
            forma que seu cérebro realmente consegue acompanhar.
          </p>
          <Button size="lg" className="gap-2 px-10" asChild>
            <Link to="/register">
              Criar conta grátis
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Gratuito para começar · Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <Logo size="sm" />
          <p>
            © {new Date().getFullYear()} MindEase. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
