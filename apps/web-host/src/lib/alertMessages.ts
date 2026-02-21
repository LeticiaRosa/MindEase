import type { BrainStateValue } from "@/domain/valueObjects/BrainState";
import type { AlertTone, AlertTrigger } from "@/domain/valueObjects/AlertTypes";

type MessageTable = Record<
  AlertTrigger,
  Record<BrainStateValue, Record<AlertTone, string>>
>;

export const alertMessages: MessageTable = {
  "same-task-too-long": {
    focado: {
      direto:
        "Você está há muito tempo nessa tarefa. Que tal uma pausa rápida?",
      acolhedor:
        "Você está indo bem! Uma pequena pausa pode ajudar a manter o foco.",
      reflexivo: "Você já parou para respirar desde que começou essa tarefa?",
      sugestao:
        "Experimente fazer uma pausa de 5 minutos para recarregar as energias.",
    },
    cansado: {
      direto: "Você está cansado e nessa tarefa há muito tempo. Pause agora.",
      acolhedor:
        "Percebo que você está cansado. Uma pausa vai te ajudar muito.",
      reflexivo:
        "Quando foi a última vez que você se levantou e se moveu um pouco?",
      sugestao:
        "Que tal uma pausa de 10 minutos? Água e um alongamento podem fazer diferença.",
    },
    sobrecarregado: {
      direto: "Muita coisa. Pause e volte depois.",
      acolhedor:
        "Você está se esforçando muito. Está tudo bem parar por um momento.",
      reflexivo: "Essa tarefa é realmente necessária fazer agora?",
      sugestao:
        "Mostrar só o próximo passo pode ajudar. Quer dividir essa tarefa?",
    },
    ansioso: {
      direto:
        "Você está há 40 min nessa tarefa. Quer fazer uma pausa de 2 min?",
      acolhedor:
        "Respira fundo antes de continuar? Uma pausa rápida pode aliviar.",
      reflexivo: "O que está te impedindo de pausar agora?",
      sugestao: "Tente a pausa 4-7-8: inspire por 4s, segure 7s, expire 8s.",
    },
    disperso: {
      direto: "Você está disperso nessa tarefa faz tempo. Troque ou pause.",
      acolhedor:
        "Parece que a atenção foi embora. Só você e essa tarefa por 5 minutos?",
      reflexivo: "O que te ajudaria a voltar o foco agora?",
      sugestao:
        "Defina um mini-objetivo: o que precisa fazer apenas nos próximos 10 minutos?",
    },
  },
  "task-switching": {
    focado: {
      direto: "Você mudou de tarefa várias vezes. Escolha uma e fique nela.",
      acolhedor:
        "Multitarefa cansa o cérebro. Escolher só uma tarefa vai te ajudar.",
      reflexivo: "Qual das suas tarefas é realmente a mais importante agora?",
      sugestao: "Escolha uma tarefa e trabalhe nela por pelo menos 10 minutos.",
    },
    cansado: {
      direto:
        "Você trocou de tarefa muitas vezes. Descanse antes de continuar.",
      acolhedor:
        "Quando estamos cansados, trocar de tarefa é tentador. Que tal uma pausa?",
      reflexivo: "Você está realmente conseguindo progredir ou só adiando?",
      sugestao: "Feche as outras tarefas da vista. Só uma por vez agora.",
    },
    sobrecarregado: {
      direto: "Muitas tarefas abertas. Feche tudo exceto uma.",
      acolhedor:
        "É muita coisa ao mesmo tempo. Você não precisa fazer tudo agora.",
      reflexivo: "Se você pudesse fazer só uma coisa hoje, qual seria?",
      sugestao: "Escolha UMA tarefa e arquive as outras por agora.",
    },
    ansioso: {
      direto:
        "Você mudou de tarefa 3 vezes. Quer escolher só uma por 10 minutos?",
      acolhedor:
        "Às vezes a ansiedade nos faz pular de tarefa em tarefa. Respiremos.",
      reflexivo: "O que está te deixando ansioso nessas tarefas?",
      sugestao: 'Tente o método "uma tarefa por 10 minutos" antes de trocar.',
    },
    disperso: {
      direto: "Foco disperso detectado. Volte para uma tarefa só.",
      acolhedor:
        "Parece que a atenção está espalhada. Faz parte. Vamos reunir o foco?",
      reflexivo: "O que está competindo pela sua atenção nesse momento?",
      sugestao:
        "Coloque um timer de 15 minutos e não troque de tarefa até ele tocar.",
    },
  },
  inactivity: {
    focado: {
      direto: "Você está inativo há algum tempo. Ainda por aqui?",
      acolhedor: "Notei que você ficou parado. Tudo bem?",
      reflexivo: "O que está passando pela sua cabeça agora?",
      sugestao:
        "Se você travou, tente escrever só a próxima ação, por menor que seja.",
    },
    cansado: {
      direto: "Inativo há muito tempo. Talvez seja hora de pausar de verdade.",
      acolhedor: "Parece que o cansaço ganhou. Está tudo bem descansar.",
      reflexivo: "Seu corpo está pedindo uma pausa?",
      sugestao: "Que tal uma micro-tarefa de 5 minutos para retomar o ritmo?",
    },
    sobrecarregado: {
      direto: "Muita coisa parou tudo. Um passo de cada vez.",
      acolhedor:
        "Travou? Acontece com todos. O que seria o menor passo possível agora?",
      reflexivo: "O que está te impedindo de proceder?",
      sugestao: "Escreva em uma palavra o que está te bloqueando.",
    },
    ansioso: {
      direto: "Parado há um tempo. Respira e dá um pequeno passo.",
      acolhedor: "A ansiedade às vezes paralisa. Você não está sozinho nisso.",
      reflexivo: "O que o pior cenário seria se você continuasse agora?",
      sugestao:
        "Faça só uma coisa pequeníssima: abra o documento, escreva uma linha.",
    },
    disperso: {
      direto: "Inativo e disperso. Retome com uma tarefa simples.",
      acolhedor: "A mente viajou? Tudo bem. Vamos trazer ela de volta devagar.",
      reflexivo: "Onde sua atenção foi nesse tempo?",
      sugestao:
        "Coloque uma música instrumental e comece pela tarefa mais fácil.",
    },
  },
  "time-overrun": {
    focado: {
      direto: "Você ultrapassou o tempo planejado. Avalie continuar ou pausar.",
      acolhedor: "O tempo planejado passou. Você está progredindo bem?",
      reflexivo: "Essa tarefa tomou mais tempo do que o esperado. Por quê?",
      sugestao:
        "Decida: mais 15 minutos e finalize, ou pause e continue amanhã.",
    },
    cansado: {
      direto: "Tempo esgotado e você está cansado. Pare por hoje.",
      acolhedor:
        "Você já fez muito. Continuar cansado pode atrapalhar mais do que ajudar.",
      reflexivo: "Forçar agora vai te custar mais amanhã?",
      sugestao: "Anote onde você parou e retome descansado.",
    },
    sobrecarregado: {
      direto: "Seu ritmo caiu. Que tal uma micro-tarefa de 5 minutos?",
      acolhedor:
        "Você se dedicou muito além do planejado. Isso pesa. Descanse.",
      reflexivo: "O que aconteceria se você simplesmente parasse agora?",
      sugestao: "Divida o restante em pedaços de 20 minutos para amanhã.",
    },
    ansioso: {
      direto: "Tempo ultrapassado. Pause antes que a ansiedade aumente.",
      acolhedor:
        "Ir além do tempo pode aumentar a pressão. Você merece uma pausa.",
      reflexivo: "Você está continuando por necessidade ou por ansiedade?",
      sugestao:
        "Defina um critério claro: o que precisaria estar pronto para pausar?",
    },
    disperso: {
      direto: "Tempo ultrapassado por dispersão. Foque no próximo passo.",
      acolhedor: "O tempo foi embora rapidinho. Vamos focar no essencial?",
      reflexivo: "O que você realmente conseguiu fazer nesse tempo?",
      sugestao:
        "Liste apenas as 2 coisas mais importantes que ainda precisam fechar.",
    },
  },
  "complex-task": {
    focado: {
      direto: "Tarefa complexa. Dividir pode ajudar a progredir mais rápido.",
      acolhedor: "Tarefas complexas são desafios. Você consegue!",
      reflexivo: "Como você poderia dividir essa tarefa em partes menores?",
      sugestao: "Antes de começar, liste 3 sub-tarefas. Comece pela menor.",
    },
    cansado: {
      direto: "Tarefa complexa + cansaço é difícil. Considere adiar.",
      acolhedor:
        "Tarefas complexas pedem energia. Você está com energia agora?",
      reflexivo:
        "Esse é o melhor momento para essa tarefa ou você pode reagendá-la?",
      sugestao:
        "Faça apenas a parte mais fácil dessa tarefa e deixe o resto para amanhã.",
    },
    sobrecarregado: {
      direto: "Talvez seja muita coisa agora. Mostrar só o próximo passo?",
      acolhedor:
        "Uma tarefa complexa quando sobrecarregado é muito pesado. Vamos simplificar.",
      reflexivo: "Essa tarefa precisa ser feita hoje ou pode aguardar?",
      sugestao: "Identifique apenas UM sub-passo e faça só ele.",
    },
    ansioso: {
      direto: "Tarefa complexa detectada. Respira primeiro, depois começa.",
      acolhedor:
        "Tarefas complexas podem gerar ansiedade. É normal. Vamos devagar.",
      reflexivo: "O que especificamente nessa tarefa gera mais ansiedade?",
      sugestao:
        "Escreva o pior cenário possível e depois o mais provável. Isso pode aliviar.",
    },
    disperso: {
      direto:
        "Tarefa complexa requer foco. Remova distrações antes de começar.",
      acolhedor: "Para tarefas complexas, ambiente calmo ajuda muito.",
      reflexivo: "O que você precisa para conseguir se concentrar agora?",
      sugestao:
        "Coloque o celular de lado, feche abas desnecessárias e comece pelo começo.",
    },
  },
};

/**
 * Safely look up a message, falling back to a generic message if the key is missing.
 */
export function getAlertMessage(
  trigger: AlertTrigger,
  brainState: BrainStateValue,
  tone: AlertTone,
): string {
  return (
    alertMessages[trigger]?.[brainState]?.[tone] ??
    alertMessages[trigger]?.["focado"]?.["direto"] ??
    "Hora de verificar seu foco. Como você está indo?"
  );
}
