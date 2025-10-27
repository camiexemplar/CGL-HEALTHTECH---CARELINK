import type { DadosPaciente } from "../../../types/Paciente";
import { ListaDeFatores } from "./ListaDeFatores";
import { CuidadorCard } from "./CuidadorCard";
import { PacienteCard } from "./PacienteCard";
import { ProximaConsultaCard } from "./ProximaConsultaCard";
import { ScoreDeRiscoCard } from "./ScoreDeRiscoCard";

export interface BlocoIdentificacaoProps {
  paciente: DadosPaciente;
}

export function BlocoIdentificacao({
  paciente: paciente,
}: BlocoIdentificacaoProps) {
  return (
    <div className="space-y-6">
      <PacienteCard
        nome={paciente.nomePaciente}
        telefone={paciente.telefonePaciente}
        bairro={paciente.bairroPaciente}
        dataNascimento={paciente.dataNascimentoPaciente}
      />

      {paciente.cuidador && (
        <CuidadorCard
          nomeCuidador={paciente.cuidador.nomeCuidador}
          telefoneCuidador={paciente.cuidador.telefoneCuidador}
        />
      )}

      <ScoreDeRiscoCard scoreDeRisco={paciente.scoreDeRisco} nivelDeRisco={paciente.nivelDeRisco} />

      <ListaDeFatores fatoresDeRisco={paciente.fatoresDeRisco ?? []} />

      <ProximaConsultaCard proximaConsulta={paciente.proximaConsulta} />
    </div>
  );
}
